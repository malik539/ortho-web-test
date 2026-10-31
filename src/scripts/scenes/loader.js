/* Loader — the Orb calibrates, then flies into the logo's O (first visit per session). */
import M from '../motion/kernel.js';
import { root, $, wait, fontsReady } from '../lib/dom.js';
import { animateSmile } from '../lib/orb.js';

function init() {
  // Hand-off to the hero: a class (for late listeners) and an event (for early ones).
  const go = () => { root.classList.add('cold-open-go'); document.dispatchEvent(new Event('om:coldopen')); };
/* ======================================================================
     §1 LOADER — the Orb calibrates, then flies into the logo's O
     ====================================================================== */
  const loader = $('[data-loader]');
  const loaderOrb = $('[data-loader-orb]');
  const brand = $('[data-brand]');

  const runLoader = async () => {
    root.classList.add('is-loading');
    const orbAnim = loaderOrb.animate(
      [{ transform: 'translate(-50%, -50%) scale(0)' }, { transform: 'translate(-50%, -50%) scale(1)' }],
      { duration: 700, easing: M.tokens.css.force, fill: 'forwards' }
    );
    const smile = animateSmile($('[data-orb-smile]'), 750, 320);
    // Hold until fonts are ready (so the hero doesn't reflow), min 1.1s, max 2.5s.
    // Never hold the visitor hostage: any input fast-forwards the loader.
    let skipped = false;
    const skip = new Promise((res) => ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((ev) =>
      window.addEventListener(ev, () => { skipped = true; res(); }, { once: true, passive: true })));
    await Promise.race([Promise.all([fontsReady, wait(1100), smile, orbAnim.finished]), wait(2500), skip]);

    // FLIP: fly to the O inside the nav logo (O occupies x 5–128, y 5–129 of 816×142).
    const r = brand.getBoundingClientRect();
    const size = loaderOrb.getBoundingClientRect().width;
    const tx = r.left + r.width * (66.5 / 816);
    const ty = r.top + r.height * (67 / 142);
    const s = (r.height * (124 / 142)) / size;
    const dx = tx - window.innerWidth / 2;
    const dy = ty - window.innerHeight / 2;
    setTimeout(() => root.classList.add('is-revealing'), 150);
    await loaderOrb.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)' },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${s})` },
      ],
      { duration: skipped ? 480 : 900, easing: M.tokens.css.settle, fill: 'forwards' }
    ).finished;

    root.classList.remove('is-loading');
    loaderOrb.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    go();
    try { sessionStorage.setItem('om-loaded', '1'); } catch (e) { /* ignore */ }
    await wait(900);
    loader.remove();
  };

  if (loader && !root.classList.contains('no-loader') && loaderOrb && brand && loaderOrb.animate) {
    runLoader();
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(go);
  }
}

init();
