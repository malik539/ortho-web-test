/* Wire + brackets that engage in sequence: first-visit steps and phase milestones (every [data-steps]). */
import M from '../motion/kernel.js';
import { $$ } from '../lib/dom.js';

function init() {
  $$('[data-steps]').forEach((steps) => {
    if (steps.dataset.stepsBound) return;
    steps.dataset.stepsBound = '1';
    const items = $$('.step', steps);
    const engage = () => {
      if (steps.classList.contains('is-in')) return;
      steps.classList.add('is-in');
      items.forEach((s, i) => setTimeout(() => s.classList.add('is-in'), M.reduced ? 0 : 300 + i * 450));
    };
    if (M.reduced) { engage(); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { engage(); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(steps);
    M.onTier((t) => { if (t === 'reduced') engage(); });
  });
}

init();
