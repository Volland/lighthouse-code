/* ==========================================================================
   LighthouseView — малює маяк (вид згори), банки з насінням на підвіконні
   і програє послідовність дій, яку зібрала пісочниця під час запуску коду.
   ========================================================================== */

/* мовний пакет книги: підписи на маяку говорять тією самою мовою, що й текст */
const VLANG = () => (window.I18N && window.I18N.lang) || window.LH_LANG;

const beamSVG = () => `
<svg viewBox="0 0 170 170" width="170" style="position:absolute;inset:0" aria-hidden="true">
  <circle cx="85" cy="85" r="82" fill="#0f1330" stroke="#2b3576"/>
  <circle cx="85" cy="85" r="52" fill="none" stroke="#2b3576" stroke-dasharray="3 6"/>
  <text x="85" y="14" text-anchor="middle" font-family="Nunito" font-size="9" fill="#5b66c4">${VLANG().py.val.north}</text>
</svg>`;

const BEAM_ROT = `
<svg viewBox="0 0 170 170" width="170" aria-hidden="true">
  <defs>
    <linearGradient id="lhbeam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffd447" stop-opacity=".95"/>
      <stop offset="1" stop-color="#ffd447" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <polygon class="beam-ray" points="85,85 168,66 168,104" fill="url(#lhbeam)"/>
  <circle class="beam-core" cx="85" cy="85" r="11" fill="#ffd447"/>
</svg>`;

/* скільки насінин показувати в банці (більше просто не влізе) */
const JAR_MAX_SEEDS = 12;

class LighthouseView {
  constructor(mount){
    this.mount = mount;
    this.stage = document.createElement('div');
    this.stage.className = 'beam-stage';
    this.stage.innerHTML = beamSVG() + `<div class="beam-rot">${BEAM_ROT}</div>`;
    this.rot  = this.stage.querySelector('.beam-rot');
    this.ray  = this.stage.querySelector('.beam-ray');
    this.core = this.stage.querySelector('.beam-core');

    this.status = document.createElement('div');
    this.status.className = 'status';

    this.jarsEl = document.createElement('div');
    this.jarsEl.className = 'jars';

    mount.appendChild(this.stage);
    mount.appendChild(this.status);
    mount.appendChild(this.jarsEl);
    this.reset();
  }

  /* jars — {ім'я банки: скільки насінин} */
  reset(jars){
    this.angle = 0;
    this.light = VLANG().view.off;
    this.lens  = VLANG().py.val.north;
    this.rot.style.transform = 'rotate(0deg)';
    this.ray.style.opacity = 0;
    this.core.setAttribute('fill', '#3a4160');
    this.setJars(jars || {});
    this.renderStatus();
  }

  renderStatus(){
    const v = VLANG().view;
    this.status.innerHTML =
      `${v.statusLight}: <b>${this.light}</b><br>` +
      `${v.statusLens}: <b>${this.lens}</b>`;
  }

  setJars(jars){
    this.jars = jars || {};
    const names = Object.keys(this.jars);
    this.jarsEl.innerHTML = names.length ? names.map(n => this.jarHTML(n, this.jars[n])).join('') : '';
  }

  jarHTML(name, count){
    const n = Number(count);
    const shown = Math.max(0, Math.min(JAR_MAX_SEEDS, isFinite(n) ? n : 0));
    const seeds = Array.from({ length: shown }, (_, i) => {
      const x = 6 + (i % 4) * 7;
      const y = 30 - Math.floor(i / 4) * 6;
      return `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="3.4" fill="#f5a623" transform="rotate(${(i*37)%40 - 20} ${x} ${y})"/>`;
    }).join('');
    return `<div class="jar" title="${VLANG().view.jarTitle(name)}">
      <svg viewBox="0 0 40 42" width="34" aria-hidden="true">
        <rect x="11" y="2" width="18" height="4" rx="1.5" fill="#c9d2ff" opacity=".8"/>
        <path d="M6,8 h28 a2,2 0 0 1 2,2 v26 a4,4 0 0 1 -4,4 h-24 a4,4 0 0 1 -4,-4 v-26 a2,2 0 0 1 2,-2 z"
              fill="#1b2350" stroke="#5b66c4"/>
        <g transform="translate(2,4)">${seeds}</g>
      </svg>
      <span class="jar-name">${name}</span>
      <span class="jar-count">${isFinite(n) ? n : '—'}</span>
    </div>`;
  }

  /* застосувати одну дію миттєво (використовується під час програвання) */
  apply(a){
    switch(a.type){
      case 'clean': case 'trim': case 'water': break;   // тихі кроки, маяк не змінюється
      case 'lens':   this.lens = a.arg || VLANG().py.val.north; break;
      case 'ignite': this.light = VLANG().view.on;   this.ray.style.opacity = 1;   this.core.setAttribute('fill', '#ffd447'); break;
      case 'full':   this.light = VLANG().view.full; this.ray.style.opacity = 1;   this.core.setAttribute('fill', '#ffd447'); break;
      case 'dim':    this.light = VLANG().view.dim;  this.ray.style.opacity = .45; this.core.setAttribute('fill', '#ffb03a'); break;
      case 'rotate': this.angle += 60; this.rot.style.transform = `rotate(${this.angle}deg)`; break;
      case 'jars':   this.setJars(safeParse(a.arg, this.jars)); return;   // банки статус не чіпають
    }
    this.renderStatus();
  }

  /* скільки дій ще варто програвати по одній; далі це вже не показ, а покарання */
  static get MAX_ANIMATED(){ return 80; }

  /* програти список дій із затримкою; повертає Promise.
     Довгі програми програються швидше, щоб дитина не чекала хвилину.
     А зовсім довгі (зациклився) — показуються одразу: дитині потрібна
     підказка зараз, а не через півхвилини споглядання променя. */
  play(actions, onLog){
    return new Promise(resolve => {
      if(!actions.length){ resolve(); return; }
      const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
      const visible = actions.filter(a => a.type !== 'jars').length || 1;

      if(visible > LighthouseView.MAX_ANIMATED){
        for(const a of actions){
          if(a.type === 'print'){ if(onLog) onLog(a.arg); }
          else this.apply(a);
        }
        resolve();
        return;
      }

      const gap = reduce ? 0 : Math.max(60, Math.min(300, Math.round(4000 / visible)));
      let i = 0;
      const step = ()=>{
        const a = actions[i];
        if(a.type === 'print'){ if(onLog) onLog(a.arg); }
        else this.apply(a);
        i++;
        if(i >= actions.length){ resolve(); return; }
        /* службові дії (банки) показуємо разом із наступною, без паузи */
        if(a.type === 'jars') step();
        else setTimeout(step, gap);
      };
      step();
    });
  }
}

function safeParse(raw, fallback){
  try{ return JSON.parse(raw); }catch(e){ return fallback || {}; }
}

window.LighthouseView = LighthouseView;
