/* ==========================================================================
   stamp.mjs — ставить версію на css/js у сторінках книги.

   Навіщо: книга живе статичним сайтом, а браузер кешує скрипти. Якщо читач
   уже відкривав книгу, після оновлення він отримає новий текст і СТАРИЙ
   рушій — а це вже не «трохи інакше», а зламана книга (у тексті є банка
   «ніч», а в старому рушії її нема). Тому кожен реліз дописує ?v=<число>
   до посилань — і браузер бере файли заново.

   node tools/stamp.mjs            → проставити свіжу версію
   ========================================================================== */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative } from 'node:path';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'sandbox.html', 'dlia-doroslogo.html'];

/* Дата — щоб версію було видно оком. Хвостик — відбиток самих файлів:
   за день книгу правлять не раз, а браузер має помітити кожну правку. */
function walk(dir, out = []){
  for(const name of readdirSync(dir).sort()){
    const full = join(dir, name);
    if(statSync(full).isDirectory()) walk(full, out);
    else if(/\.(css|js)$/.test(name)) out.push(full);
  }
  return out;
}
const files = ['css', 'js', 'content'].flatMap(d => walk(join(ROOT, d)));
const sum = createHash('sha1');
for(const f of files) sum.update(relative(ROOT, f)).update(readFileSync(f));
const STAMP = new Date().toISOString().slice(0, 10).replace(/-/g, '') +
              '.' + sum.digest('hex').slice(0, 6);

let touched = 0;
for(const page of PAGES){
  const path = join(ROOT, page);
  const before = readFileSync(path, 'utf8');
  const after = before.replace(
    /(href|src)="((?:css|js|content)\/[\w./-]+\.(?:css|js))(\?v=[^"]*)?"/g,
    (_, attr, file) => `${attr}="${file}?v=${STAMP}"`
  );
  if(after !== before){ writeFileSync(path, after, 'utf8'); touched++; }
  const n = (after.match(new RegExp(`\\?v=${STAMP}`, 'g')) || []).length;
  console.log(`${page}: ${n} посилань · v=${STAMP}`);
}
console.log(touched ? 'готово' : 'уже стояла така сама версія');
