/* ==========================================================================
   gate.js — «двері маяка». Пускає до книги лише після правильного купона.
   Увага: це м'яка завіса на боці браузера, не справжній захист —
   для реального продажу купон треба перевіряти на сервері.
   ========================================================================== */
(function(){
  // Дозволені купони (наразі захардкоджено).
  const VALID = ['tsugi26'];
  const KEY = 'lighthouse_unlocked';

  const gate = document.getElementById('gate');
  if(!gate) return;

  const input = gate.querySelector('#coupon');
  const fb    = gate.querySelector('#gate-fb');
  const btn   = gate.querySelector('#gate-btn');
  const beam  = gate.querySelector('.beam-on');

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
    if(beam) beam.style.opacity = 1;                 // маяк засвічується
    document.documentElement.classList.remove('gated');
    setTimeout(()=>gate.classList.add('open'), 350);  // плавне зникнення
    setTimeout(()=>document.documentElement.classList.add('unlocked'), 900);
  }

  function submit(){
    const v = (input.value || '').trim().toLowerCase();
    if(VALID.includes(v)){
      fb.className = 'gate-fb ok';
      fb.textContent = 'Ключ підходить. Двері відчиняються…';
      unlock();
    } else {
      fb.className = 'gate-fb no';
      fb.textContent = 'Цугі каже: цей ключ не підходить. Спробуй ще.';
      input.select();
    }
  }

  if(btn) btn.addEventListener('click', submit);
  if(input) input.addEventListener('keydown', e=>{ if(e.key === 'Enter') submit(); });
})();
