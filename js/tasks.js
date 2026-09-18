/* ==========================================================================
   tasks.js — завдання, які дитина робить сама.

   Дві речі:
   1) ПЕРЕВІРКА. Маяк дивиться, що сталося після запуску коду, і каже — вийшло
      чи ні. Не «правильно / неправильно», а підказка в голосі світу маяка.
      Правила описані в content/story.js словами ({r:'lit'}, {r:'calls'…}),
      а що вони означають — тут.
   2) ЗІРКИ. Що дитина вже зробила, пам'ятає браузер (localStorage).
      Ніякого сервера: журнал лежить на тій самій полиці, що й ключ від дверей.
   ========================================================================== */

const ACTION_UA = {
  clean:'протерти скло', trim:'підрівняти гніт', lens:'повернути лінзу',
  ignite:'запалити вогонь', full:'повне світло', dim:'притлумити гніт',
  rotate:'обернути промінь', water:'дати воду'
};

const CODE_PATTERNS = {
  while:  { re:/(^|\n)[ \t]*while[ \t]+/,            name:'<code>while</code>' },
  for:    { re:/(^|\n)[ \t]*for[ \t]+\S+[ \t]+in[ \t]+/, name:'<code>for</code>' },
  def:    { re:/(^|\n)[ \t]*def[ \t]+/,              name:'<code>def</code>' },
  if:     { re:/(^|\n)[ \t]*if[ \t]+/,               name:'<code>if</code>' },
  elif:   { re:/(^|\n)[ \t]*elif[ \t]+/,             name:'<code>elif</code>' },
  else:   { re:/(^|\n)[ \t]*else[ \t]*:/,            name:'<code>else</code>' },
  return: { re:/(^|\n)[ \t]*return\b/,               name:'<code>return</code>' },
  range:  { re:/\brange\s*\(/,                       name:'<code>range()</code>' },
  param:  { re:/def[ \t]+[^(\n]+\([ \t]*[^)\s]/,     name:'віконце для числа (параметр)' }
};

/* кожне правило каже або true (вийшло), або рядок — що підказати */
const RULES = {
  /* маяк засвітився */
  lit: (res) => res.acts.some(a => a.type === 'ignite' || a.type === 'full') ||
    'Маяк так і не засвітився. Перевір, чи є в кінці <code>запалити_вогонь()</code>.',

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
      ? `Кроки переплутані. Спробуй по порядку: ${want.map(t => ACTION_UA[t]).join(' → ')}.`
      : `Бракує кроку «${ACTION_UA[missing]}». Подивись на список у журналі.`;
  },

  /* скільки разів покликали команду */
  calls: (res, spec) => {
    const n = res.acts.filter(a => a.type === spec.what).length;
    const min = spec.min ?? spec.is, max = spec.max ?? spec.is;
    if(min != null && n < min)
      return `«${ACTION_UA[spec.what]}» сталося ${n} раз(и), а треба щонайменше ${min}.`;
    if(max != null && n > max)
      return `«${ACTION_UA[spec.what]}» сталося ${n} раз(и) — це вже забагато, треба не більше ${max}.`;
    return true;
  },

  /* куди дивиться лінза наприкінці */
  lens: (res, spec) => {
    const last = [...res.acts].reverse().find(a => a.type === 'lens');
    if(!last) return `Лінзу ніхто не повертав. Спробуй <code>повернути_лінзу("${spec.to}")</code>.`;
    return last.arg === spec.to || `Лінза дивиться на «${last.arg}», а треба на «${spec.to}».`;
  },

  /* яким лишилось світло */
  light: (res, spec) => {
    const last = [...res.acts].reverse().find(a => ['ignite','full','dim'].includes(a.type));
    const ua = { ignite:'звичайне', full:'повне', dim:'притлумлене' };
    if(!last) return 'Світло так і не змінилось.';
    return last.type === spec.is ||
      `Наприкінці світло ${ua[last.type]}, а в цю погоду треба ${ua[spec.is]}.`;
  },

  /* що лишилось у банці */
  jar: (res, spec) => {
    const v = res.jars ? res.jars[spec.name] : undefined;
    if(v === undefined) return `Банки «${spec.name}» не видно. Вона точно має ім'я саме таке?`;
    if(spec.is != null && v !== spec.is)
      return `У банці «${spec.name}» лишилось ${v}, а має бути ${spec.is}.`;
    if(spec.min != null && v < spec.min)
      return `У банці «${spec.name}» лишилось ${v} — замало, треба щонайменше ${spec.min}.`;
    if(spec.max != null && v > spec.max)
      return `У банці «${spec.name}» аж ${v} — забагато, треба не більше ${spec.max}.`;
    return true;
  },

  /* щось написано в журнал */
  printed: (res, spec) => {
    const said = res.acts.filter(a => a.type === 'print').map(a => String(a.arg).toLowerCase());
    if(!said.length) return 'У журналі порожньо. Скажи маякові <code>показати(…)</code>.';
    if(!spec.like) return true;
    return said.some(s => s.includes(String(spec.like).toLowerCase())) ||
      `У журналі нема слова «${spec.like}». Що саме ти просиш показати?`;
  },

  /* дитина справді написала цю конструкцію */
  uses: (res, spec) => {
    const p = CODE_PATTERNS[spec.what];
    if(!p) return true;
    return p.re.test(res.code) || `Тут знадобиться ${p.name}. Без нього маяк упорається, але ти — ні 🙂`;
  },

  /* своя звичка: оголошена і покликана */
  habit: (res, spec) => {
    const declared = new RegExp(`def[ \\t]+${spec.name}[ \\t]*\\(`).test(res.code);
    if(!declared) return `Не бачу звички з іменем <code>${spec.name}</code>. Її оголошують так: <code>def ${spec.name}():</code>`;
    const calls = (res.code.match(new RegExp(`(^|[^\\w.])${spec.name}[ \\t]*\\(`, 'g')) || []).length;
    return calls >= 2 || `Звичка <code>${spec.name}</code> написана, але жодного разу не покликана. Додай окремий рядок: <code>${spec.name}()</code>`;
  },

  /* дитина завела власну банку — будь-яку, крім тих, що вже стояли на маяку */
  newJar: (res, spec) => {
    const own = Object.keys(res.jars || {}).filter(n => n !== 'запас' && n !== 'пельмені');
    return own.length >= (spec.min ?? 1) ||
      'Своєї банки на підвіконні не видно. Придумай їй підпис і поклади туди число — ' +
      'наприклад <code>дрова = 5</code>.';
  },

  /* полито соняшників */
  watered: (res, spec) => {
    const n = res.acts.filter(a => a.type === 'water').length;
    return n >= (spec.min ?? 1) ||
      `Води дісталось ${n} соняшник(ам), а в ряду їх ${spec.min ?? 3}. Нікого не пропусти.`;
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
  toggle(id){ const d = !this.isDone(id); this.mark(id, d); return d; }
};

window.LighthouseChecks = { checkAll, RULES, ACTION_UA };
window.Progress = Progress;
