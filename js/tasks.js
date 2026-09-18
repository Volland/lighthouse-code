/* ==========================================================================
   tasks.js — завдання, які дитина робить сама.

   Дві речі:
   1) ПЕРЕВІРКА. Маяк дивиться, що сталося після запуску коду, і каже — вийшло
      чи ні. Не «правильно / неправильно», а підказка в голосі світу маяка.
      Правила описані в content/story.<мова>.js словами ({r:'lit'}, {r:'calls'…}),
      що вони означають — тут, а якими словами про це сказати — у js/lang/*.js.
   2) ЗІРКИ. Що дитина вже зробила, пам'ятає браузер (localStorage).
      Ніякого сервера: журнал лежить на тій самій полиці, що й ключ від дверей.
      Зірки спільні для всіх мов — імена завдань у всіх версіях однакові.
   ========================================================================== */

/* мовний пакет: у книзі його дає i18n.js, у tools/check-tasks.mjs — сам сторож */
const LANG = () => (window.I18N && window.I18N.lang) || window.LH_LANG;
const C    = () => LANG().checks;

/* ім'я дії словами тієї мови, якою читають книгу */
const actionName = (type) => C().actions[type] || type;

const CODE_PATTERNS = {
  while:  { re:/(^|\n)[ \t]*while[ \t]+/ },
  for:    { re:/(^|\n)[ \t]*for[ \t]+\S+[ \t]+in[ \t]+/ },
  def:    { re:/(^|\n)[ \t]*def[ \t]+/ },
  if:     { re:/(^|\n)[ \t]*if[ \t]+/ },
  elif:   { re:/(^|\n)[ \t]*elif[ \t]+/ },
  else:   { re:/(^|\n)[ \t]*else[ \t]*:/ },
  return: { re:/(^|\n)[ \t]*return\b/ },
  range:  { re:/\brange\s*\(/ },
  param:  { re:/def[ \t]+[^(\n]+\([ \t]*[^)\s]/ }
};

/* імена в коді бувають не тільки латиницею — тож і межі слова шукаємо по літерах */
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* кожне правило каже або true (вийшло), або рядок — що підказати */
const RULES = {
  /* маяк засвітився */
  lit: (res) => res.acts.some(a => a.type === 'ignite' || a.type === 'full') ||
    C().notLit(LANG().py.fn.ignite),

  /* дії пішли саме в такому порядку (між ними може бути будь-що інше) */
  order: (res, spec) => {
    const want = spec.steps;
    const got = res.acts.map(a => a.type).filter(t => want.includes(t));
    let i = 0;
    for(const t of got){ if(t === want[i]) i++; }
    if(i >= want.length) return true;
    const missing = want[i];
    const done = got.includes(missing);
    return done
      ? C().orderMixed(want.map(actionName).join(' → '))
      : C().orderMissing(actionName(missing));
  },

  /* скільки разів покликали команду */
  calls: (res, spec) => {
    const n = res.acts.filter(a => a.type === spec.what).length;
    const min = spec.min ?? spec.is, max = spec.max ?? spec.is;
    if(min != null && n < min) return C().callsMin(actionName(spec.what), n, min);
    if(max != null && n > max) return C().callsMax(actionName(spec.what), n, max);
    return true;
  },

  /* куди дивиться лінза наприкінці */
  lens: (res, spec) => {
    const last = [...res.acts].reverse().find(a => a.type === 'lens');
    if(!last) return C().lensNone(LANG().py.fn.lens, spec.to);
    return last.arg === spec.to || C().lensWrong(last.arg, spec.to);
  },

  /* яким лишилось світло */
  light: (res, spec) => {
    const last = [...res.acts].reverse().find(a => ['ignite','full','dim'].includes(a.type));
    if(!last) return C().lightNone;
    return last.type === spec.is || C().lightWrong(C().lights[last.type], C().lights[spec.is]);
  },

  /* що лишилось у банці */
  jar: (res, spec) => {
    const v = res.jars ? res.jars[spec.name] : undefined;
    if(v === undefined) return C().jarMissing(spec.name);
    if(spec.is  != null && v !== spec.is)  return C().jarIs(spec.name, v, spec.is);
    if(spec.min != null && v <   spec.min) return C().jarMin(spec.name, v, spec.min);
    if(spec.max != null && v >   spec.max) return C().jarMax(spec.name, v, spec.max);
    return true;
  },

  /* щось написано в журнал */
  printed: (res, spec) => {
    const said = res.acts.filter(a => a.type === 'print').map(a => String(a.arg).toLowerCase());
    if(!said.length) return C().printedEmpty(LANG().py.fn.print);
    if(!spec.like) return true;
    return said.some(s => s.includes(String(spec.like).toLowerCase())) || C().printedLike(spec.like);
  },

  /* дитина справді написала цю конструкцію */
  uses: (res, spec) => {
    const p = CODE_PATTERNS[spec.what];
    if(!p) return true;
    return p.re.test(res.code) || C().usesNeed(C().patterns[spec.what] || spec.what);
  },

  /* своя звичка: оголошена і покликана */
  habit: (res, spec) => {
    const name = escapeRe(spec.name);
    const declared = new RegExp(`def[ \\t]+${name}[ \\t]*\\(`, 'u').test(res.code);
    if(!declared) return C().habitMissing(spec.name);
    const calls = (res.code.match(new RegExp(`(?<![\\p{L}\\p{N}_.])${name}[ \\t]*\\(`, 'gu')) || []).length;
    return calls >= 2 || C().habitNotCalled(spec.name);
  },

  /* дитина завела власну банку — будь-яку, крім тих, що вже стояли на маяку */
  newJar: (res, spec) => {
    const mine = DSL.builtinJars(LANG());
    const own = Object.keys(res.jars || {}).filter(n => !mine.includes(n));
    return own.length >= (spec.min ?? 1) || C().newJar;
  },

  /* дитина НЕ повторювала руками те, що мав зробити цикл чи звичка */
  notUses: (res, spec) => {
    const p = CODE_PATTERNS[spec.what];
    if(!p) return true;
    return !p.re.test(res.code) || (spec.why || C().notUses(spec.what));
  },

  /* скільки разів у коді зустрічається рядок (щоб ловити «скопіював десять разів») */
  atMostLines: (res, spec) => {
    const n = String(res.code).split('\n').filter(l => l.trim() && !l.trim().startsWith('#')).length;
    return n <= spec.max || C().atMostLines(n, spec.max);
  },

  /* полито соняшників */
  watered: (res, spec) => {
    const n = res.acts.filter(a => a.type === 'water').length;
    return n >= (spec.min ?? 1) || C().watered(n, spec.min ?? 3);
  }
};

/* перевірити один набір правил */
function checkAll(specs, res){
  const notes = [];
  for(const spec of (specs || [])){
    const rule = RULES[spec.r];
    if(!rule){ console.warn('tasks.js: невідоме правило', spec.r); continue; }
    const verdict = rule(res, spec);
    if(verdict !== true) notes.push(verdict);
  }
  return { ok: notes.length === 0, notes };
}

/* ---------- журнал зроблених завдань ---------- */
const STORE_KEY = 'lighthouse_done';

const Progress = {
  all(){
    try{ return JSON.parse(localStorage.getItem(STORE_KEY) || '{}') || {}; }
    catch(e){ return {}; }
  },
  isDone(id){ return !!this.all()[id]; },
  mark(id, done = true){
    if(!id) return;
    const map = this.all();
    if(done) map[id] = true; else delete map[id];
    try{ localStorage.setItem(STORE_KEY, JSON.stringify(map)); }catch(e){}
    document.dispatchEvent(new CustomEvent('lh:progress', { detail:{ id, done } }));
  },
  toggle(id){ const d = !this.isDone(id); this.mark(id, d); return d; },

  /* журнал у файл — щоб зірки не зникли разом із почищеним браузером */
  save(){
    const blob = new Blob([JSON.stringify(this.all(), null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = LANG().book.progress.file;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  },

  /* повернути журнал із файлу (зірки додаються до вже наявних) */
  load(file, done){
    const r = new FileReader();
    r.onload = ()=>{
      let map = null;
      try{ map = JSON.parse(r.result); }catch(e){}
      if(!map || typeof map !== 'object'){ if(done) done(false); return; }
      const all = this.all();
      Object.keys(map).forEach(id => { if(map[id]) all[id] = true; });
      try{ localStorage.setItem(STORE_KEY, JSON.stringify(all)); }catch(e){}
      document.dispatchEvent(new CustomEvent('lh:progress', { detail:{ id:'*', done:true } }));
      if(done) done(true);
    };
    r.readAsText(file);
  }
};

window.LighthouseChecks = { checkAll, RULES, actionName };
window.Progress = Progress;
