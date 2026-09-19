/* ==========================================================================
   manuscript.mjs — витягує з content/story.<мова>.js чистий текст книги
   (без розмітки, без схем) і складає його в content/story.<мова>.md —
   рукопис, який зручно перечитати, роздрукувати чи дати редакторові.

   node tools/manuscript.mjs            → усі мови
   node tools/manuscript.mjs de         → лише німецький рукопис
   node tools/manuscript.mjs de шлях.md → куди скажеш
   ========================================================================== */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['uk', 'de'];

const asked = LANGS.includes(process.argv[2]) ? process.argv[2] : null;
const todo  = asked ? [asked] : LANGS;
const OUT_ARG = asked ? process.argv[3] : process.argv[2];

/* мовний пакет — з нього беруться підписи рамок у рукописі */
function langPack(code){
  const win = {};
  new Function('window', readFileSync(join(ROOT, `js/lang/${code}.js`), 'utf8'))(win);
  return win.LANGS[code];
}

/* story.<мова>.js розрахований на браузер — даємо йому window і читаємо результат */
function loadBook(code){
  const win = {};
  new Function('window', readFileSync(join(ROOT, `content/story.${code}.js`), 'utf8'))(win);
  return win.BOOK;
}

let book, LB, out, OUT;

/* Розмітка книги → чистий текст для людини.

   Два рішення, які варто пояснити:
   1) наголоси автора (<strong>, <em>, <code>) — це теж текст, і редактор має
      їх бачити, тож вони стають звичайним markdown, а не зникають;
   2) у story.<мова>.js абзац розбитий на рядки, щоб влазив у вікно редактора
      коду. Для рукопису це шкода: редактор читає абзацами, а не рядками
      по 90 символів. Тому переноси всередині абзацу знімаються, і лишається
      тільки той, який автор поставив свідомо — <br>. */
const BR = '\u0000';

const text = (html) => String(html)
  .replace(/<br\s*\/?>/gi, BR)
  .replace(/<\/?(?:strong|b)>/gi, '**')
  .replace(/<\/?(?:em|i)>/gi, '*')
  .replace(/<code>([\s\S]*?)<\/code>/gi, (_, c) => '`' + c.replace(/\s+/g, ' ').trim() + '`')
  .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, '$1')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\s*\n\s*/g, ' ')
  .replace(/[ \t]{2,}/g, ' ')
  .replace(/\s*\u0000\s*/g, '\n')
  .trim();

const push = (s = '') => out.push(s);

