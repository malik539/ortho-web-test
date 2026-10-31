/* Treatment-day HUD: scroll position as an 18-month course of treatment. */
import M from '../motion/kernel.js';
import { root, $, clamp } from '../lib/dom.js';

function init() {
  const dayEl = $('[data-day]');
  const dayBar = $('[data-day-bar]');
  if (!dayEl) return;
  let lastDay = -1;
  M.onScroll((y, vh) => {
    const max = root.scrollHeight - vh;
    const p = max > 0 ? clamp(y / max) : 0;
    const day = 1 + Math.round(p * 539);
    if (day !== lastDay) { dayEl.textContent = String(day).padStart(3, '0'); lastDay = day; }
    if (dayBar) dayBar.style.transform = `scaleX(${p.toFixed(4)})`;
    root.classList.toggle('hud-on', y > vh * 0.35);   // treatment begins when the visitor scrolls
  });
}

init();
