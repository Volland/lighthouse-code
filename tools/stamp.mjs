/* ==========================================================================
   stamp.mjs — ставить версію на css/js у сторінках книги.

   Навіщо: книга живе статичним сайтом, а браузер кешує скрипти. Якщо читач
   уже відкривав книгу, після оновлення він отримає новий текст і СТАРИЙ
   рушій — а це вже не «трохи інакше», а зламана книга (у тексті є банка
   «ніч», а в старому рушії її нема). Тому кожен реліз дописує ?v=<число>
   до посилань — і браузер бере файли заново.

   node tools/stamp.mjs            → проставити свіжу версію
   ========================================================================== */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT  = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['index.html', 'sandbox.html'];
const STAMP = new Date().toISOString().slice(0, 10).replace(/-/g, '');

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
