/* ==========================================================================
   gate.js — «двері маяка». Пускає до книги лише після правильного купона.
   Увага: це м'яка завіса на боці браузера, не справжній захист —
   для реального продажу купон треба перевіряти на сервері.

   Слова дверей приходять із мовного пакета (js/i18n.js), тож двері
   говорять тією самою мовою, що й книга.
   ========================================================================== */
(function(){
  // Дозволені купони (наразі захардкоджено). Один ключ на всі мови.
  const VALID = ['tsugi26'];
  const KEY = 'lighthouse_unlocked';

  const gate = document.getElementById('gate');
  if(!gate) return;

  const t = (p) => (window.I18N ? window.I18N.t(p) : '');
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]
  ));

  /* ---- малюємо двері ---- */
  const lead = gate.getAttribute('data-lead') || 'lead';
  gate.innerHTML = `
    <div class="gate-card">
      <svg viewBox="0 0 120 130" width="110" aria-hidden="true">
        <defs><linearGradient id="gbeam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#ffd447" stop-opacity=".9"/>
          <stop offset="1" stop-color="#ffd447" stop-opacity="0"/></linearGradient></defs>
        <polygon class="beam-on" points="60,40 120,22 120,58" fill="url(#gbeam)" style="opacity:0"/>
        <polygon class="beam-on" points="60,40 0,22 0,58" fill="url(#gbeam)"
                 style="opacity:0;transform:scaleX(-1);transform-origin:60px 40px"/>
        <path d="M46,120 L52,54 L68,54 L74,120 Z" fill="#f3ede0"/>
        <path d="M48,100 L72,100 L73,116 L47,116 Z" fill="#e2574c"/>
        <rect x="50" y="30" width="20" height="14" rx="3" fill="#3a4699"/>
        <circle cx="60" cy="40" r="7" fill="#ffd447"/>
        <path d="M52,26 L68,26 L64,20 L56,20 Z" fill="#2b3576"/>
        <circle cx="60" cy="106" r="3.4" fill="#2b2748"/>
        <rect x="58.6" y="106" width="2.8" height="7" fill="#2b2748"/>
      </svg>
      <h1>${esc(t('gate.title'))}</h1>
      <p>${esc(t('gate.' + lead))}</p>
      <div class="gate-row">
        <input id="coupon" type="text" inputmode="text" autocomplete="off" autocapitalize="off"
               spellcheck="false" placeholder="${esc(t('gate.placeholder'))}"
               aria-label="${esc(t('gate.aria'))}">
        <button id="gate-btn" class="btn">${esc(t('gate.button'))}</button>
      </div>
      <div id="gate-fb" class="gate-fb" role="status" aria-live="polite"></div>
      <p class="mini">${esc(t('gate.mini'))}</p>
      <p class="gate-open"><a href="dlia-doroslogo.html">${t('gate.openLink')}</a></p>
      <p class="gate-lang">${window.I18N ? window.I18N.switcher() : ''}</p>
    </div>`;

  const input = gate.querySelector('#coupon');
  const fb    = gate.querySelector('#gate-fb');
  const btn   = gate.querySelector('#gate-btn');
  const beams = gate.querySelectorAll('.beam-on');

  // якщо вже відчинено — показати книгу без затримки
  let already = false;
  try{ already = localStorage.getItem(KEY) === '1'; }catch(e){}
  if(already){
    document.documentElement.classList.add('unlocked');
    document.documentElement.classList.remove('gated');
    return;
  }

  if(input) setTimeout(()=>input.focus(), 60);

  function unlock(){
    try{ localStorage.setItem(KEY, '1'); }catch(e){}
    beams.forEach(b => { b.style.opacity = 1; });        // маяк засвічується
    document.documentElement.classList.remove('gated');
    setTimeout(()=>gate.classList.add('open'), 350);      // плавне зникнення
    setTimeout(()=>document.documentElement.classList.add('unlocked'), 900);
  }

  function submit(){
    const v = (input.value || '').trim().toLowerCase();
    if(VALID.includes(v)){
      fb.className = 'gate-fb ok';
      fb.textContent = t('gate.ok');
      unlock();
    } else {
      fb.className = 'gate-fb no';
      fb.textContent = t('gate.no');
      input.select();
    }
  }

  if(btn) btn.addEventListener('click', submit);
  if(input) input.addEventListener('keydown', e=>{ if(e.key === 'Enter') submit(); });
})();
