/* ==========================================================================
   runtime.js — справжній Python у браузері (Pyodide) + світ маяка.
   Дитина пише код командами своєї мови, маяк оживає, а помилки
   перекладаються в спокійний голос світу маяка.

   Жодного слова цей файл не знає сам: усі імена команд і всі підписи
   приходять із мовного пакета (js/lang/*.js) через js/dsl.js.
   ========================================================================== */

const PYODIDE_VER = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VER}/`;

/* мова книги — одна на сторінку, тож усе, що з неї збирається, рахуємо раз */
const LNG = () => (window.I18N && window.I18N.lang) || window.LH_LANG;

const once = (build) => { let v; return () => (v !== undefined ? v : (v = build())); };

const PRELUDE       = once(() => DSL.buildPrelude(LNG()));
const KNOWN_WORDS   = once(() => DSL.knownWords(LNG()));
const COMMAND_WORDS = once(() => DSL.commandWords(LNG()));
const PALETTE       = once(() => DSL.buildPalette(LNG()));

const worldDefaults = () => ({
  ticks: 6, fuel: 12, cans: 3, wind: LNG().py.val.calm, guest: false, night: false
});

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
    if(onStatus) onStatus(LNG().sb.waking);
    if(!window.loadPyodide) await loadScript(PYODIDE_URL + 'pyodide.js');
    _pyodide = await window.loadPyodide({ indexURL: PYODIDE_URL });
    return _pyodide;
  })();
  // якщо не вдалось — забути невдалу спробу, щоб наступний «Запустити» пробував заново
  _loading.catch(()=>{ _loading = null; });
  return _loading;
}

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
  const pool = KNOWN_WORDS().concat(extra || []);
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
  const E = LNG().err;
  const msg = String(raw || '');
  if(msg.includes('_StopSafely')) return E.endless;

  const lines = msg.trim().split('\n').filter(Boolean);
  const last = lines[lines.length - 1] || '';
  if(/expected an indented block/.test(msg)) return E.emptyBlock;

  const m = last.match(/(\w*Error):?\s*(.*)/);
  const kind = m ? m[1] : '';
  const detail = m ? m[2] : '';
  switch(kind){
    case 'SyntaxError':      return E.syntax;
    case 'IndentationError': return E.indentation;
    case 'NameError': {
      const nm = (detail.match(/'([^']+)'/) || [, ''])[1];
      /* імена, які дитина завела сама — їх маяк теж «знає».
         Літери тут будь-які: імена бувають і не латиницею. */
      const mine = [...String(code || '')
        .matchAll(/(?:^|\n)[ \t]*(?:def[ \t]+)?([\p{L}_][\p{L}\p{N}_]*)[ \t]*[=(]/gu)]
        .map(x => x[1]).filter(w => w !== nm);
      const near = closestWord(nm, mine);
      return near ? E.nameNear(nm, near) : E.nameFar(nm);
    }
    case 'TypeError':          return E.type;
    case 'ZeroDivisionError':  return E.zeroDiv;
    case 'RecursionError':     return E.recursion;
    default:
      return detail ? (kind ? kind + ': ' + detail : detail) : E.fallback;
  }
}

/* ---- Цербер: помічає ім'я дії, написане без дужок ---- */
function cerberusNote(code){
  const words = COMMAND_WORDS().map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp('(?:^|\\n)[ \\t]*(' + words.join('|') + ')[ \\t]*(?:#[^\\n]*)?(?=\\n|$)', 'gu');
  const hit = re.exec(String(code || ''));
  if(!hit) return null;
  return LNG().err.cerberus(hit[1]);
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
    py.runPython(PRELUDE(), { globals: ns });
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
  const S = LNG().sb;
  let py;
  try{
    py = await getPyodide(ui.status);
  }catch(e){
    ui.clearConsole();
    ui.log(S.noPython, 'err');
    return null;
  }

  ui.clearConsole();
  const res = execute(py, userCode, world);
  await ui.view.play(res.acts, (t)=>ui.log(t));   // програємо навіть те, що встигло статись до помилки

  const woof = cerberusNote(userCode);
  if(woof) ui.log(woof, 'cerb');

  if(res.error){ ui.log(translateError(res.error.message, userCode), 'err'); return res; }
  const lit = res.acts.some(a => a.type === 'ignite' || a.type === 'full');
  ui.log(lit ? S.lit : S.done, 'ok');
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
    const S = LNG().sb;
    const palette = PALETTE();
    mount.classList.add('sandbox');
    mount.dataset.ready = '1';
    mount.innerHTML = `
      <div class="sb-head">
        <span class="sb-title">${escapeHTML(this.opts.title || S.defaultTitle)}</span>
        <div class="sb-scenario"></div>
      </div>
      <div class="sb-grid">
        <div>
          <details class="palette" open>
            <summary>${escapeHTML(S.paletteSummary)}</summary>
            <div class="palette-body">${palette.map((g, gi) =>
              `<div class="palette-grp"><span class="palette-name">${escapeHTML(g.grp)}</span>` +
              g.items.map((it, i) =>
                `<button type="button" class="chip-cmd" data-grp="${gi}" data-i="${i}">` +
                `${escapeHTML(it.l)}</button>`).join('') + `</div>`).join('')}
            </div>
          </details>
          <div class="sb-editor"><textarea spellcheck="false" aria-label="${escapeHTML(S.editorAria)}"></textarea></div>
          <div class="sb-controls">
            <button class="btn run" type="button">${escapeHTML(S.run)}</button>
            <button class="btn ghost reset small" type="button">${escapeHTML(S.reset)}</button>
            <span class="hint mini">${escapeHTML(S.shortcut)}</span>
          </div>
        </div>
        <div class="sb-stage"></div>
      </div>
      <div class="console" role="log" aria-live="polite">${escapeHTML(S.consoleIdle)}</div>
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
      box.innerHTML = `<select class="pick" aria-label="${escapeHTML(S.weatherAria)}">
        <option value="storm">${escapeHTML(S.weatherStorm)}</option>
        <option value="guest">${escapeHTML(S.weatherGuest)}</option>
        <option value="calm">${escapeHTML(S.weatherCalm)}</option>
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
        const it = palette[+btn.dataset.grp].items[+btn.dataset.i];
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
    this.consoleEl.textContent = LNG().sb.consoleIdle;
  }

  resetStage(){
    const w = this.world();
    const j = LNG().py.jar;
    const jars = w.night ? { [j.night]: w.ticks } : {};
    jars[j.fuel] = w.fuel;
    jars[j.cans] = w.cans;
    this.view.reset(jars);
  }

  world(){
    const d = worldDefaults();
    const w = Object.assign({}, d, {
      ticks: this.opts.ticks ?? d.ticks,
      fuel:  this.opts.fuel  ?? d.fuel,
      cans:  this.opts.cans  ?? d.cans,
      night: this.opts.night ?? d.night
    });
    if(this.scenarioSel){
      const v = this.scenarioSel.value;
      const val = LNG().py.val;
      w.wind  = (v === 'storm') ? val.strong : val.calm;
      w.guest = (v === 'guest');
    }
    return w;
  }

  async run(){
    if(this.busy) return;
    this.busy = true;
    const S = LNG().sb;
    this.runBtn.disabled = true;
    this.runBtn.textContent = S.running;
    try{
      await serialize(async ()=>{
        const res = await runCode(this.ta.value, this.world(), this.ui);
        if(this.task) await this.checkTask(res);
      });
    }catch(e){
      this.ui.log(S.stumbled(e.message), 'err');
    }finally{
      this.busy = false;
      this.runBtn.disabled = false;
      this.runBtn.textContent = S.run;
    }
  }

  /* ---- завдання: маяк дивиться, чи вийшло ---- */
  async checkTask(res){
    const t = this.task;
    const S = LNG().sb;
    if(!res) return;
    if(res.error){
      this.showVerdict(false, [S.fixErrorFirst]);
      return;
    }

    const first = LighthouseChecks.checkAll(t.checks, res);
    const notes = first.notes.slice();

    /* якщо завдання про вибір — тихо проганяємо код в іншу погоду */
    if(!notes.length && t.trials){
      const val = LNG().py.val;
      for(const tr of t.trials){
        const world = Object.assign(this.world(), { wind: val.calm, guest: false }, tr.world || {});
        const r = await runQuiet(this.ta.value, world);
        if(r.error){ notes.push(S.trialCrash(tr.label)); continue; }
        LighthouseChecks.checkAll(tr.checks, r).notes
          .forEach(n => notes.push(S.trialNote(tr.label, n)));
      }
    }

    this.showVerdict(notes.length === 0, notes);
  }

  showVerdict(ok, notes){
    const S = LNG().sb;
    this.verdictEl.hidden = false;
    this.verdictEl.className = 'verdict ' + (ok ? 'ok' : 'no');
    this.verdictEl.innerHTML = ok
      ? `<strong>✔ ${S.praise[Math.floor(Math.random()*S.praise.length)]}</strong>`
      : `<strong>${S.verdictMore}</strong><ul>${notes.slice(0,3).map(n=>`<li>${n}</li>`).join('')}</ul>`;
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
   <div class="sb" data-seed="#id" data-fuel="12" ...>
   Текст-заготовку можна дати й мовним ключем: data-seed-i18n="sandboxPage.seed". */
function initSandboxes(root){
  const d = worldDefaults();
  (root || document).querySelectorAll('.sb:not([data-ready])').forEach(el=>{
    const seedKey = el.getAttribute('data-seed-i18n');
    const seedId  = el.getAttribute('data-seed');
    const seedEl  = seedId ? document.querySelector(seedId) : null;
    const titleKey = el.getAttribute('data-title-i18n');
    const num = (name, fallback) => el.hasAttribute(name) ? +el.getAttribute(name) : fallback;
    new Sandbox(el, {
      title:     titleKey ? window.I18N.t(titleKey) : (el.getAttribute('data-title') || undefined),
      seed:      seedKey ? window.I18N.t(seedKey)
                         : (seedEl ? seedEl.textContent : (el.getAttribute('data-code') || '')),
      fuel:      num('data-fuel', d.fuel),
      ticks:     num('data-ticks', d.ticks),
      cans:      num('data-cans', d.cans),
      night:     el.hasAttribute('data-night'),
      scenarios: el.hasAttribute('data-scenarios')
    });
  });
}

window.Sandbox = Sandbox;
window.initSandboxes = initSandboxes;

/* пісочниці з розмітки чекають на мову — вона приходить разом з i18n.js */
if(window.I18N) window.I18N.ready.then(()=>initSandboxes());
else document.addEventListener('DOMContentLoaded', ()=>initSandboxes());
