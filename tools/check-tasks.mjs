/* ==========================================================================
   check-tasks.mjs — сторож завдань.

   Для кожного завдання з content/story.js:
     • проганяє авторський розв'язок крізь справжній пролог маяка
       (звичайним python3 — Pyodide тут не потрібен) і перевіряє,
       що він проходить власні checks і всі trials;
     • проганяє стартовий код — разом із його trials — і перевіряє, що той НЕ проходить
       (інакше дитина отримала б зірку ні за що) і хоча б не падає з помилкою.
       Для завдань «Полагодь» (kind:'fix') падіння стартового коду — це нормально:
       там код зламаний навмисне, і зламати його мусить бути видно.

   node tools/check-tasks.mjs        → звіт і код виходу 0/1
   ========================================================================== */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* текст книги → перелік завдань */
const win = {};
new Function('window', readFileSync(join(ROOT, 'content/story.js'), 'utf8'))(win);
const tasks = [];
const walk = bs => (bs || []).forEach(b => { if(b.t === 'task') tasks.push(b); walk(b.blocks); });
win.BOOK.chapters.forEach(ch => walk(ch.blocks));

/* правила перевірки — ті самі, що й у книзі */
globalThis.window = {};
globalThis.document = { dispatchEvent(){} };
await import(join(ROOT, 'js/tasks.js'));
const { checkAll } = globalThis.window.LighthouseChecks;

/* пролог маяка — прямо з runtime.js, щоб не розходились */
const PRELUDE = readFileSync(join(ROOT, 'js/runtime.js'), 'utf8')
  .match(/const PRELUDE = `\n([\s\S]*?)\n`;/)[1];

const PY_RUNNER = `
import json, sys, types
pushed = []
js = types.ModuleType('js'); js.__lhPush = lambda t, a=None: pushed.append({'type': t, 'arg': a})
sys.modules['js'] = js
job = json.load(sys.stdin)
prelude, out = job['prelude'], []
for run in job['runs']:
    pushed.clear()
    w = run['world']
    ns = {'_cfg_ticks': w.get('ticks', 6), '_cfg_fuel': w.get('fuel', 12),
          '_cfg_cans': w.get('cans', 3), '_cfg_wind': w.get('wind', 'тиша'),
          '_cfg_guest': w.get('guest', False), '_cfg_shownight': w.get('night', False)}
    err = None
    try:
        exec(compile(prelude, '<prelude>', 'exec'), ns)
        exec(compile(run['code'], '<code>', 'exec'), ns)
        exec(compile('_jars()', '<jars>', 'exec'), ns)
    except Exception as e:
        err = '%s: %s' % (type(e).__name__, e)
    sys.settrace(None)
    acts = list(pushed); jars = {}
    for a in reversed(acts):
        if a['type'] == 'jars':
            jars = json.loads(a['arg']); break
    out.append({'acts': acts, 'jars': jars, 'code': run['code'], 'error': err})
print(json.dumps(out))
`;

/* усі запуски — одним викликом python3 */
const runs = [];
const plan = [];
for(const t of tasks){
  const base = {};
  for(const k of ['ticks','fuel','cans','night']) if(k in t) base[k] = t[k];
  const item = { task: t, solution: null, start: null, trials: [], startTrials: [] };
  if(t.solution){ item.solution = runs.length; runs.push({ code: t.solution, world: base }); }
  item.start = runs.length; runs.push({ code: t.code, world: base });
  for(const tr of (t.trials || [])){
    if(!t.solution) continue;
    item.trials.push({ label: tr.label, checks: tr.checks, at: runs.length });
    runs.push({ code: t.solution, world: Object.assign({}, base, tr.world || {}) });
    /* ті самі погоди, але для стартового коду — щоб зірка не діставалась задарма */
    item.startTrials.push({ label: tr.label, checks: tr.checks, at: runs.length });
    runs.push({ code: t.code, world: Object.assign({}, base, tr.world || {}) });
  }
  plan.push(item);
}

const py = spawnSync('python3', ['-c', PY_RUNNER], {
  input: JSON.stringify({ prelude: PRELUDE, runs }), encoding: 'utf8', maxBuffer: 64 * 1024 * 1024
});
if(py.status !== 0){ console.error('python3 не впорався:\n', py.stderr); process.exit(2); }
const results = JSON.parse(py.stdout);

const plain = s => String(s).replace(/<[^>]+>/g, '');
let problems = 0;

for(const item of plan){
  const t = item.task;
  const notes = [];

  if(item.solution === null){
    console.log(`⏭  ${t.id} — ${t.title} (відкрите завдання, без розв'язку)`);
  }else{
    const res = results[item.solution];
    if(res.error) notes.push(`розв'язок падає — ${res.error}`);
    else{
      checkAll(t.checks, res).notes.forEach(n => notes.push(`розв'язок не проходить: ${plain(n)}`));
      for(const tr of item.trials){
        const r = results[tr.at];
        if(r.error) notes.push(`«${tr.label}» падає — ${r.error}`);
        else checkAll(tr.checks, r).notes.forEach(n => notes.push(`«${tr.label}»: ${plain(n)}`));
      }
    }
  }

  const start = results[item.start];
  const mayCrash = t.kind === 'fix';
  if(start.error){
    if(!mayCrash) notes.push(`стартовий код одразу падає — ${start.error}`);
  }else if(item.solution !== null){
    /* стартовий код «проходить» лише тоді, коли пройшов і базові checks, і всі погоди */
    const passes = checkAll(t.checks, start).ok &&
      item.startTrials.every(tr => {
        const r = results[tr.at];
        return !r.error && checkAll(tr.checks, r).ok;
      });
    if(passes) notes.push('стартовий код уже проходить перевірку — зірка задарма');
  }

  if(notes.length){ problems++; console.log(`❌ ${t.id} — ${t.title}\n   · ` + notes.join('\n   · ')); }
  else if(item.solution !== null) console.log(`✅ ${t.id} — ${t.title}`);
}

console.log(problems
  ? `\nЗавдань із проблемами: ${problems} із ${tasks.length}`
  : `\nУсі ${tasks.length} завдань цілі: розв'язки проходять, стартовий код — ні.`);
process.exit(problems ? 1 : 0);
