/* ==========================================================================
   ORTHO MARKETING — "LIGHT, CONTINUOUS FORCE"
   Experience runtime for the prototype. Vanilla JS, no dependencies.
   Production note: the choreography maps 1:1 onto GSAP + ScrollTrigger.

   §0  Utilities + analytics          §8  Debond arch
   §1  Loader (the Orb)               §9  First-visit steps
   §2  Cold open                      §10 Alignment reveals
   §3  Crowding scrub                 §11 HUD, scene-aware nav, scroll spy
   §4  Treatment rail                 §12 Menu
   §5  Before/after + radiograph      §13 Consultation overlay
   §6  Waveform                       §14 Director's notes
   §7  FAQ                            §15 Frame loop
   ========================================================================== */
(() => {
  'use strict';

  /* ======================================================================
     §0 UTILITIES + ANALYTICS
     ====================================================================== */
  const root = document.documentElement;
  const body = document.body;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const easeForce = (t) => 1 - Math.pow(1 - t, 4);
  const easeSettle = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const seeded = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* storage unavailable */ } },
  };

  // Analytics: pushes to a GTM-style dataLayer. Never send PII here.
  const track = (event, props = {}) => {
    (window.dataLayer = window.dataLayer || []).push({ event, ...props });
  };

  // The Orb's smile: t = 0 closed (zero-area band) → 1 the logo's crescent.
  const smileD = (t) => {
    const cy = (49.6 + 7.1 * t).toFixed(2);
    const ry = (38.4 + 17.9 * t).toFixed(2);
    return `M0 49.6A62 38.4 0 0 0 124 49.6L124 ${cy}A62 ${ry} 0 0 1 0 ${cy}Z`;
  };
  const animateSmile = (path, dur = 700, delay = 0) => new Promise((resolve) => {
    if (!path) return resolve();
    if (reduce) { path.setAttribute('d', smileD(1)); return resolve(); }
    const start = performance.now() + delay;
    const tick = (now) => {
      const t = clamp((now - start) / dur);
      path.setAttribute('d', smileD(easeForce(t)));
      if (t < 1) requestAnimationFrame(tick); else resolve();
    };
    requestAnimationFrame(tick);
  });

  let vw = window.innerWidth;
  let vh = window.innerHeight;
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();

  /* ======================================================================
     §2 COLD OPEN (defined before the loader, which hands off to it)
     ====================================================================== */
  const hero = $('.hero');
  const title = $('[data-crowd]');

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

  const wireSvg = $('[data-hero-wire]');
  const wirePath = wireSvg && wireSvg.querySelector('path');
  const wireLine = $('[data-wire-line]');
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
    const tick = (now) => {
      const t = clamp((now - start) / 2600);
      wirePath.setAttribute('d', wireD(easeForce(t)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (wirePath) wirePath.setAttribute('d', wireD(reduce ? 1 : 0));

  let coldOpenStarted = false;
  const startColdOpen = () => {
    if (coldOpenStarted) return;
    coldOpenStarted = true;
    placeWire();
    root.classList.add('is-lit');
    setTimeout(() => { root.classList.add('is-aligned'); animateWire(); }, reduce ? 0 : 150);
  };

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
      { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
    );
    const smile = animateSmile($('[data-orb-smile]'), 750, 320);
    // Hold until fonts are ready (so the hero doesn't reflow), min 1.1s, max 2.5s.
    await Promise.race([Promise.all([fontsReady, wait(1100), smile, orbAnim.finished]), wait(2500)]);

    // FLIP: fly to the O inside the nav logo (O occupies x 5–128, y 5–129 of 816×142).
    const r = brand.getBoundingClientRect();
    const size = loaderOrb.getBoundingClientRect().width;
    const tx = r.left + r.width * (66.5 / 816);
    const ty = r.top + r.height * (67 / 142);
    const s = (r.height * (124 / 142)) / size;
    const dx = tx - vw / 2;
    const dy = ty - vh / 2;
    setTimeout(() => root.classList.add('is-revealing'), 150);
    await loaderOrb.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)' },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${s})` },
      ],
      { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }
    ).finished;

    root.classList.remove('is-loading');
    loaderOrb.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, fill: 'forwards' });
    startColdOpen();
    try { sessionStorage.setItem('om-loaded', '1'); } catch (e) { /* ignore */ }
    await wait(900);
    loader.remove();
  };

  if (loader && !root.classList.contains('no-loader') && loaderOrb && brand && loaderOrb.animate) {
    runLoader();
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(startColdOpen);
  }

  /* ---------- Operatory light ------------------------------------------- */
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
     §3 ACT I — CROWDING (scroll-scrubbed)
     ====================================================================== */
  const crowd = $('.crowd');
  const claims = $$('[data-crowd-field] .claim').map((el) => ({ el }));

  const setupCrowd = () => {
    if (!crowd || !claims.length) return;
    const rand = seeded(4);
    const narrow = vw < 768;
    const n = claims.length;
    const fieldCenterY = vh * 0.58;
    claims.forEach((c, i) => {
      const w = c.el.offsetWidth;
      const h = c.el.offsetHeight;
      c.sx = (rand() - 0.5) * Math.min(vw * 0.46, 640);
      c.sy = (rand() - 0.5) * vh * (narrow ? 0.22 : 0.26);
      c.sr = (rand() - 0.5) * 34;
      let ex, ey;
      if (narrow) {
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
      c.ex = clamp(ex, -maxX, maxX);
      c.ey = clamp(ey, -fieldCenterY + h / 2 + 72, vh - fieldCenterY - h / 2 - 56);
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
    const fade = vw < 768 ? 0.12 : 0.2;
    claims.forEach((c) => {
      const s = c.el.style;
      s.setProperty('--tx', lerp(c.sx, c.ex, spread).toFixed(1) + 'px');
      s.setProperty('--ty', lerp(c.sy, c.ey, spread).toFixed(1) + 'px');
      s.setProperty('--tr', lerp(c.sr, 0, spread).toFixed(2) + 'deg');
      s.setProperty('--to', lerp(1, fade, spread).toFixed(3));
    });
  };

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
  const updatePlan = () => {
    if (!phasesWrap || !fill) return;
    const r = phasesWrap.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const first = phases[0].getBoundingClientRect();
    const last = phases[phases.length - 1].getBoundingClientRect();
    fill.style.setProperty('--fill', range(vh / 2, first.top + first.height / 2, last.top + last.height / 2).toFixed(3));
  };

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

    const slideTo = (target, dur = 900) => {
      const from = Number(input.value);
      const start = performance.now();
      const tick = (now) => {
        const t = clamp((now - start) / dur);
        set(lerp(from, target, easeSettle(t)));
        if (t < 1) requestAnimationFrame(tick);
      };
      if (reduce) set(target); else requestAnimationFrame(tick);
    };

    // One gentle demonstration sweep the first time it is seen.
    const demo = { cancel: false };
    if (!reduce) {
      const io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now() + 400;
        const keys = [50, 30, 64, 50];
        const tick = (now) => {
          if (demo.cancel) return;
          const t = (now - start) / 900;
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
     §6 ACT V — WAVEFORM + episode tracking
     ====================================================================== */
  const wave = $('[data-wave]');
  if (wave) {
    const rand = seeded(23);
    const bars = vw < 768 ? 48 : 112;
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
  $$('[data-episode]').forEach((a) => a.addEventListener('click', () => track('episode_click', { episode: a.dataset.episode })));

  /* ======================================================================
     §7 FAQ
     ====================================================================== */
  $$('.faq details').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() });
  }));

  /* ======================================================================
     §8 FINALE — DEBOND ARCH
     ====================================================================== */
  const arch = $('[data-arch]');
  const archWire = arch && $('.arch__wire', arch);
  const archGroup = arch && $('.arch__brackets', arch);
  const archBrackets = [];
  let archLen = 0;
  if (arch && archWire) {
    archLen = archWire.getTotalLength();
    archWire.style.strokeDasharray = archLen;
    archWire.style.strokeDashoffset = reduce ? 0 : archLen;
    const widths = [30, 28, 22, 22, 20, 18, 18, 18, 18, 20, 22, 22, 28, 30]; // molar → incisor → molar
    const rand = seeded(7);
    widths.forEach((w, i) => {
      const f = 0.03 + (i / (widths.length - 1)) * 0.94;
      const pt = archWire.getPointAtLength(f * archLen);
      const pt2 = archWire.getPointAtLength(Math.min(archLen, f * archLen + 1));
      const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', (pt.x - w / 2).toFixed(1));
      rect.setAttribute('y', (pt.y - 8).toFixed(1));
      rect.setAttribute('width', w);
      rect.setAttribute('height', 16);
      rect.setAttribute('rx', 3);
      const crooked = (rand() - 0.5) * 50;
      rect.style.transform = reduce ? `rotate(${angle}deg)` : `rotate(${angle + crooked}deg) scale(.4)`;
      rect.style.opacity = reduce ? 1 : 0;
      archGroup.appendChild(rect);
      archBrackets.push({ el: rect, f, angle, crooked, on: false });
    });
  }
  const updateArch = () => {
    if (!arch || reduce) return;
    const r = arch.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = easeSettle(range(vh * 1.15 - (r.top + r.height / 2), 0, vh * 0.6));
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
     §9 FIRST-VISIT STEPS — the wire draws, brackets engage in sequence
     ====================================================================== */
  const steps = $('[data-steps]');
  if (steps) {
    const items = $$('.step', steps);
    const engage = () => {
      steps.classList.add('is-in');
      items.forEach((s, i) => setTimeout(() => s.classList.add('is-in'), reduce ? 0 : 300 + i * 450));
    };
    if (reduce) engage();
    else {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { engage(); io.disconnect(); } }, { threshold: 0.35 });
      io.observe(steps);
    }
  }

  /* ======================================================================
     §10 ALIGNMENT REVEALS — [data-align]
     ====================================================================== */
  const aligners = $$('[data-align]');
  if (aligners.length) {
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
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
      aligners.forEach((el) => io.observe(el));
    }
  }

  /* ======================================================================
     §11 HUD, SCENE-AWARE NAV, SCROLL SPY, ACT TRACKING
     ====================================================================== */
  const dayEl = $('[data-day]');
  const dayBar = $('[data-day-bar]');
  const nav = $('[data-nav]');
  const scenes = $$('[data-scene]').filter((el) => el !== body);
  let lastY = window.scrollY;
  let lastDay = -1;

  const updateHud = () => {
    const y = window.scrollY;
    const max = root.scrollHeight - vh;
    const p = max > 0 ? clamp(y / max) : 0;
    const day = 1 + Math.round(p * 539);
    if (day !== lastDay && dayEl) { dayEl.textContent = String(day).padStart(3, '0'); lastDay = day; }
    if (dayBar) dayBar.style.transform = `scaleX(${p.toFixed(4)})`;
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.top <= 36 && r.bottom > 36) { if (body.dataset.scene !== s.dataset.scene) body.dataset.scene = s.dataset.scene; break; }
    }
    if (nav && !root.classList.contains('menu-open')) {
      if (y > vh * 0.6 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y < vh * 0.6) nav.classList.remove('is-hidden');
    }
    lastY = y;
  };

  const navLinks = $$('.nav__links a');
  const spyTargets = navLinks.map((a) => $(a.getAttribute('href'))).filter(Boolean);
  const seenActs = new Set();
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = '#' + e.target.id;
      navLinks.forEach((a) => (a.getAttribute('href') === id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  spyTargets.forEach((t) => spy.observe(t));
  const actObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !seenActs.has(e.target.id)) { seenActs.add(e.target.id); track('scroll_act', { act: e.target.id }); }
    });
  }, { threshold: 0.25 });
  $$('main > section[id]').forEach((s) => actObserver.observe(s));

  $$('[data-cta]').forEach((el) => el.addEventListener('click', () => track('cta_click', { location: el.dataset.cta })));

  /* ---------- Shared overlay helpers (inert background + focus trap) ------ */
  const backgroundEls = () => [$('#main'), nav, $('.credits'), $('.hud'), $('[data-notes]')].filter(Boolean);
  const setInert = (on) => backgroundEls().forEach((el) => { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
  const focusables = (el) => $$('a[href], button:not([disabled]):not([hidden]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', el)
    .filter((n) => n.offsetParent !== null || n === document.activeElement);
  const trapTab = (container) => (e) => {
    if (e.key !== 'Tab') return;
    const f = focusables(container);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ======================================================================
     §12 MENU (tablet + mobile)
     ====================================================================== */
  const menu = $('[data-menu]');
  const menuBtn = $('[data-menu-open]');
  if (menu && menuBtn) {
    $$('.menu__links a', menu).forEach((a, i) => a.style.setProperty('--i', i));
    const trap = trapTab(menu);
    const openMenu = () => {
      const r = menuBtn.getBoundingClientRect();
      menu.style.setProperty('--mx', r.left + r.width / 2 + 'px');
      menu.style.setProperty('--my', r.top + r.height / 2 + 'px');
      menu.hidden = false;
      root.classList.add('menu-open');
      menuBtn.setAttribute('aria-expanded', 'true');
      setInert(true);
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      menu.addEventListener('keydown', trap);
      setTimeout(() => $('.menu__links a', menu).focus(), reduce ? 0 : 250);
      track('menu_open');
    };
    const closeMenu = (returnFocus = true) => {
      menu.classList.remove('is-open');
      root.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      setInert(false);
      menu.removeEventListener('keydown', trap);
      setTimeout(() => { menu.hidden = true; }, reduce ? 0 : 800);
      if (returnFocus) menuBtn.focus();
    };
    menuBtn.addEventListener('click', openMenu);
    $('[data-menu-close]', menu).addEventListener('click', () => closeMenu());
    $$('.menu__links a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    menu.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    window.matchMedia('(min-width: 1200px)').addEventListener('change', (m) => { if (m.matches && !menu.hidden) closeMenu(false); });
    menu._close = closeMenu;
  }

  /* ======================================================================
     §13 CONSULTATION — the records appointment
     ====================================================================== */
  const consult = $('[data-consult]');
  if (consult) {
    const form = $('[data-consult-form]', consult);
    const bodyEl = $('[data-consult-body]', consult);
    const done = $('[data-consult-done]', consult);
    const stepsEls = $$('.cstep', consult);
    const progB = $$('.cprog__b', consult);
    const progFill = $('[data-cprog-fill]', consult);
    const status = $('[data-cstatus]', consult);
    const back = $('[data-cback]', consult);
    const next = $('[data-cnext]', consult);
    const nextLabel = $('[data-cnext-label]', consult);
    const DRAFT = 'om-consult-draft';
    const trap = trapTab(consult);
    let step = 1;
    let trigger = null;
    let source = 'unknown';
    let submitted = false;

    const showStep = (n, focus = true) => {
      step = n;
      stepsEls.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.step) === n));
      progB.forEach((b, i) => b.classList.toggle('is-on', i < n));
      progFill.style.setProperty('--p', ((n - 1) / 3).toFixed(3));
      back.hidden = n === 1;
      nextLabel.textContent = n === 4 ? 'Request consultation' : 'Continue';
      status.textContent = `Step ${n} of 4`;
      if (focus) {
        const t = $('.cstep.is-active .cstep__title', consult);
        t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
        $('.consult__inner', consult).scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      }
      track('consultation_step', { step: n });
    };

    // ---- Draft persistence (per-viewer convenience only) ----
    const saveDraft = () => {
      const data = {};
      new FormData(form).forEach((v, k) => { (data[k] = data[k] || []).push(v); });
      store.set(DRAFT, JSON.stringify({ step, data }));
    };
    const restoreDraft = () => {
      const raw = store.get(DRAFT);
      if (!raw) return 1;
      try {
        const { step: s, data } = JSON.parse(raw);
        Object.entries(data).forEach(([k, vals]) => {
          $$(`[name="${k}"]`, form).forEach((el) => {
            if (el.type === 'checkbox' || el.type === 'radio') el.checked = vals.includes(el.value);
            else el.value = vals[0];
          });
        });
        return clamp(Number(s) || 1, 1, 4);
      } catch (e) { return 1; }
    };
    form.addEventListener('input', (e) => { clearError(e.target); saveDraft(); });
    form.addEventListener('change', (e) => { clearError(e.target); saveDraft(); });

    // ---- Validation ----
    const wrapperFor = (el) => el.closest('.chips') || el.closest('.field');
    const clearError = (el) => {
      const w = wrapperFor(el);
      if (!w || !w.classList.contains('has-err')) return;
      w.classList.remove('has-err');
      $$('[aria-invalid]', w).forEach((n) => n.removeAttribute('aria-invalid'));
    };
    const fail = (el) => {
      const w = wrapperFor(el);
      w.classList.add('has-err');
      if (el.matches('input:not([type=radio]):not([type=checkbox]), select, textarea')) el.setAttribute('aria-invalid', 'true');
      return el;
    };
    const validate = (n) => {
      const scope = $(`.cstep[data-step="${n}"]`, consult);
      const invalid = [];
      $$('input[required]:not([type=radio]), select[required], textarea[required]', scope).forEach((el) => {
        const v = el.value.trim();
        const bad = !v || (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
        if (bad) invalid.push(fail(el));
      });
      const radioNames = [...new Set($$('input[type=radio][required]', scope).map((r) => r.name))];
      radioNames.forEach((name) => {
        const group = $$(`input[name="${name}"]`, scope);
        if (!group.some((r) => r.checked)) invalid.push(fail(group[0]));
      });
      const minGroup = $('[data-min-group]', scope);
      if (minGroup) {
        const group = $$(`input[name="${minGroup.name}"]`, scope);
        if (!group.some((c) => c.checked)) invalid.push(fail(group[0]));
      }
      if (invalid.length) { invalid[0].focus(); track('consultation_error', { step: n, fields: invalid.length }); }
      return !invalid.length;
    };

    // ---- Navigation ----
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(step)) return;
      if (step < 4) { showStep(step + 1); saveDraft(); return; }
      next.setAttribute('aria-busy', 'true');
      nextLabel.textContent = 'Sending…';
      // Production: POST the payload to the CRM endpoint here (see blueprint §6.7).
      await wait(reduce ? 0 : 900);
      next.removeAttribute('aria-busy');
      submitted = true;
      store.del(DRAFT);
      const fd = new FormData(form);
      const first = String(fd.get('name') || '').trim().split(/\s+/)[0];
      $('[data-done-name]', consult).textContent = first ? `, ${first}` : '';
      $('[data-done-practice]', consult).textContent = String(fd.get('practice') || 'your practice').trim();
      bodyEl.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      animateSmile($('[data-done-smile]', consult), 900, 500);
      track('consultation_submit', { source, locations: fd.get('locations'), goals: fd.getAll('goals').length });
    });
    back.addEventListener('click', () => showStep(Math.max(1, step - 1)));

    // ---- Open / close: the Orb expands from the click point ----
    const open = (e, el) => {
      if (e) e.preventDefault();
      if (menu && !menu.hidden && menu._close) menu._close(false);
      trigger = el;
      source = (el && el.dataset.cta) || 'unknown';
      let x = vw / 2, y = vh / 2;
      if (el) { const r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      consult.style.setProperty('--ox', x + 'px');
      consult.style.setProperty('--oy', y + 'px');
      if (submitted) { form.reset(); submitted = false; done.hidden = true; bodyEl.hidden = false; }
      const resume = restoreDraft();
      consult.hidden = false;
      consult.classList.remove('is-closing');
      root.classList.add('consult-open');
      setInert(true);
      consult.addEventListener('keydown', trap);
      requestAnimationFrame(() => requestAnimationFrame(() => consult.classList.add('is-open')));
      track('consultation_open', { source, resumed_step: resume });
      showStep(resume, false);
      setTimeout(() => {
        const t = $('.cstep.is-active .cstep__title', consult);
        t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
      }, reduce ? 0 : 450);
    };
    const close = () => {
      if (consult.hidden) return;
      if (!submitted) track('consultation_abandon', { step });
      if (trigger) {
        const r = trigger.getBoundingClientRect();
        consult.style.setProperty('--ox', r.left + r.width / 2 + 'px');
        consult.style.setProperty('--oy', r.top + r.height / 2 + 'px');
      }
      consult.classList.add('is-closing');
      consult.classList.remove('is-open');
      consult.removeEventListener('keydown', trap);
      setTimeout(() => {
        consult.hidden = true;
        consult.classList.remove('is-closing');
        root.classList.remove('consult-open');
        setInert(false);
        if (trigger && document.contains(trigger)) trigger.focus({ preventScroll: true });
      }, reduce ? 0 : 600);
    };

    $$('[data-consult-open]').forEach((el) => el.addEventListener('click', (e) => open(e, el)));
    $$('[data-consult-close]', consult).forEach((el) => el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      close();
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => { const t = $(href); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, reduce ? 0 : 620);
      }
    }));
    consult.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    if (location.hash === '#consultation') open(null, null);
  }

  /* ======================================================================
     §14 DIRECTOR'S NOTES
     ====================================================================== */
  const notesBtn = $('[data-notes]');
  if (notesBtn) {
    notesBtn.addEventListener('click', () => {
      const on = root.classList.toggle('notes-on');
      notesBtn.setAttribute('aria-pressed', String(on));
    });
  }

  /* ======================================================================
     §15 FRAME LOOP — one rAF; scroll work only when something moved
     ====================================================================== */
  let dirty = true;
  window.addEventListener('scroll', () => { dirty = true; }, { passive: true });
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { vw = window.innerWidth; vh = window.innerHeight; placeWire(); setupCrowd(); dirty = true; }, 120);
  });
  if (hero) new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);

  const frameLoop = (now) => {
    if (hero && heroVisible && !reduce) {
      if (!finePointer) { light.tx = 60 + Math.sin(now / 4200) * 16; light.ty = 32 + Math.cos(now / 5300) * 10; }
      light.x = lerp(light.x, light.tx, 0.06);
      light.y = lerp(light.y, light.ty, 0.06);
      hero.style.setProperty('--lx', light.x.toFixed(2) + '%');
      hero.style.setProperty('--ly', light.y.toFixed(2) + '%');
    }
    if (dirty) { dirty = false; updateHud(); updateCrowd(); updatePlan(); updateArch(); }
    requestAnimationFrame(frameLoop);
  };

  fontsReady.then(() => { placeWire(); setupCrowd(); dirty = true; requestAnimationFrame(frameLoop); });
})();
