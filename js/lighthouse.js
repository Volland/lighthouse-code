/* ==========================================================================
   LighthouseView — малює маяк (вид згори) і програє послідовність дій,
   які зібрала пісочниця під час запуску коду дитини.
   ========================================================================== */

const BEAM_SVG = `
<svg viewBox="0 0 170 170" width="170" style="position:absolute;inset:0">
  <circle cx="85" cy="85" r="82" fill="#0f1330" stroke="#2b3576"/>
  <circle cx="85" cy="85" r="52" fill="none" stroke="#2b3576" stroke-dasharray="3 6"/>
  <text x="85" y="14" text-anchor="middle" font-family="Nunito" font-size="9" fill="#5b66c4">північ</text>
</svg>`;

const BEAM_ROT = `
<svg viewBox="0 0 170 170" width="170">
  <defs>
    <linearGradient id="lhbeam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffd447" stop-opacity=".95"/>
      <stop offset="1" stop-color="#ffd447" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <polygon class="beam-ray" points="85,85 168,66 168,104" fill="url(#lhbeam)"/>
  <circle class="beam-core" cx="85" cy="85" r="11" fill="#ffd447"/>
</svg>`;

class LighthouseView {
  constructor(mount){
    this.mount = mount;
    this.stage = document.createElement('div');
    this.stage.className = 'beam-stage';
    this.stage.innerHTML = BEAM_SVG + `<div class="beam-rot">${BEAM_ROT}</div>`;
    this.rot = this.stage.querySelector('.beam-rot');
    this.ray = this.stage.querySelector('.beam-ray');
    this.core = this.stage.querySelector('.beam-core');

    this.status = document.createElement('div');
    this.status.className = 'status';

    mount.appendChild(this.stage);
    mount.appendChild(this.status);
    this.reset();
  }

  reset(fuel){
    this.angle = 0;
    this.light = 'вимкнено';
    this.lens = 'північ';
    this.fuel = (fuel === undefined ? null : fuel);
    this.rot.style.transform = 'rotate(0deg)';
    this.ray.style.opacity = 0;
    this.core.setAttribute('fill', '#3a4160');
    this.renderStatus();
  }

  renderStatus(){
    let f = (this.fuel === null) ? '—' : this.fuel;
    this.status.innerHTML =
      `світло: <b>${this.light}</b><br>` +
      `лінза дивиться: <b>${this.lens}</b><br>` +
      `пальне (запас): <b>${f}</b>`;
  }

  /* застосувати одну дію миттєво (використовується під час програвання) */
  apply(a){
    switch(a.type){
      case 'clean': case 'trim': break;                 // тихі підготовчі кроки
      case 'lens':  this.lens = a.arg || 'північ'; break;
      case 'ignite': this.light='увімкнено'; this.ray.style.opacity=1; this.core.setAttribute('fill','#ffd447'); break;
      case 'full':   this.light='повне';     this.ray.style.opacity=1; this.core.setAttribute('fill','#ffd447'); break;
      case 'dim':    this.light='притлумлене';this.ray.style.opacity=.45; this.core.setAttribute('fill','#ffb03a'); break;
      case 'rotate': this.angle += 60; this.rot.style.transform = `rotate(${this.angle}deg)`; break;
      case 'fuel':   this.fuel = a.arg; break;
    }
    this.renderStatus();
  }

  /* програти список дій із затримкою; повертає Promise */
  play(actions, onLog){
    return new Promise(resolve=>{
      if(!actions.length){ resolve(); return; }
      const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
      const gap = reduce ? 0 : 300;
      let i = 0;
      const step = ()=>{
        const a = actions[i];
        if(a.type === 'print'){ if(onLog) onLog(a.arg); }
        else this.apply(a);
        i++;
        if(i < actions.length){ setTimeout(step, gap); }
        else resolve();
      };
      step();
    });
  }
}

window.LighthouseView = LighthouseView;
