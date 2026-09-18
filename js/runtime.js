/* ==========================================================================
   runtime.js — справжній Python у браузері (Pyodide) + світ маяка.
   Дитина пише код українськими командами, маяк оживає, а помилки
   перекладаються в спокійний голос світу маяка.
   ========================================================================== */

const PYODIDE_VER = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VER}/`;

const WORLD_DEFAULTS = { ticks: 6, fuel: 12, cans: 3, wind: 'тиша', guest: false, night: false };

let _pyodide = null, _loading = null;

/* Дії, які код нашкодив за один запуск. Буфер один, бо запуски
   вишикувані в чергу (_queue) — дві пісочниці ніколи не пишуть сюди разом. */
let _actions = [];
window.__lhPush = (type, arg) => { _actions.push({ type, arg }); };

/* черга запусків: Pyodide один на сторінку, тож по одному за раз */
let _queue = Promise.resolve();
function serialize(job){
  const next = _queue.then(job, job);
  _queue = next.catch(()=>{});
  return next;
}

function loadScript(src){
  return new Promise((res, rej)=>{
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = ()=>rej(new Error('script '+src));
    document.head.appendChild(s);
  });
}

async function getPyodide(onStatus){
  if(_pyodide) return _pyodide;
  if(_loading) return _loading;
  _loading = (async ()=>{
    if(onStatus) onStatus('Прокидається маяк… (перший раз триває кілька секунд)');
    if(!window.loadPyodide) await loadScript(PYODIDE_URL + 'pyodide.js');
    _pyodide = await window.loadPyodide({ indexURL: PYODIDE_URL });
    return _pyodide;
  })();
  // якщо не вдалось — забути невдалу спробу, щоб наступний «Запустити» пробував заново
  _loading.catch(()=>{ _loading = null; });
  return _loading;
}

/* ---- Python-пролог: команди маяка, банки, захист від зависань ---- */
const PRELUDE = `
import sys, json
from js import __lhPush

_STEPS = 0
_LINES = 0
_CAP_STEPS = 120
_CAP_LINES = 40000

_SHOW_NIGHT = bool(_cfg_shownight)

ніч = int(_cfg_ticks)
запас = int(_cfg_fuel)
каністри = int(_cfg_cans)
вітер = str(_cfg_wind)
_guest = bool(_cfg_guest)

ряд = ["соняшник 1", "соняшник 2", "соняшник 3"]

class _StopSafely(Exception):
    """Зупинка своєю рукою: не помилка дитини, а запобіжник маяка."""

_JARS_MAX = 6
_LAST_JARS = None

def _jars():
    """Підглянути в банки на підвіконні й показати їх на маяку.
    Банки маяка — перші, а далі ті, що дитина завела сама (будь-яке своє число)."""
    g = globals()
    out = {}
    named = ("ніч", "запас", "каністри") if _SHOW_NIGHT else ("запас", "каністри")
    for name in named:
        v = g.get(name)
        if isinstance(v, int) and not isinstance(v, bool):
            out[name] = v
    for name, v in g.items():
        if len(out) >= _JARS_MAX:
            break
        if name.startswith("_") or name in out:
            continue
        if name == "ніч" and not _SHOW_NIGHT:
            continue
        if isinstance(v, int) and not isinstance(v, bool):
            out[name] = v
    # нічого не змінилось — не смикаємо браузер марно. Саме це рятує
    # зациклену програму від того, щоб думати хвилину замість секунди.
    global _LAST_JARS
    if out == _LAST_JARS:
        return
    _LAST_JARS = dict(out)
    __lhPush("jars", json.dumps(out))

def _tick():
    global _STEPS
    _STEPS += 1
    if _STEPS > _CAP_STEPS:
        raise _StopSafely("too-many-steps")
    _jars()

def протерти_скло():        _tick(); __lhPush("clean", None)
def підрівняти_гніт():      _tick(); __lhPush("trim", None)
def повернути_лінзу(напрям="північ"): _tick(); __lhPush("lens", str(напрям))
def запалити_вогонь():      _tick(); __lhPush("ignite", None)
def повне_світло():         _tick(); __lhPush("full", None)
def притлумити_гніт():      _tick(); __lhPush("dim", None)
def обернути_промінь():     _tick(); __lhPush("rotate", None)
def дати_воду(соняшник=None):_tick(); __lhPush("water", None)