function block(b, depth){
  switch(b.t){
    case 'story':    b.p.forEach(p => { push(text(p)); push(); }); break;
    case 'p':
    case 'small':    push(text(b.html)); push(); break;
    case 'h3':       push(`### ${text(b.text)}`); push(); break;
    case 'pull':     push(text(b.html).split('\n').map(l => `> ${l}`).join('\n')); push(); break;
    case 'max':      push(`> 🖊 з журналу Макса`); push('>');
                     b.p.forEach(p => { push(text(p).split('\n').map(l => `> ${l}`).join('\n')); push('>'); });
                     out.pop(); push(); break;
    case 'postcard': push(`**${text(b.from)} ${b.stamp}**`); push();
                     b.p.forEach(p => push(text(p))); push(); break;
    case 'list':     b.items.forEach((i, n) => push(b.ordered ? `${n+1}. ${text(i)}` : `- ${text(i)}`)); push(); break;
    case 'anatomy':  push('`' + b.tokens.map(t => t.glyph).join('') + '`'); push();
                     b.tokens.forEach(t => push(`- \`${t.glyph.trim()}\` — ${text(t.cap || '')}`)); push(); break;
    case 'diagram':  push(`*[${b.label || '—'}]*`); push();
                     if(b.caption){ push(text(b.caption)); push(); } break;
    case 'legend':   b.items.forEach(i => push(`- ${text(i.text)}`)); push(); break;
    case 'sb':       push(`**${LB.sandbox}: ${b.title || '—'}**`); push();
                     push('```python'); push(b.code.trim()); push('```'); push(); break;
    case 'task':     push(`**${b.kind === 'fix' ? LB.fixTag : LB.taskTag}: ${text(b.title)}**`); push();
                     push(text(b.goal)); push();
                     push('```python'); push(b.code.trim()); push('```'); push();
                     (b.hints || []).forEach((h, n) => push(`- *${LB.hint} ${n+1}:* ${text(h)}`));
                     if(b.hints) push();
                     if(b.solution){ push(`*${LB.solution}:*`); push();
                                     push('```python'); push(b.solution.trim()); push('```'); push(); }
                     break;
    case 'gist':     push(`> **${LB.gistLabel}** ${text(b.html)}`); push(); break;
    case 'word':     push(`> **${text(b.term)}** — ${text(b.html)}`); push(); break;
    case 'bridge':   push(`**${LB.bridgeTag}**`); push();
                     push(`| ${LB.bridgeOurs} | ${LB.bridgeTheirs} | |`);
                     push('|---|---|---|');
                     b.pairs.forEach(([a, c, n]) => push(`| ${text(a)} | \`${text(c)}\` | ${text(n || '')} |`));
                     push();
                     if(b.html){ push(text(b.html)); push(); } break;
    case 'debug':    push(`**${LB.debugTag}**`); push();
                     b.steps.forEach((x, n) => push(`${n+1}. ${text(x)}`)); push();
                     if(b.html){ push(text(b.html)); push(); } break;
    case 'progress': push(`*[${LB.progress.title}]*`); push(); break;
    case 'applied':  push(`**${LB.appliedTag} — ${text(b.title)}** ${text(b.html)}`); push(); break;
    case 'secret':   push(`### ${text(b.title)}`); push();
                     b.p.forEach(p => { push(text(p)); push(); }); break;
    case 'journal':  if(b.title){ push(`### ${text(b.title)}`); push(); }
                     (b.blocks || []).forEach(x => block(x, depth + 1)); break;
    case 'cta':      break;
    default:         console.warn('manuscript: невідомий блок', b.t);
  }
}

for(const code of todo){
  if(!existsSync(join(ROOT, `content/story.${code}.js`))){
    console.log(`${code}: тексту ще немає — пропускаю`);
    continue;
  }
  book = loadBook(code);
  LB   = Object.assign({ sandbox: 'sandbox' }, langPack(code).book);
  OUT  = resolve(ROOT, (todo.length === 1 && OUT_ARG) || `content/story.${code}.md`);

  const today = new Date().toISOString().slice(0, 10).split('-').reverse().join('.');

  out = [];
  push(`# ${book.title}`);
  push();
  push(`*${LB.manuscript} · ${langPack(code).name} · ${today}*`);
  push();
  push(`*${LB.generatedFrom} \`content/story.${code}.js\`. ${LB.editBack}*`);
  push();
  push(`## ${LB.contents}`);
  push();
  book.chapters.forEach(ch => push(`- ${ch.num}. ${text(ch.title)}`));
  push();
  push('---');
  push();

  book.chapters.forEach(ch => {
    push(`## ${ch.num}. ${text(ch.title)}`);
    push();
    ch.blocks.forEach(b => block(b, 0));
    push('---');
    push();
  });

  const md = out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  const words = md.split(/\s+/).filter(Boolean).length;

  /* Рукопис лежить у гіті, щоб редактор правив його в PR. Дата в шапці
     міняється щодня — і без цієї перевірки кожен перезапуск давав би «зміну»
     там, де в тексті не змінилось жодного слова. Порівнюємо без дати. */
  const undated = (x) => x.replace(/^(\*.* · )\d{2}\.\d{2}\.\d{4}\*$/m, '$1*');
  const had = existsSync(OUT) ? readFileSync(OUT, 'utf8') : null;
  if(had && undated(had) === undated(md)){
    console.log(`${OUT}\nбез змін (розділів: ${book.chapters.length}, слів: ${words})`);
    continue;
  }

  writeFileSync(OUT, md, 'utf8');
  console.log(`${OUT}\nрозділів: ${book.chapters.length}, слів: ${words}`);
}
