/* ==========================================================================
   runtime.js — справжній Python у браузері (Pyodide) + світ маяка.
   Дитина пише код українськими командами, маяк оживає, а помилки
   перекладаються в спокійний голос світу маяка.
   ========================================================================== */

const PYODIDE_VER = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VER}/`;

const WORLD_DEFAULTS = { ticks: 6, fuel: 12, dumplings: 12, wind: 'тиша', guest: false };

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
_CAP_STEPS = 400
_CAP_LINES = 300000

_ticks = int(_cfg_ticks)
запас = int(_cfg_fuel)
пельмені = int(_cfg_dumplings)
вітер = str(_cfg_wind)
_guest = bool(_cfg_guest)

ряд = ["соняшник 1", "соняшник 2", "соняшник 3"]

class _StopSafely(Exception):
    """Зупинка своєю рукою: не помилка дитини, а запобіжник маяка."""

_JARS_MAX = 6

def _jars():
    """Підглянути в банки на підвіконні й показати їх на маяку.
    Банки маяка — перші, а далі ті, що дитина завела сама (будь-яке своє число)."""
    g = globals()
    out = {}
    for name in ("запас", "пельмені"):
        v = g.get(name)
        if isinstance(v, int) and not isinstance(v, bool):
            out[name] = v
    for name, v in g.items():
        if len(out) >= _JARS_MAX:
            break
        if name.startswith("_") or name in out:
            continue
        if isinstance(v, int) and not isinstance(v, bool):
            out[name] = v
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
    global _ticks
    if _ticks > 0:
        _ticks -= 1
        return True
    return False

def гість_на_стежці():
    return _guest

def полічити(що):
    try: return len(що)
    except TypeError: return що

def показати(*args):
    _jars()
    __lhPush("print", " ".join(str(a) for a in args))

def _guard(frame, event, arg):
    global _LINES
    if event == "line":
        _LINES += 1
        if _LINES > _CAP_LINES:
            raise _StopSafely("endless-loop")
    return _guard

sys.settrace(_guard)
`;

/* ---- переклад помилок у голос світу маяка ---- */
function translateError(raw){
  const msg = String(raw || '');
  if(msg.includes('_StopSafely')){
    if(msg.includes('endless-loop'))
      return 'Цугі каже: цей цикл ніяк не спиниться. Перевір, чи має він умову, за якої зупиниться.';
    return 'Цугі каже: маяк уже зробив дуже багато дій поспіль і трохи втомився. Можливо, цикл не має кінця?';
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
      return 'Цей рядок стоїть не на своєму місці. Пам’ятаєш: те, що всередині — зсунуте вправо на крок (відступ).';
    case 'NameError': {
      const nm = (detail.match(/'([^']+)'/) || [,''])[1];
      return `Маяк не знає слова «${nm}». Може, у ньому одруку? Або ти забув спершу дати цьому ім’я?`;
    }
    case 'TypeError':
      return 'Ця команда отримала не те, чого чекала. Перевір, що саме ти поклав у дужки.';
    case 'ZeroDivisionError':
      return 'На нуль ділити не можна — навіть маякові. Спробуй інше число.';
    case 'RecursionError':
      return 'Звичка покликала саму себе — і так без кінця. Перевір, чи має вона місце, де спиняється.';
    default:
      return detail ? (kind ? kind + ': ' + detail : detail) : 'Щось пішло не так. Спробуй ще раз — це нормально.';
  }
}

/* ---- запуск коду дитини ---- */

/* один запуск у своєму, чистому просторі імен.
   Повертає {acts, jars, error} — що сталось у світі маяка. */
function execute(py, userCode, world){
  _actions = [];
  const ns = py.globals.get('dict')();
  ns.set('_cfg_ticks',     world.ticks);
  ns.set('_cfg_fuel',      world.fuel);
  ns.set('_cfg_dumplings', world.dumplings);
  ns.set('_cfg_wind',      world.wind);
  ns.set('_cfg_guest',     world.guest);

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

  if(res.error){ ui.log(translateError(res.error.message), 'err'); return res; }
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

    this.runBtn.addEventListener('click', ()=>this.run());
    this.resetBtn.addEventListener('click', ()=>this.restore());
    this.ta.addEventListener('input', ()=>this.autoRows());
    this.ta.addEventListener('keydown', (e)=>this.onKey(e));
    this.resetStage();
  }

  onKey(e){
    if(e.key === 'Enter' && (e.ctrlKey || e.metaKey)){ e.preventDefault(); this.run(); return; }
    if(e.key === 'Tab'){
      e.preventDefault();
      const s = this.ta.selectionStart;
      this.ta.value = this.ta.value.slice(0, s) + '    ' + this.ta.value.slice(this.ta.selectionEnd);
      this.ta.selectionStart = this.ta.selectionEnd = s + 4;
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
    this.view.reset({ 'запас': w.fuel, 'пельмені': w.dumplings });
  }

  world(){
    const w = Object.assign({}, WORLD_DEFAULTS, {
      ticks:     this.opts.ticks     ?? WORLD_DEFAULTS.ticks,
      fuel:      this.opts.fuel      ?? WORLD_DEFAULTS.fuel,
      dumplings: this.opts.dumplings ?? WORLD_DEFAULTS.dumplings
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
    const praise = ['Вийшло! Маяк тебе послухався.', 'Точно так. Маяк світить, як ти сказав.',
                    'Є! Саме цього ми й хотіли.', 'Зроблено. Цугі б схвально моргнув.'];
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
      dumplings: num('data-dumplings', WORLD_DEFAULTS.dumplings),
      scenarios: el.hasAttribute('data-scenarios')
    });
  });
}

window.Sandbox = Sandbox;
window.initSandboxes = initSandboxes;
document.addEventListener('DOMContentLoaded', ()=>initSandboxes());
