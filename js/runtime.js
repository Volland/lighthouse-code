/* ==========================================================================
   runtime.js — справжній Python у браузері (Pyodide) + світ маяка.
   Дитина пише код українськими командами, маяк оживає, а помилки
   перекладаються в спокійний голос світу маяка.
   ========================================================================== */

const PYODIDE_VER = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/npm/pyodide@${PYODIDE_VER}/`;

let _pyodide = null, _loading = null;
window.__lhActions = [];
window.__lhPush = (type, arg) => window.__lhActions.push({ type, arg });

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
  return _loading;
}

/* ---- Python-пролог: команди маяка, безпечні цикли, захист від зависань ---- */
const PRELUDE = `
import sys
from js import __lhPush

_STEPS = 0
_LINES = 0
_CAP_STEPS = 300
_CAP_LINES = 300000

try: _ticks = int(_cfg_ticks)
except Exception: _ticks = 6
try: запас = int(_cfg_fuel)
except Exception: запас = 12
try: вітер = str(_cfg_wind)
except Exception: вітер = "тиша"
try: _guest = bool(_cfg_guest)
except Exception: _guest = False

ряд = ["соняшник 1", "соняшник 2", "соняшник 3"]

class _StopSafely(Exception):
    pass

def _tick():
    global _STEPS
    _STEPS += 1
    if _STEPS > _CAP_STEPS:
        raise _StopSafely("забагато дій")

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
    __lhPush("print", " ".join(str(a) for a in args))

def _guard(frame, event, arg):
    global _LINES
    if event == "line":
        _LINES += 1
        if _LINES > _CAP_LINES:
            raise _StopSafely("цикл ніяк не спиниться")
    return _guard

