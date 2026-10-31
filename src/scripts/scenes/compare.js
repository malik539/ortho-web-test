/* Before / After with the archwire divider and the radiograph view. */
import M from '../motion/kernel.js';
import { $, clamp } from '../lib/dom.js';
import { track } from '../lib/track.js';

function init() {
/* ======================================================================
     §5 ACT III — BEFORE / AFTER + RADIOGRAPH
     ====================================================================== */
  const frame = $('[data-compare]');
  if (frame) {
    const input = $('.compare__range', frame);
    const stage = $('.compare__stage', frame);
    const xrayBtn = $('[data-xray]', frame);
    let interacted = false;
    const set = (v) => {
      const val = clamp(v, 0, 100);
      frame.style.setProperty('--pos', val + '%');
      input.value = Math.round(val);
      input.setAttribute('aria-valuetext', Math.round(100 - val) + '% of the redesigned website visible');
    };
    const noteInteraction = (method) => {
      demo.cancel = true;
      if (demo.leg) demo.leg.cancel();
      if (!interacted) { interacted = true; track('compare_interact', { method }); }
    };
    input.addEventListener('input', () => { set(Number(input.value)); noteInteraction('keyboard'); });

    let dragging = false;
    const fromEvent = (e) => { const r = stage.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    stage.addEventListener('pointerdown', (e) => { dragging = true; stage.setPointerCapture(e.pointerId); fromEvent(e); noteInteraction('pointer'); });
    stage.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    stage.addEventListener('pointerup', () => { dragging = false; });
    stage.addEventListener('pointercancel', () => { dragging = false; });

    // Radiograph: reveals the after-site's skeleton + data. Pulls the wire left so the after-site is visible.
    xrayBtn.addEventListener('click', () => {
      const on = !frame.classList.contains('is-xray');
      frame.classList.toggle('is-xray', on);
      xrayBtn.setAttribute('aria-pressed', String(on));
      if (on && Number(input.value) > 3) slideTo(2);
      track('xray_toggle', { on });
      noteInteraction('xray');
    });

    let slide = null;
    const slideTo = (target, dur = 900) => {
      if (slide) slide.cancel();
      slide = M.tween({ from: Number(input.value), to: target, duration: dur, ease: 'settle', onUpdate: set });
    };

    // One gentle demonstration sweep the first time it is seen.
    const demo = { cancel: false, leg: null };
    if (!M.reduced) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const keys = [50, 30, 64, 50];
        const leg = (k) => {
          if (demo.cancel || k >= keys.length - 1) return;
          demo.leg = M.tween({
            from: keys[k], to: keys[k + 1], duration: 900, delay: k ? 0 : 400, ease: 'settle',
            onUpdate: (v) => { if (!demo.cancel) set(v); }, onComplete: () => leg(k + 1),
          });
        };
        leg(0);
      }, { threshold: 0.55 });
      io.observe(frame);
    }
    set(50);
  }
}

init();
