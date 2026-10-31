/* Treatment-day instrument + midline rest.
   - The ruler fills and its bracket travels the wire as the visitor scrolls (day 1 → 540).
   - The midline is the alignment axis of the hero and Act I; past them it would only cut through
     copy, so it rests (fades) once the crowd scene has resolved. */
import M from '../motion/kernel.js';
import { root, $, clamp } from '../lib/dom.js';

function init() {
  const hud = $('.hud');
  const dayEl = $('[data-day]');
  const dayBar = $('[data-day-bar]');
  const crowd = $('#crowding');
  let lastDay = -1;
  let midlineEnd = Infinity;
  const measure = (vh) => { midlineEnd = crowd ? crowd.offsetTop + crowd.offsetHeight - vh * 0.6 : vh; };
  measure(window.innerHeight);
  M.onResize((w, h) => measure(h));
  M.onScroll((y, vh) => {
    root.classList.toggle('midline-rest', y > midlineEnd);
    if (!dayEl) return;
    const max = root.scrollHeight - vh;
    const p = max > 0 ? clamp(y / max) : 0;
    const day = 1 + Math.round(p * 539);
    if (day !== lastDay) { dayEl.textContent = String(day).padStart(3, '0'); lastDay = day; }
    if (dayBar) dayBar.style.transform = `scaleY(${p.toFixed(4)})`;
    if (hud) hud.style.setProperty('--p', p.toFixed(4));
    root.classList.toggle('hud-on', y > vh * 0.35);   // treatment begins when the visitor scrolls
  });
}

init();
