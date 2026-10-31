/* Plate 04 radiograph scanner: the band follows the pointer, or sweeps slowly while in view (full tier).
   Runs on the shared clock only while the plate is visible; static in lite/reduced. */
import M from '../motion/kernel.js';
import { $, lerp, finePointer } from '../lib/dom.js';

function init() {
  const plate = $('[data-radiograph]');
  if (!plate) return;
  const scan = { x: 72, tx: 72, hover: false, visible: false, running: false };
  const step = (now) => {
    if (!scan.hover) scan.tx = M.full ? 50 + Math.sin(now / 2600) * 30 : 72;
    scan.x = M.reduced ? scan.tx : lerp(scan.x, scan.tx, 0.08);
    plate.style.setProperty('--rx', scan.x.toFixed(2) + '%');
    const keep = scan.visible && (M.full || scan.hover || Math.abs(scan.tx - scan.x) > 0.05);
    if (!keep) scan.running = false;
    return keep;
  };
  const run = () => { if (!scan.running && scan.visible) { scan.running = true; M.add(step); } };
  if (finePointer) {
    plate.addEventListener('pointerenter', () => { scan.hover = true; run(); });
    plate.addEventListener('pointerleave', () => { scan.hover = false; run(); });
    plate.addEventListener('pointermove', (e) => {
      const r = plate.getBoundingClientRect();
      scan.tx = ((e.clientX - r.left) / r.width) * 100;
      run();
    });
  }
  new IntersectionObserver(([e]) => { scan.visible = e.isIntersecting; run(); }).observe(plate);
  M.onTier(run);
}

init();