def темно():
    """Просто дивиться в банку «ніч» і відповідає так або ні.
    Сама вона нічого не міняє: ніч коротшає тільки тоді,
    коли ти сам відсипаєш із неї насінину."""
    return globals().get("ніч", 0) > 0

def гість_на_стежці():
    return _guest

def полічити(що):
    try: return len(що)
    except TypeError: return що

def _словом(a):
    """Маяк говорить українською навіть про «так» і «ні»."""
    if a is True:  return "так"
    if a is False: return "ні"
    if a is None:  return "нічого"
    return str(a)

def показати(*args):
    _jars()
    __lhPush("print", " ".join(_словом(a) for a in args))

def _guard(frame, event, arg):
    global _LINES
    if event == "line":
        _LINES += 1
        if _LINES > _CAP_LINES:
            raise _StopSafely("endless-loop")
    return _guard

sys.settrace(_guard)
`;

/* ---- слова, які маяк знає: для підказки «може, тут мало бути…» ---- */
const KNOWN_WORDS = [
  'протерти_скло', 'підрівняти_гніт', 'повернути_лінзу', 'запалити_вогонь',
  'повне_світло', 'притлумити_гніт', 'обернути_промінь', 'дати_воду',
  'показати', 'темно', 'гість_на_стежці', 'полічити',
  'ніч', 'запас', 'каністри', 'вітер', 'ряд', 'range'
];

/* команди, які без дужок нічого не роблять — на них озивається Цербер */
const COMMAND_WORDS = [
  'протерти_скло', 'підрівняти_гніт', 'повернути_лінзу', 'запалити_вогонь',
  'повне_світло', 'притлумити_гніт', 'обернути_промінь', 'дати_воду',
  'показати', 'темно', 'гість_на_стежці', 'полічити'
];

/* наскільки два слова різні — скільки букв треба виправити */
function distance(a, b){
  a = a.toLowerCase(); b = b.toLowerCase();
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for(let i = 1; i <= a.length; i++){
    let diag = prev[0];
    prev[0] = i;
    for(let j = 1; j <= b.length; j++){
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

/* найсхожіше слово, яке маяк знає — або null, якщо нічого й близько нема */
function closestWord(word, extra){
  const pool = KNOWN_WORDS.concat(extra || []);
  const limit = word.length <= 4 ? 1 : (word.length <= 8 ? 2 : 3);
  let best = null, bestD = Infinity;
  for(const w of pool){
    const d = distance(word, w);
    if(d < bestD){ bestD = d; best = w; }
  }
  return bestD <= limit ? best : null;
}

/* ---- переклад помилок у голос світу маяка ---- */
function translateError(raw, code){
  const msg = String(raw || '');
  if(msg.includes('_StopSafely')){
    return 'Цугі каже: цей цикл крутиться й крутиться, а кінця не видно. ' +
           'Усередині має бути щось, що потроху наближає кінець — наприклад «ніч = ніч - 1».';
  }
  const lines = msg.trim().split('\n').filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if(/expected an indented block/.test(msg))
    return 'Після двокрапки всередині порожньо. Там має бути хоча б один крок, зсунутий вправо (коментар не рахується).';
  const m = last.match(/(\w*Error):?\s*(.*)/);
  const kind = m ? m[1] : '';
  const detail = m ? m[2] : '';
  switch(kind){
    case 'SyntaxError':
      return 'Здається, десь загубився знак — можливо, дужка чи двокрапка. Придивись до рядка уважно.';
    case 'IndentationError':
      return 'Цей рядок стоїть не на своєму місці. Згадай: те, що всередині — зсунуте вправо на крок (відступ).';
    case 'NameError': {
      const nm = (detail.match(/'([^']+)'/) || [, ''])[1];
      /* імена, які дитина завела сама — їх маяк теж «знає» */
      const mine = [...String(code || '').matchAll(/(?:^|\n)[ \t]*(?:def[ \t]+)?([^\W\d]\w*)[ \t]*[=(]/g)]
        .map(x => x[1]).filter(w => w !== nm);
      const near = closestWord(nm, mine);
      return near
        ? `Маяк не знає слова «${nm}». Може, тут мало бути «${near}»?`
        : `Маяк не знає слова «${nm}». Пошукай у ньому одрук — або дай цьому ім’я, перш ніж кликати.`;
    }
    case 'TypeError':
      return 'Ця команда отримала не те, чого чекала. Перевір, що саме стоїть у дужках.';
    case 'ZeroDivisionError':
      return 'На нуль ділити не можна — навіть маякові. Спробуй інше число.';
    case 'RecursionError':
      return 'Звичка покликала саму себе — і так без кінця. Перевір, чи має вона місце, де спиняється.';
    default:
      return detail ? (kind ? kind + ': ' + detail : detail) : 'Щось пішло не так. Спробуй ще раз — це нормально.';
  }
}

/* ---- Цербер: помічає ім'я дії, написане без дужок ---- */
function cerberusNote(code){
  const re = new RegExp('(?:^|\\n)[ \\t]*(' + COMMAND_WORDS.join('|') + ')[ \\t]*(?:#[^\\n]*)?(?=\\n|$)', 'g');
  const hit = re.exec(String(code || ''));
  if(!hit) return null;
  const name = hit[1];
  return `\u{1F415} Цербер підняв голову: «Це ім’я дії — «${name}». Саме собою воно нічого не робить. ` +
         `Хочеш, щоб воно сталося — додай дужки: ${name}().»`;
}

/* ---- запуск коду дитини ---- */

/* один запуск у своєму, чистому просторі імен.
   Повертає {acts, jars, error} — що сталось у світі маяка. */
function execute(py, userCode, world){
  _actions = [];
  const ns = py.globals.get('dict')();
  ns.set('_cfg_ticks',     world.ticks);
  ns.set('_cfg_fuel',      world.fuel);
  ns.set('_cfg_cans',      world.cans);
  ns.set('_cfg_wind',      world.wind);
  ns.set('_cfg_guest',     world.guest);
  ns.set('_cfg_shownight', !!world.night);

  let error = null;
  try{
    py.runPython(PRELUDE, { globals: ns });
    py.runPython(userCode, { globals: ns });
    py.runPython('_jars()', { globals: ns });   // останній погляд на банки
  }catch(e){
    error = e;
  }finally{
    try{ py.runPython('import sys; sys.settrace(None)'); }catch(_){}
    ns.destroy();
  }

  const acts = _actions.slice();
  const lastJars = [...acts].reverse().find(a => a.type === 'jars');
  return { acts, jars: lastJars ? safeJSON(lastJars.arg) : {}, code: userCode, world, error };
}

function safeJSON(raw){ try{ return JSON.parse(raw); }catch(e){ return {}; } }

/* запуск, який видно й чути: з маяком, журналом і перекладом помилок */
async function runCode(userCode, world, ui){
  let py;
  try{
    py = await getPyodide(ui.status);
  }catch(e){
    ui.clearConsole();
    ui.log('Не вдалось розбудити маяк (немає інтернету для завантаження Python).', 'err');
    return null;
  }

  ui.clearConsole();
  const res = execute(py, userCode, world);
  await ui.view.play(res.acts, (t)=>ui.log(t));   // програємо навіть те, що встигло статись до помилки

  const woof = cerberusNote(userCode);
  if(woof) ui.log(woof, 'cerb');

  if(res.error){ ui.log(translateError(res.error.message, userCode), 'err'); return res; }
  const lit = res.acts.some(a => a.type === 'ignite' || a.type === 'full');
  ui.log(lit ? '✔ Маяк світить.' : 'Готово.', 'ok');
  return res;
}

/* тихий запуск — для перевірки завдання в іншу погоду (без маяка й журналу) */
async function runQuiet(userCode, world){
  const py = await getPyodide();
  return execute(py, userCode, world);
}

/* ==========================================================================
   Палітра команд — щоб восьмирічному не доводилось вибивати кожну літеру.
   Натиснув — рядок з'явився в редакторі сам, з дужками й відступом.
   ========================================================================== */
const PALETTE = [
  { grp:'дії маяка', items:[
    { l:'протерти_скло()' },
    { l:'підрівняти_гніт()' },
    { l:'повернути_лінзу("північ")' },
    { l:'запалити_вогонь()' },
    { l:'повне_світло()' },
    { l:'притлумити_гніт()' },
    { l:'обернути_промінь()' },
    { l:'дати_воду(соняшник)' },
    { l:'показати(…)', ins:'показати("")', back:2 }
  ]},
  { grp:'банки', items:[
    { l:'ніч = ніч - 1' },
    { l:'запас = запас - 1' },
    { l:'каністри = каністри - 1' }
  ]},
  { grp:'правила', items:[
    { l:'while темно():', ins:'while темно():\n' },
    { l:'for … in ряд:',  ins:'for соняшник in ряд:\n' },
    { l:'if вітер == "сильний":', ins:'if вітер == "сильний":\n' },
    { l:'else:', ins:'else:\n' },
    { l:"def ім'я():", ins:"def ім'я():\n", back:4 }
  ]}
];

/* ==========================================================================
   Sandbox — збирає редактор, маяк і консоль в одному блоці
   ========================================================================== */
const escapeHTML = (s) => String(s ?? '').replace(/[&<>"]/g, c => (
  { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]
));

class Sandbox {
  constructor(mount, opts){
    this.opts = opts || {};
    mount.classList.add('sandbox');
    mount.dataset.ready = '1';
    mount.innerHTML = `
      <div class="sb-head">
        <span class="sb-title">${escapeHTML(this.opts.title || 'Журнал маяка — пісочниця')}</span>
        <div class="sb-scenario"></div>
      </div>
      <div class="sb-grid">
        <div>
          <details class="palette" open>
            <summary>Команди маяка — натисни, і рядок з'явиться сам</summary>
            <div class="palette-body">${PALETTE.map(g =>
              `<div class="palette-grp"><span class="palette-name">${g.grp}</span>` +
              g.items.map((it, i) =>
                `<button type="button" class="chip-cmd" data-grp="${PALETTE.indexOf(g)}" data-i="${i}">` +
                `${escapeHTML(it.l)}</button>`).join('') + `</div>`).join('')}
            </div>
          </details>
          <div class="sb-editor"><textarea spellcheck="false" aria-label="Код для маяка"></textarea></div>
          <div class="sb-controls">
            <button class="btn run" type="button">▶ Запустити</button>
            <button class="btn ghost reset small" type="button">↺ Спочатку</button>
            <span class="hint mini">Ctrl + Enter</span>
          </div>
        </div>
        <div class="sb-stage"></div>
      </div>
      <div class="console" role="log" aria-live="polite">Натисни «Запустити», щоб маяк ожив.</div>
      <div class="verdict" role="status" aria-live="polite" hidden></div>
    `;
    this.task       = this.opts.task || null;
    this.ta         = mount.querySelector('textarea');
    this.consoleEl  = mount.querySelector('.console');
    this.verdictEl  = mount.querySelector('.verdict');
    this.runBtn     = mount.querySelector('.run');
    this.resetBtn   = mount.querySelector('.reset');
    this.view       = new LighthouseView(mount.querySelector('.sb-stage'));

    this.seed = String(this.opts.seed || '').replace(/^\n/, '').replace(/\s+$/, '');
    this.ta.value = this.seed;
    this.autoRows();

    // сценарій погоди (для розділу з галуженням)
    if(this.opts.scenarios){
      const box = mount.querySelector('.sb-scenario');
      box.innerHTML = `<select class="pick" aria-label="погода">
        <option value="storm">погода: сильний вітер</option>
        <option value="guest">погода: гість на стежці</option>
        <option value="calm">погода: тиша</option>
      </select>`;
      this.scenarioSel = box.querySelector('select');
    }

    this.ui = {
      view: this.view,
      status: (t)=>{ this.consoleEl.innerHTML = `<span class="cat">🐈 ${escapeHTML(t)}</span>`; },
      clearConsole: ()=>{ this.consoleEl.textContent = ''; this.hideVerdict(); this.resetStage(); },
      log: (t, cls)=>{
        const d = document.createElement('div');
        if(cls) d.className = cls;
        d.textContent = t;
        this.consoleEl.appendChild(d);
        this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
      }
    };

    mount.querySelectorAll('.chip-cmd').forEach(btn => {
      btn.addEventListener('click', ()=>{
        const it = PALETTE[+btn.dataset.grp].items[+btn.dataset.i];
        this.insertLine(it.ins || (it.l + '\n'), it.back || 0);
      });
    });

    this.runBtn.addEventListener('click', ()=>this.run());
    this.resetBtn.addEventListener('click', ()=>this.restore());
    this.ta.addEventListener('input', ()=>this.autoRows());
    this.ta.addEventListener('keydown', (e)=>this.onKey(e));
    this.resetStage();
  }

  /* відступ рядка, у якому зараз курсор */
  lineIndent(pos){
    const v = this.ta.value;
    const from = v.lastIndexOf('\n', pos - 1) + 1;
    const line = v.slice(from, pos);
    return (line.match(/^[ \t]*/) || [''])[0];
  }

  /* вставити текст у позицію курсора */
  put(text, caretBack){
    const v = this.ta.value, a = this.ta.selectionStart, b = this.ta.selectionEnd;
    this.ta.value = v.slice(0, a) + text + v.slice(b);
    const at = a + text.length - (caretBack || 0);
    this.ta.selectionStart = this.ta.selectionEnd = at;
    this.autoRows();
    this.ta.focus();
  }

  /* вставити цілий рядок з кнопки: з нового рядка й з тим самим відступом */
  insertLine(text, caretBack){
    const v = this.ta.value;
    let a = this.ta.selectionStart;
    if(a === 0 && v.trim() === ''){ this.ta.selectionStart = this.ta.selectionEnd = a = 0; }
    const from = v.lastIndexOf('\n', a - 1) + 1;
    const before = v.slice(from, a);
    const indent = (before.match(/^[ \t]*/) || [''])[0];
    const head = before.trim() === '' ? '' : '\n' + indent;
    /* рядок, що відкриває блок, сам просить наступний відступ */
    const opensBlock = /:\s*\n$/.test(text);
    const body = text.replace(/\n$/, opensBlock ? '\n' + indent + '    ' : '\n' + indent);
    this.put(head + body, caretBack);
  }

  onKey(e){
    if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); this.run(); return; }

    if(e.key === 'Tab'){
      e.preventDefault();
      this.put('    ', 0);
      return;
    }

    /* Enter сам тримає відступ, а після двокрапки — зсуває ще на крок */
    if(e.key === 'Enter' && !e.shiftKey){
      const pos = this.ta.selectionStart;
      if(pos !== this.ta.selectionEnd) return;
      const v = this.ta.value;
      const from = v.lastIndexOf('\n', pos - 1) + 1;
      const line = v.slice(from, pos);
      let indent = (line.match(/^[ \t]*/) || [''])[0];
      if(/:\s*$/.test(line.replace(/#.*$/, ''))) indent += '    ';
      if(!indent) return;
      e.preventDefault();
      this.put('\n' + indent, 0);
      return;
    }

    /* Backspace усередині відступу знімає цілий крок, а не один пробіл */
    if(e.key === 'Backspace' && this.ta.selectionStart === this.ta.selectionEnd){
      const pos = this.ta.selectionStart;
      const ind = this.lineIndent(pos);
      const v = this.ta.value;
      const from = v.lastIndexOf('\n', pos - 1) + 1;
      if(pos > from && pos - from === ind.length && ind.length % 4 === 0 && ind.indexOf('\t') < 0){
        e.preventDefault();
        this.ta.value = v.slice(0, pos - 4) + v.slice(pos);
        this.ta.selectionStart = this.ta.selectionEnd = pos - 4;
        this.autoRows();
      }
    }
  }

  autoRows(){
    const lines = this.ta.value.split('\n').length;
    this.ta.style.height = Math.max(150, lines * 27 + 28) + 'px';
  }

  restore(){
    this.ta.value = this.seed;
    this.autoRows();
    this.resetStage();
    this.hideVerdict();
    this.consoleEl.textContent = 'Натисни «Запустити», щоб маяк ожив.';
  }

  resetStage(){
    const w = this.world();
    const jars = w.night ? { 'ніч': w.ticks } : {};
    jars['запас'] = w.fuel;
    jars['каністри'] = w.cans;
    this.view.reset(jars);
  }

  world(){
    const w = Object.assign({}, WORLD_DEFAULTS, {
      ticks:     this.opts.ticks     ?? WORLD_DEFAULTS.ticks,
      fuel:      this.opts.fuel      ?? WORLD_DEFAULTS.fuel,
      cans:      this.opts.cans      ?? WORLD_DEFAULTS.cans,
      night:     this.opts.night     ?? WORLD_DEFAULTS.night
    });
    if(this.scenarioSel){
      const v = this.scenarioSel.value;
      w.wind  = (v === 'storm') ? 'сильний' : 'тиша';
      w.guest = (v === 'guest');
    }
    return w;
  }

  async run(){
    if(this.busy) return;
    this.busy = true;
    this.runBtn.disabled = true;
    this.runBtn.textContent = '…';
    try{
      await serialize(async ()=>{
        const res = await runCode(this.ta.value, this.world(), this.ui);
        if(this.task) await this.checkTask(res);
      });
    }catch(e){
      this.ui.log('Маяк спіткнувся: ' + e.message, 'err');
    }finally{
      this.busy = false;
      this.runBtn.disabled = false;
      this.runBtn.textContent = '▶ Запустити';
    }
  }

  /* ---- завдання: маяк дивиться, чи вийшло ---- */
  async checkTask(res){
    const t = this.task;
    if(!res) return;
    if(res.error){
      this.showVerdict(false, ['Спершу зроби так, щоб код запустився без помилки — підказка вже в журналі вище.']);
      return;
    }

    const first = LighthouseChecks.checkAll(t.checks, res);
    const notes = first.notes.slice();

    /* якщо завдання про вибір — тихо проганяємо код в іншу погоду */
    if(!notes.length && t.trials){
      for(const tr of t.trials){
        const world = Object.assign(this.world(), { wind:'тиша', guest:false }, tr.world || {});
        const r = await runQuiet(this.ta.value, world);
        if(r.error){ notes.push(`У погоду «${tr.label}» код спіткнувся.`); continue; }
        LighthouseChecks.checkAll(tr.checks, r).notes
          .forEach(n => notes.push(`Коли «${tr.label}»: ${n}`));
      }
    }

    this.showVerdict(notes.length === 0, notes);
  }

  showVerdict(ok, notes){
    const praise = ['Вийшло! Маяк тебе послухався.', 'Точно так. Маяк світить, як йому сказано.',
                    'Є! Саме цього ми й хотіли.', 'Зроблено. Цугі б схвально моргнув.',
                    'Маяк зрозумів усе з першого разу. Так буває не завжди — тішся.'];
    this.verdictEl.hidden = false;
    this.verdictEl.className = 'verdict ' + (ok ? 'ok' : 'no');
    this.verdictEl.innerHTML = ok
      ? `<strong>✔ ${praise[Math.floor(Math.random()*praise.length)]}</strong>`
      : `<strong>Ще трішки:</strong><ul>${notes.slice(0,3).map(n=>`<li>${n}</li>`).join('')}</ul>`;
    if(this.task){
      if(ok) Progress.mark(this.task.id, true);
      if(typeof this.opts.onResult === 'function') this.opts.onResult(ok);
    }
  }

  hideVerdict(){
    if(!this.verdictEl) return;
    this.verdictEl.hidden = true;
    this.verdictEl.innerHTML = '';
  }
}

/* авто-ініціалізація для сторінок, де пісочниці прописані розміткою:
   <div class="sb" data-seed="#id" data-fuel="12" ...>                     */
function initSandboxes(root){
  (root || document).querySelectorAll('.sb:not([data-ready])').forEach(el=>{
    const seedId = el.getAttribute('data-seed');
    const seedEl = seedId ? document.querySelector(seedId) : null;
    const num = (name, fallback) => el.hasAttribute(name) ? +el.getAttribute(name) : fallback;
    new Sandbox(el, {
      title:     el.getAttribute('data-title') || undefined,
      seed:      seedEl ? seedEl.textContent : (el.getAttribute('data-code') || ''),
      fuel:      num('data-fuel', WORLD_DEFAULTS.fuel),
      ticks:     num('data-ticks', WORLD_DEFAULTS.ticks),
      cans:      num('data-cans', WORLD_DEFAULTS.cans),
      night:     el.hasAttribute('data-night'),
      scenarios: el.hasAttribute('data-scenarios')
    });
  });
}

window.Sandbox = Sandbox;
window.initSandboxes = initSandboxes;
document.addEventListener('DOMContentLoaded', ()=>initSandboxes());