sys.settrace(_guard)
`;

/* ---- переклад помилок у голос світу маяка ---- */
function translateError(raw){
  const msg = String(raw || '');
  if(msg.includes('_StopSafely')){
    if(msg.includes('спиниться'))
      return 'Цугі каже: цей цикл ніяк не спиниться. Перевір, чи має він умову, за якої зупиниться.';
    return 'Цугі каже: маяк уже зробив дуже багато дій поспіль і трохи втомився. Можливо, цикл не має кінця?';
  }
  const lines = msg.trim().split('\n').filter(Boolean);
  const last = lines[lines.length - 1] || '';
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
    default:
      return detail ? (kind ? kind + ': ' + detail : detail) : 'Щось пішло не так. Спробуй ще раз — це нормально.';
  }
}

/* ---- запуск коду дитини ---- */
async function runCode(userCode, world, ui){
  window.__lhActions = [];
  ui.clearConsole();
  let py;
  try{
    py = await getPyodide(ui.status);
  }catch(e){
    ui.log('Не вдалось розбудити маяк (немає інтернету для завантаження Python).', 'err');
    return;
  }
  // налаштувати світ
  py.globals.set('_cfg_ticks', world.ticks ?? 6);
  py.globals.set('_cfg_fuel',  world.fuel  ?? 12);
  py.globals.set('_cfg_wind',  world.wind  ?? 'тиша');
  py.globals.set('_cfg_guest', !!world.guest);

  try{
    py.runPython(PRELUDE);
    py.runPython(userCode);
  }catch(e){
    // все одно програємо дії, що встигли статись до помилки
    await ui.view.play(window.__lhActions, (t)=>ui.log(t));
    ui.log(translateError(e.message), 'err');
    try{ py.runPython('import sys; sys.settrace(None)'); }catch(_){}
    return;
  }
  try{ py.runPython('import sys; sys.settrace(None)'); }catch(_){}

  const acts = window.__lhActions.slice();
  await ui.view.play(acts, (t)=>ui.log(t));
  const did = acts.some(a=>['ignite','full'].includes(a.type));
  ui.log(did ? '✔ Маяк світить.' : 'Готово.', 'ok');
}

/* ==========================================================================
   Sandbox — збирає редактор, маяк і консоль в одному блоці
   ========================================================================== */
class Sandbox {
  constructor(mount, opts){
    this.opts = opts || {};
    mount.classList.add('sandbox');
    mount.innerHTML = `
      <div class="sb-head">
        <span class="sb-title">${opts.title || 'Журнал маяка — пісочниця'}</span>
        <div class="sb-scenario"></div>
      </div>
      <div class="sb-grid">
        <div>
          <div class="sb-editor"><textarea spellcheck="false"></textarea></div>
          <div class="sb-controls">
            <button class="btn run">▶ Запустити</button>
            <button class="btn ghost reset small">↺ Спочатку</button>
          </div>
        </div>
        <div class="sb-stage"></div>
      </div>
      <div class="console">Натисни «Запустити», щоб маяк ожив.</div>
    `;
    this.ta = mount.querySelector('textarea');
    this.consoleEl = mount.querySelector('.console');
    this.stageMount = mount.querySelector('.sb-stage');
    this.view = new LighthouseView(this.stageMount);
    this.seed = (opts.seed || '').replace(/^\n/, '');
    this.ta.value = this.seed;
    this.autoRows();

    // сценарій погоди (для розділу з галуженням)
    if(opts.scenarios){
      const box = mount.querySelector('.sb-scenario');
      box.innerHTML = `<select class="pick">
        <option value="storm">погода: сильний вітер</option>
        <option value="guest">погода: гість на стежці</option>
        <option value="calm">погода: тиша</option>
      </select>`;
      this.scenarioSel = box.querySelector('select');
    }

    this.ui = {
      view: this.view,
      status: (t)=>{ this.consoleEl.innerHTML = `<span class="cat">🐈 ${t}</span>`; },
      clearConsole: ()=>{ this.consoleEl.textContent = ''; this.view.reset(this.world().fuel); },
      log: (t, cls)=>{ const d=document.createElement('div'); if(cls) d.className=cls; d.textContent=t; this.consoleEl.appendChild(d); this.consoleEl.scrollTop=this.consoleEl.scrollHeight; }
    };

    mount.querySelector('.run').onclick   = ()=>this.run();
    mount.querySelector('.reset').onclick = ()=>{ this.ta.value=this.seed; this.autoRows(); this.view.reset(this.world().fuel); this.consoleEl.textContent='Натисни «Запустити», щоб маяк ожив.'; };
    this.ta.addEventListener('input', ()=>this.autoRows());
    this.ta.addEventListener('keydown', (e)=>{ if(e.key==='Tab'){ e.preventDefault(); const s=this.ta.selectionStart; this.ta.value=this.ta.value.slice(0,s)+'    '+this.ta.value.slice(this.ta.selectionEnd); this.ta.selectionStart=this.ta.selectionEnd=s+4; } });
  }

  autoRows(){
    const lines = this.ta.value.split('\n').length;
    this.ta.style.height = Math.max(150, lines*27 + 28) + 'px';
  }

  world(){
    const w = { ticks: this.opts.ticks, fuel: this.opts.fuel, wind: 'тиша', guest: false };
    if(this.scenarioSel){
      const v = this.scenarioSel.value;
      if(v==='storm'){ w.wind='сильний'; w.guest=false; }
      else if(v==='guest'){ w.wind='тиша'; w.guest=true; }
      else { w.wind='тиша'; w.guest=false; }
    }
    return w;
  }

  async run(){
    const btn = this.consoleEl.parentElement.querySelector('.run');
    btn.disabled = true; btn.textContent = '…';
    await runCode(this.ta.value, this.world(), this.ui);
    btn.disabled = false; btn.textContent = '▶ Запустити';
  }
}

/* авто-ініціалізація: <div class="sb" data-seed="#id" ...> */
function initSandboxes(){
  document.querySelectorAll('.sb').forEach(el=>{
    const seedId = el.getAttribute('data-seed');
    const seedEl = seedId ? document.querySelector(seedId) : null;
    new Sandbox(el, {
      title: el.getAttribute('data-title') || undefined,
      seed: seedEl ? seedEl.textContent : (el.getAttribute('data-code') || ''),
      fuel: el.hasAttribute('data-fuel') ? +el.getAttribute('data-fuel') : 12,
      ticks: el.hasAttribute('data-ticks') ? +el.getAttribute('data-ticks') : 6,
      scenarios: el.hasAttribute('data-scenarios')
    });
  });
}
window.Sandbox = Sandbox;
window.initSandboxes = initSandboxes;
document.addEventListener('DOMContentLoaded', initSandboxes);
