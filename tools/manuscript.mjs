/* ==========================================================================
   manuscript.mjs — витягує з content/story.js чистий текст книги
   (без розмітки, без схем) і складає його в content/story.md —
   рукопис, який зручно перечитати, роздрукувати чи дати редакторові.

   node tools/manuscript.mjs            → content/story.md
   node tools/manuscript.mjs шлях.md    → куди скажеш
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT  = resolve(ROOT, process.argv[2] || 'content/story.md');

/* story.js розрахований на браузер — даємо йому window і читаємо результат */
const win = {};
new Function('window', readFileSync(join(ROOT, 'content/story.js'), 'utf8'))(win);
const book = win.BOOK;

const text = (html) => String(html)
  .replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/[ \t]*\n[ \t]*/g, '\n')
  .replace(/[ \t]{2,}/g, ' ')
  .trim();

const out = [`# ${book.title}`, ''];
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
    case 'diagram':  push(`*[блок-схема: ${b.label || 'малюнок'}]*`); push();
                     if(b.caption){ push(text(b.caption)); push(); } break;
    case 'legend':   b.items.forEach(i => push(`- ${text(i.text)}`)); push(); break;
    case 'sb':       push(`**Пісочниця: ${b.title || 'без назви'}**`); push();
                     push('```python'); push(b.code.trim()); push('```'); push(); break;
    case 'task':     push(`**${b.kind === 'fix' ? 'Полагодь' : 'Завдання'}: ${text(b.title)}**`); push();
                     push(text(b.goal)); push();
                     push('```python'); push(b.code.trim()); push('```'); push();
                     (b.hints || []).forEach((h, n) => push(`*Підказка ${n+1}:* ${text(h)}`));
                     if(b.hints) push();
                     if(b.solution){ push('*Розв\'язок (у книзі — під «підглянути»):*'); push();
                                     push('```python'); push(b.solution.trim()); push('```'); push(); }
                     break;
    case 'gist':     push(`> **Коротше кажучи** ${text(b.html)}`); push(); break;
    case 'word':     push(`> **${text(b.term)}** — ${text(b.html)}`); push(); break;
    case 'bridge':   push('**Як це звучить у великому світі**'); push();
                     push('| у книзі | у великому світі | |');
                     push('|---|---|---|');
                     b.pairs.forEach(([a, c, n]) => push(`| ${text(a)} | \`${text(c)}\` | ${text(n || '')} |`));
                     push();
                     if(b.html){ push(text(b.html)); push(); } break;
    case 'debug':    push('**Коли не працює**'); push();
                     b.steps.forEach((x, n) => push(`${n+1}. ${text(x)}`)); push();
                     if(b.html){ push(text(b.html)); push(); } break;
    case 'progress': push('*[журнал завдань — перелік зроблених зірок]*'); push(); break;
    case 'applied':  push(`**У житті — ${text(b.title)}** ${text(b.html)}`); push(); break;
    case 'secret':   push(`### ${text(b.title)}`); push();
                     b.p.forEach(p => { push(text(p)); push(); }); break;
    case 'journal':  if(b.title){ push(`### ${text(b.title)}`); push(); }
                     (b.blocks || []).forEach(x => block(x, depth + 1)); break;
    case 'cta':      break;
    default:         console.warn('manuscript: невідомий блок', b.t);
  }
}

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
