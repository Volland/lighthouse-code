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

const text = (html) => String(html)
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/[ \t]*\n[ \t]*/g, '\n')
  .replace(/[ \t]{2,}/g, ' ')
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
                     (b.hints || []).forEach((h, n) => push(`*${LB.hint} ${n+1}:* ${text(h)}`));
                     if(b.hints) push();
                     if(b.solution){ push(`*${LB.solution}:*`); push();
                                     push('```python'); push(b.solution.trim()); push('```'); push(); }
                     break;
    case 'gist':     push(`> **${LB.gistLabel}** ${text(b.html)}`); push(); break;
    case 'word':     push(`> **${text(b.term)}** — ${text(b.html)}`); push(); break;
    case 'bridge':   push(`**${LB.bridgeTag}**`); push();
                     push('| | | |');
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

  out = [`# ${book.title}`, ''];
  book.chapters.forEach(ch => {
    push(`## ${ch.num}. ${text(ch.title)}`);
    push();
    ch.blocks.forEach(b => block(b, 0));
    push('---');
    push();
  });

  const md = out.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
  writeFileSync(OUT, md, 'utf8');
  const words = md.split(/\s+/).filter(Boolean).length;
  console.log(`${OUT}\nрозділів: ${book.chapters.length}, слів: ${words}`);
}
