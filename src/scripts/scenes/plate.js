/* Plate 07 — the cursor is the key light. Damped on the shared clock; fine pointers only. */
import M from '../motion/kernel.js';
import { $$, clamp, finePointer } from '../lib/dom.js';

const REST = { x: 30, y: 26 };   // north window, upper left

$$('[data-plate]').forEach((plate) => {
  if (!finePointer) return;
  const k = { x: REST.x, y: REST.y, tx: REST.x, ty: REST.y };
  let running = false;
  const step = () => {
    k.x += (k.tx - k.x) * 0.08;
    k.y += (k.ty - k.y) * 0.08;
    plate.style.setProperty('--kx', k.x.toFixed(2));
    plate.style.setProperty('--ky', k.y.toFixed(2));
    running = Math.abs(k.tx - k.x) + Math.abs(k.ty - k.y) > 0.05;
    return running;
  };
  const go = () => { if (!running) { running = true; M.add(step); } };
  plate.addEventListener('pointermove', (e) => {
    if (M.reduced) return;
    const r = plate.getBoundingClientRect();
    k.tx = clamp(((e.clientX - r.left) / r.width) * 100, 6, 94);
    k.ty = clamp(((e.clientY - r.top) / r.height) * 100, 4, 72);
    go();
  });
  plate.addEventListener('pointerleave', () => { k.tx = REST.x; k.ty = REST.y; go(); });
});
