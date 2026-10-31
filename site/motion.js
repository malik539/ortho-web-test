/* ==========================================================================
   ORTHO MARKETING — MOTION KERNEL (motion.js)
   "Light, continuous force", as code: one clock, one set of curves,
   three tiers. Loaded before page scripts; exposes window.OMMotion.

   §1 Curves      exact cubic-bezier solver (the same maths browsers use)
   §2 Tokens      read from CSS custom properties (tokens.css is the source)
   §3 Tiers       full · lite · reduced (+ the visitor's own override)
   §4 Clock       one requestAnimationFrame for the whole site; sleeps when idle
   §5 Tween       for canvas/SVG/scroll values CSS can't animate
   §6 Scenes      scroll-linked progress with "light force" smoothing
   §7 Reveals     [data-reveal] = align · lines · rise · fade · wire · exposure · draw
   §8 Loops       [data-loop] ambient animations pause off-screen / in hidden tabs
   §9 Navigation  near targets glide; far targets cut (midline wipe)
   §10 Toggle     [data-motion-toggle] — an in-site "Reduce motion" switch

   Production mapping: §4–§6 ≈ GSAP ticker + ScrollTrigger (scrub: number),
   §5 ≈ gsap.to, §9 page-level ≈ View Transitions API.
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- §1 CURVES -------------------------------------------------- */
  const bezier = (x1, y1, x2, y2) => {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const sx = (t) => ((ax * t + bx) * t + cx) * t;
    const sy = (t) => ((ay * t + by) * t + cy) * t;
    const dsx = (t) => (3 * ax * t + 2 * bx) * t + cx;
    const solve = (x) => {
      let t = x;
      for (let i = 0; i < 8; i++) {                    // Newton–Raphson
        const e = sx(t) - x;
        if (Math.abs(e) < 1e-6) return t;
        const d = dsx(t);
        if (Math.abs(d) < 1e-6) break;
        t -= e / d;
      }
      let lo = 0, hi = 1; t = x;                        // bisection fallback
      for (let i = 0; i < 40; i++) {
        const v = sx(t);
        if (Math.abs(v - x) < 1e-6) break;
        if (x > v) lo = t; else hi = t;
        t = (lo + hi) / 2;
      }
      return t;
    };
    return (x) => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
  };

  /* ---------- §2 TOKENS -------------------------------------------------- */
  const EASES = ['force', 'settle', 'release', 'debond'];
  const DURS = ['instant', 'quick', 'measured', 'force', 'treatment'];
  const tokens = { d: {}, ease: { linear: (t) => t }, curve: {}, css: {}, stagger: {} };
  const readTokens = () => {
    const cs = getComputedStyle(root);
    const time = (name, fallback) => {
      const v = cs.getPropertyValue(name).trim();
      if (!v) return fallback;
      const n = parseFloat(v);
      return /ms$/.test(v) ? n : /s$/.test(v) ? n * 1000 : n;
    };
    DURS.forEach((n) => { tokens.d[n] = time(`--d-${n}`, 600); });
    tokens.stagger.glyph = time('--stagger-glyph', 18);
    tokens.stagger.list = time('--stagger-list', 60);
    tokens.stagger.line = time('--stagger-line', 90);
    tokens.stagger.block = time('--stagger-block', 110);
    EASES.forEach((n) => {
      const m = cs.getPropertyValue(`--ease-${n}`).match(/cubic-bezier\(([^)]+)\)/);
      const p = m ? m[1].split(',').map(Number) : [0.16, 1, 0.3, 1];
      tokens.curve[n] = p;
      tokens.css[n] = `cubic-bezier(${p.join(', ')})`;
      tokens.ease[n] = bezier(p[0], p[1], p[2], p[3]);
    });
  };
  readTokens();

  /* ---------- §3 TIERS --------------------------------------------------- */
  const mq = {
    reduce: window.matchMedia('(prefers-reduced-motion: reduce)'),
    coarse: window.matchMedia('(pointer: coarse)'),
  };
  const PREF = 'om-motion';
  const getPref = () => { try { return localStorage.getItem(PREF); } catch (e) { return null; } };
  const setPref = (v) => { try { if (v) localStorage.setItem(PREF, v); else localStorage.removeItem(PREF); } catch (e) { /* storage unavailable */ } };
  const lowPower = () => (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2 ||
    !!(navigator.connection && navigator.connection.saveData);
  // Keep in sync with the inline <head> script (which sets the tier before first paint).
  const computeTier = () => {
    const p = getPref();
    if (p === 'reduced' || (p !== 'full' && mq.reduce.matches)) return 'reduced';
    return mq.coarse.matches || lowPower() ? 'lite' : 'full';
  };
  let tier = root.dataset.motion || computeTier();
  root.dataset.motion = tier;
  const tierFns = new Set();
  const applyTier = () => {
    const t = computeTier();
    if (t === tier) return;
    tier = t;
    root.dataset.motion = t;
    readTokens();                       // lite shortens long durations in CSS
    tierFns.forEach((fn) => fn(t));
    syncToggles();
    pump();
  };
  ['reduce', 'coarse'].forEach((k) => mq[k].addEventListener('change', applyTier));

  /* ---------- §4 CLOCK --------------------------------------------------- */
  const subs = new Set();
  let raf = 0, last = 0;
  const frame = (now) => {
    raf = 0;
    const dt = last ? Math.min(64, now - last) : 16.7;
    last = now;
    for (const fn of [...subs]) { if (fn(now, dt) === false) subs.delete(fn); }
    if (subs.size) raf = requestAnimationFrame(frame); else last = 0;
  };
  // fn(now, dt) runs every frame until it returns false. Idle site = zero frames.
  const add = (fn) => { subs.add(fn); if (!raf) raf = requestAnimationFrame(frame); return () => subs.delete(fn); };

  /* ---------- §5 TWEEN --------------------------------------------------- */
  const tween = ({ from = 0, to = 1, duration, delay = 0, ease = 'force', onUpdate, onComplete } = {}) => {
    const fnEase = typeof ease === 'function' ? ease : tokens.ease[ease] || tokens.ease.force;
    const dur = duration == null ? tokens.d.measured : duration;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      if (onUpdate) onUpdate(to, 1, 1);
      if (onComplete) onComplete();
    };
    if (tier === 'reduced' || dur <= 0) { finish(); return { cancel() { done = true; }, finish }; }
    let start = null;
    add((now) => {
      if (done) return false;
      if (start === null) start = now + delay;
      if (now < start) return true;
      const t = clamp((now - start) / dur);
      const e = fnEase(t);
      if (onUpdate) onUpdate(from + (to - from) * e, e, t);
      if (t >= 1) { done = true; if (onComplete) onComplete(); return false; }
      return true;
    });
    return { cancel() { done = true; }, finish };
  };

  /* ---------- §6 SCENES -------------------------------------------------- */
  let vh = window.innerHeight, vw = window.innerWidth;
  const scrollFns = new Set();
  const resizeFns = new Set();
  const scenes = new Set();
  let pumping = false;
  const pump = () => {
    if (pumping) return;
    pumping = true;
    add((now, dt) => {
      const y = window.scrollY;
      scrollFns.forEach((fn) => fn(y, vh, vw));
      let moving = false;
      scenes.forEach((s) => {
        if (!s.near) return;
        if (tier === 'reduced' && s.reduced !== 'live') return;
        s.target = clamp(s.measure(s.el.getBoundingClientRect(), vh, vw));
        if (s.smooth && tier !== 'reduced') {
          // frame-rate independent damping: the scrub trails the scroll like light force
          const k = 1 - Math.pow(1 - s.smooth, dt / 16.7);
          s.p = Math.abs(s.target - s.p) < 0.0005 ? s.target : lerp(s.p, s.target, k);
        } else {
          s.p = s.target;
        }
        if (s.p !== s.last) { s.last = s.p; s.onProgress(s.p); }
        if (s.p !== s.target) moving = true;
      });
      if (!moving) { pumping = false; return false; }
      return true;
    });
  };
  // reduced: a number → render that value once and hold; 'skip' → do nothing; 'live' → keep updating
  const scene = (el, { measure, smooth = 0, reduced = 'skip', onProgress } = {}) => {
    if (!el || !measure || !onProgress) return null;
    const s = { el, measure, smooth, reduced, onProgress, p: 0, target: 0, last: -1, near: true };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { s.near = e.isIntersecting; if (s.near) pump(); },
        { rootMargin: '25% 0px 25% 0px' }).observe(el);
    }
    const hold = () => { if (tier === 'reduced' && typeof reduced === 'number') { s.p = s.target = s.last = reduced; onProgress(reduced); } };
    tierFns.add(hold);
    scenes.add(s);
    hold();
    pump();
    return s;
  };
  const progress = {
    // pinned track: 0 when the track's top hits the viewport top, 1 when its bottom hits the viewport bottom
    track: (r, h) => -r.top / Math.max(1, r.height - h),
    // the element's own height scrolled past the viewport top (hero crane)
    leave: (r) => -r.top / Math.max(1, r.height),
    // the element's center travelling from `from`×vh to `to`×vh
    cross: (from, to) => (r, h) => (h * from - (r.top + r.height / 2)) / (h * (from - to)),
  };
  const onScroll = (fn) => { scrollFns.add(fn); fn(window.scrollY, vh, vw); return () => scrollFns.delete(fn); };
  const onResize = (fn) => { resizeFns.add(fn); return () => resizeFns.delete(fn); };
  let resizeTimer = 0;
  window.addEventListener('scroll', pump, { passive: true });
  window.addEventListener('resize', () => {
    vh = window.innerHeight; vw = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeFns.forEach((fn) => fn(vw, vh)); pump(); }, 120);
    pump();
  });

  /* ---------- §7 REVEALS ------------------------------------------------- */
  const splitWords = (el) => {
    if (el.hasAttribute('data-split')) return;
    el.setAttribute('data-split', '');
    const walk = (node) => {
      [...node.childNodes].forEach((ch) => {
        if (ch.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
            const s = document.createElement('span');
            s.className = 'rw';
            s.textContent = w;
            frag.appendChild(s);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === Node.ELEMENT_NODE && ch.tagName !== 'BR') {
          walk(ch);
        }
      });
    };
    walk(el);
  };
  // Lines are measured at reveal time (after fonts), so each visual line settles in sequence.
  const assignLines = (el) => {
    let line = -1, top = null;
    el.querySelectorAll('.rw').forEach((w) => {
      const t = w.offsetTop;
      if (top === null || Math.abs(t - top) > 4) { line++; top = t; }
      w.style.setProperty('--li', line);
      w.style.setProperty('--ar', (line % 2 ? 1.4 : -2.2) + 'deg');
    });
  };
  const showReveal = (el) => {
    if (el.classList.contains('is-in')) return;
    if (el.dataset.reveal === 'lines') assignLines(el);
    el.classList.add('is-in');
  };
  const bindReveals = (scope = document) => {
    const els = [...scope.querySelectorAll('[data-reveal]:not([data-reveal-bound])')];
    const groups = new Map();
    els.forEach((el) => {
      el.setAttribute('data-reveal-bound', '');
      if (el.dataset.reveal === 'lines') splitWords(el);
      const key = el.closest('[data-reveal-group]') || el.parentElement;
      const idx = groups.get(key) || 0;
      groups.set(key, idx + 1);
      const extra = parseFloat(el.dataset.revealDelay || 0);
      el.style.setProperty('--reveal-delay', Math.round(idx * tokens.stagger.block + extra) + 'ms');
      if (el.dataset.reveal === 'align') el.style.setProperty('--ar', (idx % 2 ? 1.4 : -2.2) + 'deg');
    });
    if (tier === 'reduced' || !('IntersectionObserver' in window)) { els.forEach(showReveal); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { showReveal(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
    tierFns.add((t) => { if (t === 'reduced') els.forEach(showReveal); });
  };

  /* ---------- §8 LOOPS --------------------------------------------------- */
  const bindLoops = () => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.target.classList.toggle('is-paused', !e.isIntersecting));
    });
    document.querySelectorAll('[data-loop]').forEach((el) => io.observe(el));
    document.addEventListener('visibilitychange', () => root.classList.toggle('is-tab-hidden', document.hidden));
  };

  /* ---------- §9 NAVIGATION ---------------------------------------------- */
  let cutEl = null;
  const ensureCut = () => {
    if (cutEl) return cutEl;
    cutEl = document.createElement('div');
    cutEl.className = 'cut';
    cutEl.setAttribute('aria-hidden', 'true');
    cutEl.innerHTML = '<span class="cut__panel cut__panel--l"></span><span class="cut__panel cut__panel--r"></span><span class="cut__label mono"></span>';
    document.body.appendChild(cutEl);
    return cutEl;
  };
  const labelFor = (target) => {
    const sec = target.closest('section, footer') || target;
    const eb = sec.querySelector('.eyebrow, .onair, .hero__kicker');
    if (!eb) return '';
    const all = eb.textContent.replace(/\s+/g, ' ').trim();
    const lead = eb.querySelector('span') ? eb.querySelector('span').textContent.trim() : '';
    return lead && all.startsWith(lead) ? `${lead} — ${all.slice(lead.length).trim()}` : all;
  };
  const focusTarget = (target) => {
    const h = target.matches('h1, h2, h3') ? target : target.querySelector('h1, h2, h3') || target;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  };
  const yOf = (el) => {
    const pad = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    return Math.max(0, el.getBoundingClientRect().top + window.scrollY - pad);
  };
  const jump = (y) => { window.scrollTo({ top: y, behavior: 'auto' }); pump(); };
  let navigating = false;
  const navigate = (target, { onDone } = {}) => {
    if (!target || navigating) return;
    const y = yOf(target);
    const dist = Math.abs(y - window.scrollY);
    const end = () => { navigating = false; focusTarget(target); if (onDone) onDone(); };
    navigating = true;
    if (tier === 'reduced' || dist < 4) { jump(y); end(); return; }
    if (dist > vh * 1.5) {
      // CUT: a midline wipe. Gliding thousands of pixels through pinned, scrubbed scenes is slow
      // and nauseating; a cut is faster, calmer and on-brand.
      const c = ensureCut();
      c.querySelector('.cut__label').textContent = labelFor(target);
      c.classList.remove('is-open');
      void c.offsetWidth;
      c.classList.add('is-closed');
      const close = tokens.d.measured * 0.65, hold = 140;
      setTimeout(() => {
        jump(yOf(target));
        c.classList.add('is-open');
        setTimeout(() => { c.classList.remove('is-closed', 'is-open'); end(); }, tokens.d.measured + 60);
      }, close + hold);
      return;
    }
    // GLIDE: short distances ease with the settle curve
    const from = window.scrollY;
    tween({
      from, to: y, ease: 'settle',
      duration: clamp((dist / vh) * 520, 380, 820),
      onUpdate: (v) => window.scrollTo(0, v),
      onComplete: end,
    });
  };
  const bindAnchors = () => {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (a.matches('.skip, [data-consult-open], [data-no-cut]')) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (history.pushState) history.pushState(null, '', id);
      navigate(target);
    });
  };

  /* ---------- §10 TOGGLE ------------------------------------------------- */
  const toggles = new Set();
  function syncToggles() {
    toggles.forEach((b) => b.setAttribute('aria-pressed', String(tier === 'reduced')));
  }
  const bindToggles = () => {
    document.querySelectorAll('[data-motion-toggle]').forEach((b) => {
      toggles.add(b);
      b.addEventListener('click', () => { setPref(tier === 'reduced' ? 'full' : 'reduced'); applyTier(); });
    });
    syncToggles();
  };

  /* ---------- Boot -------------------------------------------------------- */
  const boot = () => { bindReveals(); bindLoops(); bindAnchors(); bindToggles(); pump(); root.classList.add('motion-ready'); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  window.OMMotion = {
    get tier() { return tier; },
    get reduced() { return tier === 'reduced'; },
    get full() { return tier === 'full'; },
    tokens, ease: tokens.ease, bezier,
    add, tween, scene, progress, onScroll, onResize, refresh: pump,
    onTier: (fn) => { tierFns.add(fn); return () => tierFns.delete(fn); },
    navigate, bindReveals, clamp, lerp,
  };
})();
