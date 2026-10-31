/* Act II — the treatment rail: sticky numerals, engaging brackets, a filling wire. */
import M from '../motion/kernel.js';
import { $, $$, range } from '../lib/dom.js';

function init() {
/* ======================================================================
     §4 ACT II — TREATMENT RAIL
     ====================================================================== */
  const phases = $$('.phase');
  const phasesWrap = $('.plan__phases');
  const nums = $$('.plan__num');
  const brackets = $$('.plan__bracket');
  const fill = $('[data-plan-fill]');

  const setPhase = (idx) => {
    nums.forEach((n, i) => { n.classList.toggle('is-active', i === idx); n.classList.toggle('is-past', i < idx); });
    brackets.forEach((b, i) => b.classList.toggle('is-active', i <= idx));
  };
  if (phases.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setPhase(Number(e.target.dataset.phase)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    phases.forEach((p) => io.observe(p));
  }
  if (phasesWrap && fill && phases.length) {
    M.scene(phasesWrap, {
      measure: (r, h) => {
        const a = phases[0].getBoundingClientRect(), b = phases[phases.length - 1].getBoundingClientRect();
        return range(h / 2, a.top + a.height / 2, b.top + b.height / 2);
      },
      smooth: 0.2, reduced: 'live',
      onProgress: (v) => fill.style.setProperty('--fill', v.toFixed(3)),
    });
  }
}

init();
