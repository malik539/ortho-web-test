/* First visit — the wire draws and the brackets engage in sequence. */
import M from '../motion/kernel.js';
import { $, $$ } from '../lib/dom.js';

function init() {
/* ======================================================================
     §9 FIRST-VISIT STEPS — the wire draws, brackets engage in sequence
     ====================================================================== */
  const steps = $('[data-steps]');
  if (steps) {
    const items = $$('.step', steps);
    const engage = () => {
      steps.classList.add('is-in');
      items.forEach((s, i) => setTimeout(() => s.classList.add('is-in'), M.reduced ? 0 : 300 + i * 450));
    };
    if (M.reduced) engage();
    else {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { engage(); io.disconnect(); } }, { threshold: 0.35 });
      io.observe(steps);
    }
    M.onTier((t) => { if (t === 'reduced') engage(); });
  }
}

init();
