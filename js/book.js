/* ==========================================================================
   book.js — малює книгу з тексту, що лежить у content/story.js.
   Розмітка тут, текст — там. Щоб змінити історію, цей файл чіпати не треба.
   ========================================================================== */
(function(){
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]
  ));

  /* блоки, які вміє малювати книга */
  const RENDER = {
    story:    b => `<div class="story">${b.p.map(p=>`<p>${p}</p>`).join('')}</div>`,
    p:        b => `<p>${b.html}</p>`,
    small:    b => `<p class="small">${b.html}</p>`,
    h3:       b => `<h3>${b.text}</h3>`,
    pull:     b => `<div class="pull">${b.html}</div>`,

    max:      b => `<div class="maxnote"><span class="who">🖊 з журналу Макса</span>` +
                   `${b.p.map(p=>`<p>${p}</p>`).join('')}</div>`,

    postcard: b => `<div class="postcard"><div class="from">${b.from}</div>` +
                   `<span class="stamp" aria-hidden="true">${b.stamp}</span>` +
                   `${b.p.map(p=>`<p>${p}</p>`).join('')}</div>`,

    list:     b => { const tag = b.ordered ? 'ol' : 'ul';
                     return `<${tag}>${b.items.map(i=>`<li>${i}</li>`).join('')}</${tag}>`; },

    anatomy:  b => `<div class="anatomy"><div class="anatomy-line">` +
                   b.tokens.map(t =>
                     `<span class="tok t-${t.k}"><span class="glyph">${esc(t.glyph)}</span>` +
                     `<span class="cap">${t.cap || ''}</span></span>`).join('') +
                   `</div></div>`,

    diagram:  b => `<div class="diagram">${b.svg}</div>` +
                   (b.caption ? `<p class="small center">${b.caption}</p>` : ''),

    legend:   b => `<div class="legend">${b.items.map(i=>`<div>${i.chip} ${i.text}</div>`).join('')}</div>`,

    applied:  b => `<div class="applied"><span class="tag">У житті</span>` +
                   `<strong>${b.title}</strong> ${b.html}` +
                   (b.id ? `<label class="did"><input type="checkbox" data-did="${esc(b.id)}"` +
                           `${Progress.isDone(b.id) ? ' checked' : ''}> зроблено</label>` : '') +
                   `</div>`,

    secret:   b => `<div class="secret"><h3>${b.title}</h3>` +
                   `${b.p.map(p=>`<p>${p}</p>`).join('')}</div>`,

    /* коротко й простими словами — якір після складного місця */
    gist:     b => `<p class="gist"><span>Коротше кажучи</span> ${b.html}</p>`,

    /* слово на полях: що воно означає насправді */
    word:     b => `<div class="word"><b>${esc(b.term)}</b> — ${b.html}</div>`,

    /* міст до справжнього Python */
    bridge:   b => `<div class="bridge"><span class="tag">Як це звучить у великому світі</span>` +
                   `<table><tbody>` + b.pairs.map(([a, c, note]) =>
                     `<tr><td class="ours">${a}</td><td class="arrow">→</td>` +
                     `<td class="theirs"><code>${esc(c)}</code></td>` +
                     `<td class="note">${note || ''}</td></tr>`).join('') +
                   `</tbody></table>` +
                   (b.html ? `<p class="small">${b.html}</p>` : '') + `</div>`,

    /* картка «коли не працює» */
    debug:    b => `<div class="debugcard"><span class="tag">Коли не працює</span>` +
                   `<ol>${b.steps.map(x=>`<li>${x}</li>`).join('')}</ol>` +
                   (b.html ? `<p class="small">${b.html}</p>` : '') + `</div>`,

    cta:      b => `<div class="center" style="margin-top:26px">` +
                   `<a class="btn-link" href="${esc(b.href)}">${esc(b.text)}</a></div>`,

    journal:  b => `<div class="journal">` +
                   (b.title ? `<h3>${b.title}</h3>` : '') +
                   blocksHTML(b.blocks) + `</div>`,

    /* пісочниця: сама розмітка приходить пізніше, з runtime.js */
    sb:       b => `<div class="sb"></div>`,

    /* завдання: те саме, але в рамці з метою, підказками й зіркою */
    task:     b => `<div class="task${b.kind === 'fix' ? ' fix' : ''}" id="${esc(b.id)}">
        <div class="task-head">
          <span class="task-tag${b.kind === 'fix' ? ' fix' : ''}">${b.kind === 'fix' ? 'Полагодь' : 'Завдання'}</span>
          <h3>${b.title}</h3>
          <span class="star" data-star="${esc(b.id)}" title="зроблено">${Progress.isDone(b.id) ? '★' : '☆'}</span>
        </div>
        <div class="task-goal">${b.goal}</div>
        <div class="sb"></div>
        ${(b.hints || []).map((h, i) => `<details class="hint"><summary>Підказка${b.hints.length > 1 ? ' ' + (i+1) : ''}</summary><div>${h}</div></details>`).join('')}
        ${b.solution ? `<details class="hint solution"><summary>Підглянути в журнал доглядача</summary><pre><code>${esc(b.solution.trim())}</code></pre></details>` : ''}
      </div>`,

    /* журнал завдань — перелік усього, що можна зробити самому */
    progress: () => `<div class="progress-box" id="progress-box"></div>`
  };

  function blockHTML(b){
    const fn = RENDER[b.t];
    if(!fn){ console.warn('book.js: невідомий блок', b.t); return ''; }
    return fn(b);
  }
  function blocksHTML(blocks){
    return (blocks || []).map(blockHTML).join('');
  }

  /* усі пісочниці розділу — по порядку, у якому вони трапляються в блоках */
  function collectSandboxes(blocks, out){
    (blocks || []).forEach(b => {
      if(b.t === 'sb' || b.t === 'task') out.push(b);
      else if(b.blocks) collectSandboxes(b.blocks, out);
    });
    return out;
  }

  function chapterHTML(ch){
    return `<section id="${esc(ch.id)}"><div class="wrap">` +
      `<span class="chapter-num">${esc(ch.num)}</span>` +
      `<h2>${ch.title}</h2>` +
      blocksHTML(ch.blocks) +
      `</div></section>`;
  }

  function render(book, mount){
    mount.innerHTML = book.chapters.map(chapterHTML).join('<hr class="rule">');

    /* оживити пісочниці: порожні .sb заповнює Sandbox із runtime.js */
    book.chapters.forEach(ch => {
      const specs = collectSandboxes(ch.blocks, []);
      const nodes = mount.querySelector(`#${CSS.escape(ch.id)}`).querySelectorAll('.sb');
      specs.forEach((spec, i) => {
        const el = nodes[i];
        if(!el) return;
        el.dataset.ready = '1';
        const isTask = spec.t === 'task';
        new Sandbox(el, {
          title:     isTask ? (spec.sbTitle || 'Спробуй сам') : spec.title,
          seed:      spec.code,
          fuel:      spec.fuel,
          ticks:     spec.ticks,
          cans:      spec.cans,
          night:     !!spec.night,
          scenarios: !!spec.scenarios,
          task:      isTask ? { id: spec.id, checks: spec.checks, trials: spec.trials } : null
        });
      });
    });
  }

  /* ---------- журнал завдань і зірки ---------- */
  function collectTasks(book){
    const out = [];
    const walk = (blocks, ch) => (blocks || []).forEach(b => {
      if(b.t === 'task')            out.push({ id:b.id, title:b.title, chapter:ch, kind:'code' });
      if(b.t === 'applied' && b.id) out.push({ id:b.id, title:b.title, chapter:ch, kind:'life' });
      if(b.blocks) walk(b.blocks, ch);
    });
    book.chapters.forEach(ch => walk(ch.blocks, ch));
    return out;
  }

  function renderProgress(book){
    const box = document.getElementById('progress-box');
    if(!box) return;
    const tasks = collectTasks(book);
    const done  = tasks.filter(t => Progress.isDone(t.id)).length;
    const group = (kind, head) => {
      const list = tasks.filter(t => t.kind === kind);
      if(!list.length) return '';
      return `<h4>${head}</h4><ul class="progress-list">` + list.map(t =>
        `<li class="${Progress.isDone(t.id) ? 'done' : ''}">` +
        `<span class="mark">${Progress.isDone(t.id) ? '★' : '☆'}</span> ` +
        `<a href="#${esc(t.id)}">${t.title}</a> ` +
        `<span class="where">${esc(t.chapter.num)}</span></li>`).join('') + `</ul>`;
    };
    box.innerHTML =
      `<h3>Журнал завдань</h3>` +
      `<p class="count">Зроблено <b>${done}</b> із <b>${tasks.length}</b>.</p>` +
      group('code', 'Те, що пишеться в маяк') +
      group('life', 'Те, що робиться поза екраном') +
      `<div class="progress-keep">
         <button type="button" class="btn ghost small" data-save-journal>↓ Зберегти журнал у файл</button>
         <label class="btn ghost small" tabindex="0">↑ Повернути з файлу
           <input type="file" accept="application/json,.json" data-load-journal hidden>
         </label>
       </div>` +
      `<p class="small">Журнал пам'ятає цей браузер. Якщо відкрити книгу на іншому
        комп'ютері — зірки почнуться спочатку. Щоб узяти їх із собою, збережи журнал
        у файл і поверни його там.</p>`;
  }

  function wire(book){
    document.addEventListener('change', (e)=>{
      const cb = e.target.closest('[data-did]');
      if(!cb) return;
      Progress.mark(cb.getAttribute('data-did'), cb.checked);
    });
    document.addEventListener('click', (e)=>{
      if(e.target.closest('[data-save-journal]')) Progress.save();
    });
    document.addEventListener('change', (e)=>{
      const inp = e.target.closest('[data-load-journal]');
      if(!inp || !inp.files || !inp.files[0]) return;
      Progress.load(inp.files[0], ok => { if(!ok) alert('Це не схоже на журнал маяка.'); });
      inp.value = '';
    });

    /* перемалювати всі зірки з того, що пам'ятає журнал */
    const syncAll = ()=>{
      document.querySelectorAll('[data-star]').forEach(s => {
        s.textContent = Progress.isDone(s.getAttribute('data-star')) ? '★' : '☆';
      });
      document.querySelectorAll('[data-did]').forEach(c => {
        c.checked = Progress.isDone(c.getAttribute('data-did'));
      });
      document.querySelectorAll('.task').forEach(card => {
        card.classList.toggle('done', Progress.isDone(card.id));
      });
    };

    document.addEventListener('lh:progress', (e)=>{
      const { id, done } = e.detail;
      if(id === '*'){ syncAll(); renderProgress(book); return; }
      document.querySelectorAll(`[data-star="${CSS.escape(id)}"]`).forEach(s => { s.textContent = done ? '★' : '☆'; });
      document.querySelectorAll(`[data-did="${CSS.escape(id)}"]`).forEach(c => { c.checked = done; });
      const card = document.getElementById(id);
      if(card && card.classList.contains('task')) card.classList.toggle('done', done);
      renderProgress(book);
    });
    document.querySelectorAll('.task').forEach(card => {
      if(Progress.isDone(card.id)) card.classList.add('done');
    });
  }

  /* які розділи малювати на цій сторінці:
     data-only="id,id" — лише ці, data-skip="id,id" — усі, крім них.
     Так сторінка для дорослого може жити окремим файлом, поза дверима маяка. */
  function pick(book, mount){
    const ids = (attr) => (mount.dataset[attr] || '').split(',').map(s=>s.trim()).filter(Boolean);
    const only = ids('only'), skip = ids('skip');
    if(!only.length && !skip.length) return book;
    const chapters = book.chapters.filter(ch =>
      (!only.length || only.includes(ch.id)) && !skip.includes(ch.id));
    return Object.assign({}, book, { chapters });
  }

  function start(){
    const mount = document.getElementById('book');
    if(!mount) return;
    if(!window.BOOK){ mount.innerHTML = '<div class="wrap"><p>Не знайшовся текст книги.</p></div>'; return; }
    const book = pick(window.BOOK, mount);
    render(book, mount);
    renderProgress(book);
    wire(book);
    const foot = document.getElementById('book-footer');
    if(foot && book.footer) foot.textContent = book.footer;
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
