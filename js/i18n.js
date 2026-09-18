/* ==========================================================================
   i18n.js — двомовність книги.

   Вибирає мову (адреса → пам'ять браузера → мова самого браузера),
   підставляє її слова в готову розмітку, малює шапку з перемикачем
   і підвантажує текст книги саме тією мовою.

   Мовні пакети лежать у js/lang/*.js, слова Python — у js/dsl.js.
   ========================================================================== */
(function(){
  const KEY      = 'lighthouse_lang';
  const FALLBACK = 'uk';
  const LANGS    = window.LANGS || {};
  const ORDER    = Object.keys(LANGS);

  /* ---------- яку мову показувати ---------- */
  function fromQuery(){
    try{ return new URLSearchParams(location.search).get('lang'); }catch(e){ return null; }
  }
  function fromStore(){
    try{ return localStorage.getItem(KEY); }catch(e){ return null; }
  }
  function fromBrowser(){
    const list = navigator.languages || [navigator.language || ''];
    for(const raw of list){
      const two = String(raw).slice(0, 2).toLowerCase();
      if(LANGS[two]) return two;
    }
    return null;
  }
  function detect(){
    const asked = fromQuery();
    if(asked && LANGS[asked]) return asked;
    const kept = fromStore();
    if(kept && LANGS[kept]) return kept;
    return fromBrowser() || (LANGS[FALLBACK] ? FALLBACK : ORDER[0]);
  }

  const code = detect();
  const L    = LANGS[code];

  document.documentElement.lang = L.htmlLang;
  try{ localStorage.setItem(KEY, code); }catch(e){}

  /* версія файлів — беремо з власного посилання, щоб книга й рушій
     ніколи не розійшлися в кеші браузера */
  const me  = document.currentScript;
  const VER = (me && (me.src.match(/\?v=[^&"]*/) || [''])[0]) || '';

  /* ---------- дістати рядок за адресою на кшталт "gate.title" ---------- */
  function pick(path, lang){
    return String(path).split('.').reduce((o, k) => (o == null ? o : o[k]), lang);
  }
  function t(path, ...args){
    let v = pick(path, L);
    if(v === undefined) v = pick(path, LANGS[FALLBACK]);
    if(typeof v === 'function') return v(...args);
    return v === undefined ? '' : v;
  }

  /* ---------- підставити слова в готову розмітку ----------
     data-i18n="шлях"            — текстом
     data-i18n-html="шлях"       — розміткою
     data-i18n-attr="attr:шлях"  — в атрибут (можна кілька через ;)          */
  function apply(root){
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.getAttribute('data-i18n-attr').split(';').forEach(pair => {
        const [attr, path] = pair.split(':').map(s => s.trim());
        if(attr && path) el.setAttribute(attr, t(path));
      });
    });
  }

  /* ---------- шапка з перемикачем мови ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => (
    { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]
  ));

  /* та сама сторінка, але іншою мовою */
  function urlFor(lang){
    const u = new URL(location.href);
    u.searchParams.set('lang', lang);
    return u.pathname.split('/').pop() + u.search + u.hash;
  }

  function switcherHTML(){
    return `<span class="langpick" role="group" aria-label="${esc(t('nav.langLabel'))}">` +
      ORDER.map(c => {
        const on = c === code;
        return `<a class="lang${on ? ' on' : ''}" href="${esc(urlFor(c))}" hreflang="${esc(LANGS[c].htmlLang)}"` +
               `${on ? ' aria-current="true"' : ''} title="${esc(LANGS[c].name)}">${esc(LANGS[c].short)}</a>`;
      }).join('') + `</span>`;
  }

  const NAV = {
    book: () => `<a href="#dlia-doroslogo">${esc(t('nav.adult'))}</a>` +
                `<a href="#rozdil1">${esc(t('nav.chapters'))}</a>` +
                `<a href="sandbox.html">${esc(t('nav.sandbox'))}</a>`,
    back: () => `<a href="index.html">${esc(t('nav.backToBook'))}</a>`
  };

  function renderChrome(){
    document.querySelectorAll('[data-topbar]').forEach(box => {
      const kind = box.getAttribute('data-nav') || 'back';
      const home = box.getAttribute('data-home') || 'index.html';
      box.className = 'topbar';
      box.innerHTML = `<div class="wrap">` +
        `<a class="brand" href="${esc(home)}">` +
          `<span class="brand-full">${esc(t('meta.brand'))}</span>` +
          `<span class="brand-short">${esc(t('meta.brandShort') || t('meta.brand'))}</span></a>` +
        `<nav>${(NAV[kind] || NAV.back)()}${switcherHTML()}</nav></div>`;
    });
  }

  /* ---------- заголовок сторінки й посилання для пошукачів ---------- */
  function renderHead(){
    const page = document.documentElement.getAttribute('data-page') || 'index';
    const title = t(`meta.${page}Title`) || t('meta.bookTitle');
    const desc  = t(`meta.${page}Desc`);
    if(title) document.title = title;
    if(desc){
      let m = document.querySelector('meta[name="description"]');
      if(!m){ m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = desc;
    }
    ORDER.forEach(c => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = LANGS[c].htmlLang;
      link.href = urlFor(c);
      document.head.appendChild(link);
    });
  }

  /* ---------- текст книги тією самою мовою ---------- */
  let _book = null;
  function loadBook(){
    if(_book) return _book;
    _book = new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = `content/story.${code}.js${VER}`;
      s.onload  = () => resolve(window.BOOK || null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    });
    return _book;
  }

  window.I18N = {
    code, lang: L, langs: LANGS, order: ORDER,
    t, apply, urlFor, loadBook, switcher: switcherHTML,
    ready: null   /* проставляється нижче */
  };

  /* книгу починаємо вантажити одразу, якщо сторінка її чекає */
  if(me && me.hasAttribute('data-book')) loadBook();

  function start(){
    renderHead();
    renderChrome();
    apply(document);
    document.documentElement.classList.remove('i18n-boot');
  }
  window.I18N.ready = new Promise(resolve => {
    const go = () => { start(); resolve(L); };
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go);
    else go();
  });
})();
