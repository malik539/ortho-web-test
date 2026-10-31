/* ==========================================================================
   ORTHO MARKETING — "LIGHT, CONTINUOUS FORCE"
   Motion system for the concept prototype. Vanilla JS, no dependencies.
   Production note: the same choreography maps 1:1 onto GSAP ScrollTrigger.
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- Math ------------------------------------------------------ */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const easeForce = (t) => 1 - Math.pow(1 - t, 4);              // ≈ --ease-force
  const easeSettle = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // ≈ --ease-settle
  const seeded = (seed) => () => {                                 // mulberry32
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  let vw = window.innerWidth;
  let vh = window.innerHeight;

  /* ======================================================================
     1. HERO — split the headline into "crowded" letters
     ====================================================================== */
  const hero = document.querySelector('.hero');
  const title = document.querySelector('[data-crowd]');

  if (title) {
    const rand = seeded(11);
    let i = 0;
    const split = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((word) => {
            if (!word) return;
            if (/^\s+$/.test(word)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = 'w';
            w.setAttribute('aria-hidden', 'true');
            [...word].forEach((c) => {
              const s = document.createElement('span');
              s.className = 'ch';
              s.textContent = c;
              // Crowding: each glyph slightly rotated, displaced and overlapping its neighbors.
              s.style.setProperty('--x', ((rand() - 0.5) * 0.12).toFixed(3) + 'em');
              s.style.setProperty('--y', ((rand() - 0.5) * 0.14).toFixed(3) + 'em');
              s.style.setProperty('--r', ((rand() - 0.5) * 16).toFixed(2) + 'deg');
              s.style.setProperty('--i', i++);
              w.appendChild(s);
            });
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          split(child);
        }
      });
    };
    title.querySelectorAll('.line').forEach(split);
  }

  /* ---------- The archwire: wavy (crowded) → straight (aligned) ---------- */
  const wireSvg = document.querySelector('[data-hero-wire]');
  const wirePath = wireSvg && wireSvg.querySelector('path');
  const wireLine = document.querySelector('[data-wire-line]');

  const wireD = (t) => {
    const amp = 24 * (1 - t);
    let d = '';
    for (let x = 0; x <= 1000; x += 8) {
      const env = Math.sin((Math.PI * x) / 1000);
      const y = 50 + amp * env * (Math.sin(x * 0.019 + 1.3) * 0.62 + Math.sin(x * 0.053 + 0.4) * 0.38);
      d += (x ? ' L' : 'M') + x + ' ' + y.toFixed(2);
    }
    return d;
  };

  const placeWire = () => {
    if (!hero || !wireLine) return;
    const hr = hero.getBoundingClientRect();
    const lr = wireLine.getBoundingClientRect();
    hero.style.setProperty('--wire-top', (lr.top - hr.top + lr.height * 0.58).toFixed(1) + 'px');
  };

  const animateWire = () => {
    if (!wirePath) return;
    if (reduce) { wirePath.setAttribute('d', wireD(1)); return; }
    const start = performance.now() + 650;
    const dur = 2600;
    const tick = (now) => {
      const t = clamp((now - start) / dur);
      wirePath.setAttribute('d', wireD(easeForce(t)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (wirePath) wirePath.setAttribute('d', wireD(reduce ? 1 : 0));

  /* ---------- Cold open sequence ---------------------------------------- */
  // 0ms black → 200ms operatory light powers on → 350ms letters + wire begin to align.
  requestAnimationFrame(() => {
    placeWire();
    setTimeout(() => root.classList.add('is-lit'), reduce ? 0 : 200);
    setTimeout(() => { root.classList.add('is-aligned'); animateWire(); }, reduce ? 0 : 350);
  });

  /* ---------- Operatory light (cursor-led, heavily damped) --------------- */
  const light = { x: 64, y: 32, tx: 64, ty: 32 };
  let heroVisible = true;
  if (hero && finePointer) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      light.tx = ((e.clientX - r.left) / r.width) * 100;
      light.ty = ((e.clientY - r.top) / r.height) * 100;
    });
  }

  /* ======================================================================
     2. ACT I — CROWDING (scroll-scrubbed)
     ====================================================================== */
  const crowd = document.querySelector('.crowd');
  const claims = [...document.querySelectorAll('[data-crowd-field] .claim')].map((el) => ({ el }));

  const setupCrowd = () => {
    if (!crowd || !claims.length) return;
    const rand = seeded(4);
    const narrow = vw < 760;
    const n = claims.length;
    const fieldCenterY = vh * 0.58; // .claim is anchored at top: 58%
    claims.forEach((c, i) => {
      const w = c.el.offsetWidth;
      const h = c.el.offsetHeight;
      // Crowded: a tight, overlapping, rotated cluster.
      c.sx = (rand() - 0.5) * Math.min(vw * 0.46, 640);
      c.sy = (rand() - 0.5) * vh * (narrow ? 0.22 : 0.26);
      c.sr = (rand() - 0.5) * 34;
      // Aligned: pushed to the periphery, upright, leaving the center empty.
      let ex, ey;
      if (narrow) {
        // Four tidy rows (4·3·4·3): two above the resolve line, two below.
        const rows = [4, 3, 4, 3];
        const rowY = [0.13, 0.2, 0.79, 0.86];
        let r = 0, k = i;
        while (k >= rows[r]) { k -= rows[r]; r++; }
        ex = rows[r] > 1 ? lerp(-vw * 0.3, vw * 0.3, k / (rows[r] - 1)) : 0;
        ey = vh * rowY[r] - fieldCenterY;
      } else {
        const a = (i / n) * Math.PI * 2 + 0.35;
        ex = Math.cos(a) * vw * 0.41;
        ey = Math.sin(a) * vh * 0.38 - vh * 0.08;
      }
      const maxX = vw / 2 - w / 2 - 16;
      const minY = -fieldCenterY + h / 2 + 72;          // keep clear of the nav
      const maxY = vh - fieldCenterY - h / 2 - 56;       // and of the HUD
      c.ex = clamp(ex, -maxX, maxX);
      c.ey = clamp(ey, minY, maxY);
    });
  };

  const updateCrowd = () => {
    if (!crowd || reduce) return;
    const r = crowd.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = clamp(-r.top / (r.height - vh));
    const spread = easeSettle(range(p, 0.1, 0.6));
    crowd.style.setProperty('--hp', range(p, 0.16, 0.4).toFixed(3));
    crowd.style.setProperty('--rp', easeForce(range(p, 0.48, 0.76)).toFixed(3));
    const fade = vw < 760 ? 0.12 : 0.2;
    claims.forEach((c) => {
      const s = c.el.style;
      s.setProperty('--tx', lerp(c.sx, c.ex, spread).toFixed(1) + 'px');
      s.setProperty('--ty', lerp(c.sy, c.ey, spread).toFixed(1) + 'px');
      s.setProperty('--tr', lerp(c.sr, 0, spread).toFixed(2) + 'deg');
      s.setProperty('--to', lerp(1, fade, spread).toFixed(3));
    });
  };

  /* ======================================================================
     3. ACT II — TREATMENT PLAN (sticky rail + brackets)
     ====================================================================== */
  const phases = [...document.querySelectorAll('.phase')];
  const phasesWrap = document.querySelector('.plan__phases');
  const nums = [...document.querySelectorAll('.plan__num')];
  const brackets = [...document.querySelectorAll('.plan__bracket')];
  const fill = document.querySelector('[data-plan-fill]');

  const setPhase = (idx) => {
    nums.forEach((n, i) => {
      n.classList.toggle('is-active', i === idx);
      n.classList.toggle('is-past', i < idx);
    });
    brackets.forEach((b, i) => b.classList.toggle('is-active', i <= idx));
  };

  if (phases.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setPhase(Number(e.target.dataset.phase)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    phases.forEach((p) => io.observe(p));
  }

  const updatePlan = () => {
    if (!phasesWrap || !fill) return;
    const r = phasesWrap.getBoundingClientRect();
    const first = phases[0].getBoundingClientRect();
    const last = phases[phases.length - 1].getBoundingClientRect();
    const startY = first.top + first.height / 2;
    const endY = last.top + last.height / 2;
    if (r.bottom < 0 || r.top > vh) return;
    fill.style.setProperty('--fill', range(vh / 2, startY, endY).toFixed(3));
  };

  /* ======================================================================
     4. INTERLUDE — RADIOGRAPH SCANNER
     ====================================================================== */
  const plate = document.querySelector('[data-radiograph]');
  const scan = { x: 72, tx: 72, hover: false, visible: false };
  if (plate) {
    plate.addEventListener('pointerenter', () => { scan.hover = true; });
    plate.addEventListener('pointerleave', () => { scan.hover = false; });
    plate.addEventListener('pointermove', (e) => {
      const r = plate.getBoundingClientRect();
      scan.tx = ((e.clientX - r.left) / r.width) * 100;
    });
    new IntersectionObserver(([e]) => { scan.visible = e.isIntersecting; }).observe(plate);
  }

  /* ======================================================================
     5. ACT III — BEFORE / AFTER (the archwire is the divider)
     ====================================================================== */
  const frame = document.querySelector('[data-compare]');
  if (frame) {
    const input = frame.querySelector('.compare__range');
    const stage = frame.querySelector('.compare__stage');
    const set = (v) => {
      const val = clamp(v, 0, 100);
      frame.style.setProperty('--pos', val + '%');
      input.value = Math.round(val);
      input.setAttribute('aria-valuetext', Math.round(100 - val) + '% redesigned website visible');
    };
    input.addEventListener('input', () => set(Number(input.value)));

    // Pointer drag maps exactly to the cursor (native range thumbs are offset).
    input.style.pointerEvents = 'none';
    let dragging = false;
    const fromEvent = (e) => {
      const r = stage.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    stage.style.cursor = 'ew-resize';
    stage.style.touchAction = 'pan-y';
    stage.addEventListener('pointerdown', (e) => { dragging = true; stage.setPointerCapture(e.pointerId); fromEvent(e); demo.cancel = true; });
    stage.addEventListener('pointermove', (e) => { if (dragging) fromEvent(e); });
    const stop = () => { dragging = false; };
    stage.addEventListener('pointerup', stop);
    stage.addEventListener('pointercancel', stop);

    // One gentle demonstration sweep the first time it is seen.
    const demo = { cancel: false };
    if (!reduce) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now() + 400;
        const keys = [50, 30, 64, 50];
        const seg = 900;
        const tick = (now) => {
          if (demo.cancel) return;
          const t = (now - start) / seg;
          if (t < 0) return requestAnimationFrame(tick);
          const k = Math.floor(t);
          if (k >= keys.length - 1) { set(50); return; }
          set(lerp(keys[k], keys[k + 1], easeSettle(t - k)));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { threshold: 0.55 });
      io.observe(frame);
    }
    set(50);
  }

  /* ======================================================================
     6. ACT V — WAVEFORM
     ====================================================================== */
  const wave = document.querySelector('[data-wave]');
  if (wave) {
    const rand = seeded(23);
    const bars = vw < 760 ? 48 : 112;
    const played = Math.round(bars * 0.31);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < bars; i++) {
      const s = document.createElement('span');
      const env = 0.35 + 0.65 * Math.abs(Math.sin(i * 0.19) * Math.cos(i * 0.047));
      s.style.setProperty('--h', Math.round((0.18 + rand() * 0.82 * env) * 100) + '%');
      s.style.setProperty('--d', (-(rand() * 1.8)).toFixed(2) + 's');
      if (i < played) s.classList.add('is-hot');
      frag.appendChild(s);
    }
    wave.appendChild(frag);
  }

  /* ======================================================================
     7. FINALE — DEBOND (wire settles into an arch; 14 brackets engage)
     ====================================================================== */
  const arch = document.querySelector('[data-arch]');
  const archWire = arch && arch.querySelector('.arch__wire');
  const archGroup = arch && arch.querySelector('.arch__brackets');
  const archBrackets = [];
  let archLen = 0;

  if (arch && archWire) {
    archLen = archWire.getTotalLength();
    archWire.style.strokeDasharray = archLen;
    archWire.style.strokeDashoffset = reduce ? 0 : archLen;
    // Molar → premolars → canine → incisors → … mirrored. Widths follow tooth size.
    const widths = [30, 28, 22, 22, 22, 18, 18, 18, 18, 22, 22, 22, 28, 30];
    const rand = seeded(7);
    const ns = 'http://www.w3.org/2000/svg';
    widths.forEach((w, i) => {
      const f = 0.03 + (i / (widths.length - 1)) * 0.94;
      const pt = archWire.getPointAtLength(f * archLen);
      const pt2 = archWire.getPointAtLength(Math.min(archLen, f * archLen + 1));
      const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
      const rect = document.createElementNS(ns, 'rect');
      const h = 16;
      rect.setAttribute('x', (pt.x - w / 2).toFixed(1));
      rect.setAttribute('y', (pt.y - h / 2).toFixed(1));
      rect.setAttribute('width', w);
      rect.setAttribute('height', h);
      rect.setAttribute('rx', 3);
      const crooked = (rand() - 0.5) * 50;
      const b = { el: rect, f, angle, crooked, on: false };
      rect.style.transform = reduce ? `rotate(${angle}deg)` : `rotate(${angle + crooked}deg) scale(.4)`;
      rect.style.opacity = reduce ? 1 : 0;
      archGroup.appendChild(rect);
      archBrackets.push(b);
    });
  }

  const updateArch = () => {
    if (!arch || reduce) return;
    const r = arch.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    // 0 as the arch enters the viewport → 1 when its center reaches 55% of the viewport.
    const center = r.top + r.height / 2;
    const p = easeSettle(range(vh * 1.15 - center, 0, vh * 0.6));
    archWire.style.strokeDashoffset = (archLen * (1 - p)).toFixed(1);
    archBrackets.forEach((b) => {
      const on = p >= b.f - 0.02;
      if (on === b.on) return;
      b.on = on;
      b.el.style.opacity = on ? 1 : 0;
      b.el.style.transform = on ? `rotate(${b.angle}deg)` : `rotate(${b.angle + b.crooked}deg) scale(.4)`;
    });
  };

  /* ======================================================================
     8. ALIGNMENT REVEALS — [data-align]
     ====================================================================== */
  const aligners = [...document.querySelectorAll('[data-align]')];
  if (aligners.length) {
    // Stagger siblings within the same parent; alternate the rotation for an organic settle.
    const groups = new Map();
    aligners.forEach((el) => {
      const key = el.parentElement;
      const idx = groups.get(key) || 0;
      groups.set(key, idx + 1);
      el.style.setProperty('--delay', idx * 110 + 'ms');
      el.style.setProperty('--ar', (idx % 2 ? 1.4 : -2.2) + 'deg');
    });
    if (reduce || !('IntersectionObserver' in window)) {
      aligners.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
      aligners.forEach((el) => io.observe(el));
    }
  }

  /* ======================================================================
     9. HUD — treatment day counter, scene-aware nav
     ====================================================================== */
  const dayEl = document.querySelector('[data-day]');
  const dayBar = document.querySelector('[data-day-bar]');
  const nav = document.querySelector('[data-nav]');
  const scenes = [...document.querySelectorAll('[data-scene]')].filter((el) => el !== body);
  let lastY = window.scrollY;
  let lastDay = -1;

  const updateHud = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - vh;
    const p = max > 0 ? clamp(y / max) : 0;
    const day = 1 + Math.round(p * 539);
    if (day !== lastDay && dayEl) {
      dayEl.textContent = String(day).padStart(3, '0');
      lastDay = day;
    }
    if (dayBar) dayBar.style.transform = `scaleX(${p.toFixed(4)})`;

    // Which scene sits under the nav?
    const probe = 36;
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) {
        if (body.dataset.scene !== s.dataset.scene) body.dataset.scene = s.dataset.scene;
        break;
      }
    }

    // Nav steps aside on the way down, returns on the way up.
    if (nav) {
      if (y > vh * 0.6 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y < vh * 0.6) nav.classList.remove('is-hidden');
    }
    lastY = y;
  };

  /* ======================================================================
     10. DIRECTOR'S NOTES
     ====================================================================== */
  const notesBtn = document.querySelector('[data-notes]');
  if (notesBtn) {
    notesBtn.addEventListener('click', () => {
      const on = root.classList.toggle('notes-on');
      notesBtn.setAttribute('aria-pressed', String(on));
    });
  }

  /* ======================================================================
     LOOP — one rAF for everything; scroll work only when something moved.
     ====================================================================== */
  let dirty = true;
  const onScroll = () => { dirty = true; };
  window.addEventListener('scroll', onScroll, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      placeWire();
      setupCrowd();
      dirty = true;
    }, 120);
  });

  if (hero) {
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  }

  const frameLoop = (now) => {
    // Operatory light: damped follow (desktop) or slow ambient drift (touch).
    if (hero && heroVisible && !reduce) {
      if (!finePointer) {
        light.tx = 60 + Math.sin(now / 4200) * 16;
        light.ty = 32 + Math.cos(now / 5300) * 10;
      }
      light.x = lerp(light.x, light.tx, 0.06);
      light.y = lerp(light.y, light.ty, 0.06);
      hero.style.setProperty('--lx', light.x.toFixed(2) + '%');
      hero.style.setProperty('--ly', light.y.toFixed(2) + '%');
    }

    // Radiograph scanner: follows the pointer, or sweeps slowly on its own.
    if (plate && scan.visible) {
      if (!scan.hover) scan.tx = reduce ? 72 : 50 + Math.sin(now / 2600) * 30;
      scan.x = reduce ? scan.tx : lerp(scan.x, scan.tx, 0.08);
      plate.style.setProperty('--rx', scan.x.toFixed(2) + '%');
    }

    if (dirty) {
      dirty = false;
      updateHud();
      updateCrowd();
      updatePlan();
      updateArch();
    }
    requestAnimationFrame(frameLoop);
  };

  const start = () => {
    placeWire();
    setupCrowd();
    dirty = true;
    requestAnimationFrame(frameLoop);
  };

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(start);
  } else {
    window.addEventListener('load', start);
  }
})();
