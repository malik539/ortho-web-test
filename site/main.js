/* ==========================================================================
   ORTHO MARKETING — "LIGHT, CONTINUOUS FORCE"
   Page scenes for the prototype. Vanilla JS, no dependencies.
   All timing, curves, tiers, the clock, scroll scenes, reveals and in-page
   navigation come from the motion kernel (motion.js → window.OMMotion).

   §0  Utilities + analytics          §8  Debond arch
   §1  Loader (the Orb)               §9  First-visit steps
   §2  Cold open + hero arch          §10 Reveals (kernel)
   §3  Crowding scrub                 §11 HUD, scene-aware nav, scroll spy
   §4  Treatment rail                 §12 Menu
   §5  Before/after + radiograph      §13 Consultation overlay
   §6  Waveform                       §14 Director's notes
   §7  FAQ                            §15 Wiring
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
  const M = window.OMMotion;            // motion kernel: tokens, tiers, clock, scenes
  if (!M) { root.classList.add('motion-failed'); return; }   // kernel missing: show everything, run nothing
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const range = (v, a, b) => clamp((v - a) / (b - a));
  const easeForce = (t) => M.ease.force(t);    // exact token curves, shared with CSS
  const easeSettle = (t) => M.ease.settle(t);
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
    M.tween({ duration: dur, delay, ease: 'force', onUpdate: (v) => path.setAttribute('d', smileD(v)), onComplete: resolve });
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

  /* ======================================================================
     §2b HERO ARCH — "Shape Memory"
     A nickel-titanium archwire of light, drawn in true perspective on
     Canvas 2D (no libraries, ~5KB gzipped). It enters crowded and deformed, then
     springs back to its ideal arch form — anterior first, the way real
     alignment happens. The cursor is the operatory light; brackets near it
     yield to light pressure and spring back (shape memory). Scroll cranes
     the camera up and over the arch. Rendering is on demand: it stops when
     the arch is at rest or the hero is off-screen.
     ====================================================================== */
  const heroArch = (() => {
    const canvas = $('[data-hero-arch]');
    if (!canvas || !canvas.getContext) return null;
    const ctx = canvas.getContext('2d');
    const DEG = Math.PI / 180;
    const hasFilter = 'filter' in ctx;
    const v3 = (x, y, z) => ({ x, y, z });
    const norm = (a) => { const l = Math.hypot(a.x, a.y, a.z) || 1; return v3(a.x / l, a.y / l, a.z / l); };
    const cross = (a, b) => v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
    const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;

    // ---- Ideal arch form (ovoid). Right half in world units; apex at the origin, arms recede into −z.
    const CTRL = [[0, 0], [1.55, -0.3], [2.65, -1.45], [3.25, -3.3], [3.55, -5.6], [3.62, -6.4]];
    const pts = [...CTRL.slice(1).reverse().map(([x, z]) => [-x, z]), ...CTRL];
    const crm = (p0, p1, p2, p3, t) => {
      const t2 = t * t, t3 = t2 * t;
      return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    };
    const curve = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let k = 0; k < 24; k++) {
        const t = k / 24;
        curve.push({ x: crm(p0[0], p1[0], p2[0], p3[0], t), z: crm(p0[1], p1[1], p2[1], p3[1], t) });
      }
    }
    curve.push({ x: pts[pts.length - 1][0], z: pts[pts.length - 1][1] });
    let L = 0;
    curve.forEach((p, i) => { if (i) L += Math.hypot(p.x - curve[i - 1].x, p.z - curve[i - 1].z); p.len = L; });
    const mid = L / 2;
    const at = (len) => {
      len = clamp(len, 0, L);
      let lo = 0, hi = curve.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (curve[m].len < len) lo = m; else hi = m; }
      const a = curve[lo], b = curve[hi];
      const t = (len - a.len) / ((b.len - a.len) || 1);
      const tx = b.x - a.x, tz = b.z - a.z, tl = Math.hypot(tx, tz) || 1;
      return { x: lerp(a.x, b.x, t), z: lerp(a.z, b.z, t), tx: tx / tl, tz: tz / tl };
    };

    // ---- Fourteen brackets placed by real upper-arch tooth widths (mm), midline outward.
    const TEETH = [8.5, 6.5, 7.5, 7.0, 6.5, 10.0, 9.0];
    const unit = (mid * 0.9) / TEETH.reduce((a, b) => a + b, 0);
    const brackets = [];
    const rand = seeded(19);
    [-1, 1].forEach((side) => {
      let acc = 0;
      TEETH.forEach((w, rank) => {
        const c = (acc + w / 2) * unit; acc += w;
        const k = rank < 3 ? 1 : 0.55; // anterior crowding is the worst
        brackets.push({
          side, rank, len: mid + side * c, w: w * unit * 0.32, h: rank < 3 ? 0.17 : 0.15,
          dn: (rand() - 0.5) * 0.9 * k, dy: (rand() - 0.5) * 0.3 * k, dt: (rand() - 0.5) * 0.16,
          rot: (rand() - 0.5) * 70 * k * DEG, tip: (rand() - 0.5) * 30 * k * DEG,
          a: M.reduced ? 1 : 0, e: 0, ev: 0, er: 0, erv: 0, prox: 0, sp: null,
        });
      });
    });

    // ---- Camera: orbits a target; the composition is solved from two targets (apex height, arm spread).
    const cam = { yaw: 0, tyaw: 0, pitch: 0, tpitch: 0, base: 22 * DEG, dist: 17, crane: 0 };  // long lens: jewel-like, low distortion
    const target = v3(0, 0, -2.6);
    let W = 1, H = 1, dpr = 1, F = 1000, cx = 0, cy = 0, C = v3(0, 0, 9), R = v3(1, 0, 0), U = v3(0, 1, 0), FW = v3(0, 0, -1);
    const basis = () => {
      const pitch = cam.base + cam.pitch + cam.crane * 36 * DEG;
      const dist = cam.dist + cam.crane * 2.2;
      C = v3(target.x + dist * Math.sin(cam.yaw) * Math.cos(pitch), target.y + dist * Math.sin(pitch), target.z + dist * Math.cos(cam.yaw) * Math.cos(pitch));
      FW = norm(v3(target.x - C.x, target.y - C.y, target.z - C.z));
      R = norm(cross(FW, v3(0, 1, 0)));
      U = cross(R, FW);
    };
    const project = (x, y, z) => {
      const d = v3(x - C.x, y - C.y, z - C.z);
      const Z = dot(d, FW);
      return { x: cx + (F * dot(d, R)) / Z, y: cy - (F * dot(d, U)) / Z, z: Z };
    };
    // Composition solver. Landscape: the arms rise beside the copy (the cradle) and the apex stays
    // below the CTA block. Portrait: the copy spans the width, so pick the steepest camera whose
    // arch still sits entirely below the copy.
    const contentEl = $('[data-hero-content]');
    const fit = (pitchDeg, apexY, spreadFrac) => {
      cam.base = pitchDeg * DEG; basis();
      F = 1; cx = 0; cy = 0;
      let spread = 0;
      for (let i = 0; i < curve.length; i += 4) { const q = project(curve[i].x, 0, curve[i].z); spread = Math.max(spread, Math.abs(q.x)); }
      F = (spreadFrac * W) / spread;
      cx = W / 2;
      cy = apexY - project(0, 0, 0).y;
      let top = Infinity;
      for (let i = 0; i < curve.length; i += 4) top = Math.min(top, project(curve[i].x, 0.2, curve[i].z).y);
      return top;
    };
    const layout = () => {
      const r = canvas.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, M.full ? 2 : 1.5);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      const k = clamp((W / H - 0.5) / (1.7 - 0.5));     // 0 = tall phone, 1 = wide desktop
      const keep = { yaw: cam.yaw, pitch: cam.pitch, crane: cam.crane };
      cam.yaw = 0; cam.pitch = 0; cam.crane = 0;
      let contentBottom = 0;
      if (contentEl) contentBottom = contentEl.getBoundingClientRect().bottom - r.top;
      if (W / H < 1) {
        const apexY = 0.955 * H, floor = contentBottom + 22;
        let chosen = 14;
        for (let pd = 46; pd >= 14; pd -= 2) { if (fit(pd, apexY, 0.46) >= floor) { chosen = pd; break; } }
        fit(chosen, apexY, 0.46);
      } else {
        const apexY = clamp(Math.max(lerp(0.9, 0.88, k) * H, contentBottom + 0.07 * H), 0, 0.975 * H);
        fit(lerp(30, 21, k), apexY, lerp(0.46, 0.44, k));
      }
      cam.yaw = keep.yaw; cam.pitch = keep.pitch; cam.crane = keep.crane;
    };

    // ---- State shared with the page
    const light = { x: 0.64, y: 0.32 };
    let charge = 0, chargeT = 0, pulseAt = -1e9, startAt = null, raf = 0, visible = true, pointer = null;

    const geometry = (now) => {
      brackets.forEach((b) => {
        if (!M.reduced) b.a = startAt === null ? 0 : easeForce(clamp((now - startAt - HOLD - b.rank * 130) / 1700));
        const m = 1 - b.a;
        const base = at(b.len + b.dt * m);
        const N = v3(-base.tz, 0, base.tx);                 // labial (outward) normal
        const T = v3(base.tx, 0, base.tz);
        const dn = b.dn * m + b.e;
        b.D = v3(N.x * dn, b.dy * m, N.z * dn);
        b.P = v3(base.x + b.D.x, b.D.y, base.z + b.D.z);
        const rot = b.rot * m + b.er, tip = b.tip * m;
        const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tip), st = Math.sin(tip);
        const t2 = v3(T.x * cr - N.x * sr, 0, T.z * cr - N.z * sr);
        b.N = v3(N.x * cr + T.x * sr, 0, N.z * cr + T.z * sr);
        b.T = v3(t2.x * ct, st, t2.z * ct);
        b.Up = v3(-t2.x * st, ct, -t2.z * st);
      });
    };
    const HOLD = 280; // let the crowded frame register before the wire remembers its shape
    const SAMPLES = 220;
    const wire = new Array(SAMPLES);
    const sigma = (mid * 0.9) / 7 * 0.55;
    const wirePoints = () => {
      for (let i = 0; i < SAMPLES; i++) {
        const len = (i / (SAMPLES - 1)) * L;
        const p = at(len);
        let dx = 0, dy = 0, dz = 0;
        for (const b of brackets) {
          const w = Math.exp(-(((len - b.len) / sigma) ** 2));
          if (w < 0.003) continue;
          dx += b.D.x * w; dy += b.D.y * w; dz += b.D.z * w;
        }
        wire[i] = { x: p.x + dx, y: dy, z: p.z + dz, d: Math.abs(len - mid) };
      }
    };

    const strokeWire = (P, alpha, fog, now, lit) => {
      const lx = light.x * W, ly = light.y * H;
      const front = startAt === null || M.reduced ? -9 : clamp((now - startAt - HOLD) / 2300) * (mid + 0.6);
      const hp = (now - pulseAt) / 1000;
      ctx.lineCap = 'butt';   // butt caps: no additive 'beads' where segments meet
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < P.length; i++) {
          const a = P[i - 1], b = P[i];
          if (a.z < 0.2 || b.z < 0.2) continue;
          const z = (a.z + b.z) / 2, d = wire[i].d;
          let g = 0;
          if (lit) {
            g += Math.exp(-((Math.hypot((a.x + b.x) / 2 - lx, (a.y + b.y) / 2 - ly) / 230) ** 2)) * 0.75;
            if (front > -1 && front < mid + 0.6) g += Math.exp(-(((d - front) / 0.35) ** 2)) * 1.3;   // the heat front
            if (hp >= 0 && hp < 1) g += Math.exp(-(((d - hp * (mid + 0.6)) / 0.45) ** 2)) * 1.0;    // CTA pulse
            g += charge * 0.5;
          }
          const f = fog(z) * alpha;
          if (pass === 0) {
            ctx.strokeStyle = `rgba(115,123,255,${((0.14 + g * 0.2) * f).toFixed(3)})`;
            ctx.lineWidth = clamp((F * 0.045) / z, 2, 14);
          } else {
            const w = clamp(0.3 + g * 0.6);
            ctx.strokeStyle = `rgba(${Math.round(lerp(115, 255, w))},${Math.round(lerp(123, 255, w))},255,${f.toFixed(3)})`;
            ctx.lineWidth = clamp((F * 0.011) / z, 0.8, 3);
          }
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    };

    const drawBracket = (b, p, fog, zmin, zmax) => {
      const out = 0.035, hw = b.w / 2, hh = b.h / 2;
      const corner = (sx, sy) => project(
        b.P.x + b.N.x * out + b.T.x * sx + b.Up.x * sy,
        b.P.y + b.N.y * out + b.T.y * sx + b.Up.y * sy,
        b.P.z + b.N.z * out + b.T.z * sx + b.Up.z * sy
      );
      const q = [corner(-hw, hh), corner(hw, hh), corner(hw, -hh), corner(-hw, -hh)];
      if (q.some((v) => v.z < 0.2)) return;
      const toCam = norm(v3(C.x - b.P.x, C.y - b.P.y, C.z - b.P.z));
      const facing = dot(b.N, toCam);
      const key = Math.max(0, b.N.z * 0.7 + 0.3);
      const spec = Math.exp(-((Math.hypot(p.x - light.x * W, p.y - light.y * H) / 190) ** 2));
      const lum = facing > 0 ? clamp(0.24 + key * 0.3 + spec * 0.42 + charge * 0.12) : 0.12;
      const f = fog(p.z);
      const tone = (l, a) => `rgba(${Math.round(l * 228)},${Math.round(l * 233)},${Math.round(Math.min(1, l * 1.05) * 250)},${a})`;
      if (hasFilter) {
        const depth = (p.z - zmin) / ((zmax - zmin) || 1);
        ctx.filter = depth > 0.55 ? `blur(${((depth - 0.55) * 3.2).toFixed(2)}px)` : 'none';
      }
      const quad = (pts, fill) => {
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      };
      const box = (x0, x1, y0, y1) => [corner(x0, y1), corner(x1, y1), corner(x1, y0), corner(x0, y0)];
      // base pad (mesh), slightly larger and darker
      quad(box(-hw * 1.08, hw * 1.08, -hh * 1.12, hh * 1.12), tone(lum * 0.42, f));
      if (facing <= 0) { if (hasFilter) ctx.filter = 'none'; return; }
      // four tie-wings: vertical channel gx, archwire slot gy
      const gx = hw * 0.16, gy = hh * 0.2;
      const wings = [[-hw, -gx, gy, hh], [gx, hw, gy, hh], [-hw, -gx, -hh, -gy], [gx, hw, -hh, -gy]];
      wings.forEach(([x0, x1, y0, y1], i) => {
        const pts = box(x0, x1, y0, y1);
        const upper = i < 2;
        const g = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[3].x, pts[3].y);
        g.addColorStop(0, tone(clamp(lum + (upper ? 0.34 : 0.12)), f));
        g.addColorStop(1, tone(lum * (upper ? 0.8 : 0.55), f));
        quad(pts, g);
      });
      // overhead light catches the top edge of the upper wings
      const e0 = corner(-hw, hh), e1 = corner(hw, hh);
      ctx.strokeStyle = `rgba(255,255,255,${((0.3 + spec * 0.55) * f).toFixed(3)})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(e0.x, e0.y); ctx.lineTo(e1.x, e1.y); ctx.stroke();
      if (hasFilter) ctx.filter = 'none';
    };

    const draw = (now) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      basis(); geometry(now); wirePoints();
      const P = wire.map((p) => project(p.x, p.y, p.z));
      let zmin = Infinity, zmax = -Infinity;
      P.forEach((p) => { if (p.z < zmin) zmin = p.z; if (p.z > zmax) zmax = p.z; });
      const fog = (z) => clamp(1.12 - ((z - zmin) / ((zmax - zmin) || 1)) * 0.62, 0.3, 1);
      // 1 · reflection on the black glass floor
      ctx.globalCompositeOperation = 'lighter';
      strokeWire(wire.map((p) => project(p.x, -p.y - 0.03, p.z)), 0.12, fog, now, false);
      // 2 · brackets, far → near
      ctx.globalCompositeOperation = 'source-over';
      brackets.map((b) => ({ b, p: project(b.P.x, b.P.y, b.P.z) }))
        .sort((u, v) => v.p.z - u.p.z)
        .forEach(({ b, p }) => { b.sp = p; drawBracket(b, p, fog, zmin, zmax); });
      // 3 · the wire on top, seated in the slots
      ctx.globalCompositeOperation = 'lighter';
      strokeWire(P, 1, fog, now, true);
      ctx.globalCompositeOperation = 'source-over';
    };

    const tick = (now) => {
      let active = false;
      brackets.forEach((b) => {
        const te = -0.26 * b.prox, tr = 0.32 * b.prox * b.side;
        b.ev = (b.ev + (te - b.e) * 0.085) * 0.8; b.e += b.ev;
        b.erv = (b.erv + (tr - b.er) * 0.085) * 0.8; b.er += b.erv;
        if (Math.abs(b.ev) + Math.abs(te - b.e) + Math.abs(b.erv) + Math.abs(tr - b.er) > 0.0008) active = true;
      });
      cam.yaw = lerp(cam.yaw, cam.tyaw, 0.06);
      cam.pitch = lerp(cam.pitch, cam.tpitch, 0.06);
      if (Math.abs(cam.yaw - cam.tyaw) + Math.abs(cam.pitch - cam.tpitch) > 0.0002) active = true;
      charge = lerp(charge, chargeT, 0.08);
      if (Math.abs(charge - chargeT) > 0.002) active = true;
      if (now - pulseAt < 1000) active = true;
      if (startAt !== null && now - startAt < 3000) active = true;
      draw(now);
      return active && visible;
    };
    // The arch subscribes to the site clock only while something is moving.
    const request = () => {
      if (raf || !visible) return;
      raf = 1;
      M.add((now) => { const keep = tick(now); if (!keep) raf = 0; return keep; });
    };

    const api = {
      start() { if (startAt === null) { startAt = performance.now(); request(); } },
      settle() { brackets.forEach((b) => { b.a = 1; b.e = b.ev = b.er = b.erv = b.prox = 0; }); cam.crane = cam.tyaw = cam.tpitch = 0; request(); },
      resize() { layout(); request(); },
      setLight(x, y) { if (Math.abs(x - light.x) + Math.abs(y - light.y) > 0.001) { light.x = x; light.y = y; request(); } },
      setView(nx, ny) { if (M.reduced) return; cam.tyaw = (nx - 0.5) * 0.1; cam.tpitch = (ny - 0.5) * 0.045; request(); },
      setCrane(p) { if (M.reduced) return; if (Math.abs(p - cam.crane) > 0.0005) { cam.crane = p; request(); } },
      setPointer(x, y) {
        if (M.reduced) return;
        pointer = x === null ? null : { x, y };
        brackets.forEach((b) => {
          b.prox = pointer && b.sp ? Math.pow(Math.max(0, 1 - Math.hypot(b.sp.x - pointer.x, b.sp.y - pointer.y) / 150), 2) : 0;
        });
        request();
      },
      charge(on) { chargeT = on ? 1 : 0; if (on && !M.reduced) pulseAt = performance.now(); request(); },
      setVisible(v) { visible = v; if (v) request(); },
    };
    layout();
    request();
    return api;
  })();

  if (heroArch) M.onTier((t) => { if (t === 'reduced') heroArch.settle(); else heroArch.resize(); });

  // Glyphs align in a wave from the center outward — the same wave as the arch.
  const waveGlyphs = () => {
    if (!title) return;
    const r = title.getBoundingClientRect();
    const mid = r.left + r.width / 2, half = r.width / 2 || 1;
    title.querySelectorAll('.ch').forEach((s) => {
      const g = s.getBoundingClientRect();
      s.style.transitionDelay = Math.round(260 + (Math.abs(g.left + g.width / 2 - mid) / half) * 760) + 'ms';
    });
  };

  let coldOpenStarted = false;
  const startColdOpen = () => {
    if (coldOpenStarted) return;
    coldOpenStarted = true;
    waveGlyphs();
    root.classList.add('is-lit');
    setTimeout(() => {
      root.classList.add('is-aligned');
      if (heroArch) heroArch.start();
    }, M.reduced ? 0 : 150);
  };

  // The primary CTA "charges" the arch: intent sends a pulse down the wire.
  $$('[data-hero-cta]').forEach((el) => {
    ['pointerenter', 'focus'].forEach((ev) => el.addEventListener(ev, () => heroArch && heroArch.charge(true)));
    ['pointerleave', 'blur'].forEach((ev) => el.addEventListener(ev, () => heroArch && heroArch.charge(false)));
  });

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
    const dx = tx - vw / 2;
    const dy = ty - vh / 2;
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

  /* ---------- Operatory light: desktop pointer only, damped, on the shared clock ---- */
  const light = { x: 64, y: 32, tx: 64, ty: 32 };
  let heroVisible = true, lightRunning = false;
  const stepLight = () => {
    light.x = lerp(light.x, light.tx, 0.06);
    light.y = lerp(light.y, light.ty, 0.06);
    hero.style.setProperty('--lx', light.x.toFixed(2) + '%');
    hero.style.setProperty('--ly', light.y.toFixed(2) + '%');
    if (heroArch) heroArch.setLight(light.x / 100, light.y / 100);
    if (Math.abs(light.tx - light.x) + Math.abs(light.ty - light.y) < 0.05 || !heroVisible) lightRunning = false;
    return lightRunning;
  };
  if (hero && finePointer) {
    hero.addEventListener('pointermove', (e) => {
      if (M.reduced) return;
      const r = hero.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width, ny = (e.clientY - r.top) / r.height;
      light.tx = nx * 100;
      light.ty = ny * 100;
      if (heroArch) { heroArch.setView(nx, ny); heroArch.setPointer(e.clientX - r.left, e.clientY - r.top); }
      if (!lightRunning) { lightRunning = true; M.add(stepLight); }
    });
    hero.addEventListener('pointerleave', () => { if (heroArch) { heroArch.setView(0.5, 0.5); heroArch.setPointer(null); } });
  }

  // Scroll: the camera cranes up and over the arch while the copy lifts away (scene, smoothed).
  const heroContent = $('[data-hero-content]');
  if (hero) {
    M.scene(hero, {
      measure: M.progress.leave, smooth: 0.2, reduced: 0,
      onProgress: (p) => {
        if (heroArch) heroArch.setCrane(easeSettle(p));
        if (!heroContent) return;
        heroContent.style.transform = p ? `translate3d(0, ${(-p * 70).toFixed(1)}px, 0)` : '';
        heroContent.style.opacity = p ? (1 - clamp((p - 0.15) / 0.55)).toFixed(3) : '';
      },
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
    if (!M.reduced) renderCrowd(crowdP);
  };

  let crowdP = 0;
  const renderCrowd = (p) => {
    crowdP = p;
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
  // Pinned scene (sticky 300vh desktop, 220vh lite). Smoothing turns wheel steps into steady force.
  if (crowd) M.scene(crowd, { measure: M.progress.track, smooth: 0.16, reduced: 'skip', onProgress: renderCrowd });

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
    archWire.style.strokeDashoffset = M.reduced ? 0 : archLen;
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
      rect.style.transform = M.reduced ? `rotate(${angle}deg)` : `rotate(${angle + crooked}deg) scale(.4)`;
      rect.style.opacity = M.reduced ? 1 : 0;
      archGroup.appendChild(rect);
      archBrackets.push({ el: rect, f, angle, crooked, on: false });
    });
  }
  const renderArch = (p) => {
    archWire.style.strokeDashoffset = (archLen * (1 - p)).toFixed(1);
    archBrackets.forEach((b) => {
      const on = p >= b.f - 0.02;
      if (on === b.on) return;
      b.on = on;
      b.el.style.opacity = on ? 1 : 0;
      b.el.style.transform = on ? `rotate(${b.angle}deg)` : `rotate(${b.angle + b.crooked}deg) scale(.4)`;
    });
  };
  if (arch && archWire) {
    M.scene(arch, { measure: M.progress.cross(1.15, 0.55), smooth: 0.14, reduced: 1, onProgress: (p) => renderArch(easeSettle(p)) });
  }

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

  /* ======================================================================
     §10 REVEALS — owned by the kernel ([data-reveal], see motion.js §7)
     ====================================================================== */

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
    root.classList.toggle('hud-on', y > vh * 0.35);   // treatment begins when the visitor scrolls
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
      setTimeout(() => $('.menu__links a', menu).focus(), M.reduced ? 0 : 250);
      track('menu_open');
    };
    const closeMenu = (returnFocus = true) => {
      menu.classList.remove('is-open');
      root.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      setInert(false);
      menu.removeEventListener('keydown', trap);
      setTimeout(() => { menu.hidden = true; }, M.reduced ? 0 : 800);
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
        $('.consult__inner', consult).scrollTo({ top: 0, behavior: M.reduced ? 'auto' : 'smooth' });
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
      await wait(M.reduced ? 0 : 900);
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
      }, M.reduced ? 0 : 450);
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
      }, M.reduced ? 0 : M.tokens.d.measured);
    };

    $$('[data-consult-open]').forEach((el) => el.addEventListener('click', (e) => open(e, el)));
    $$('[data-consult-close]', consult).forEach((el) => el.addEventListener('click', (e) => {
      const href = el.getAttribute('href');
      close();
      if (href && href.startsWith('#')) {
        e.preventDefault();
        setTimeout(() => { const t = $(href); if (t) M.navigate(t); }, M.reduced ? 0 : M.tokens.d.measured + 20);
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
     §15 WIRING — the kernel owns the clock; this file only registers work.
     Nothing here runs per frame unless the visitor scrolls or points.
     ====================================================================== */
  M.onScroll(() => updateHud());
  M.onResize((w, h) => { vw = w; vh = h; if (heroArch) heroArch.resize(); setupCrowd(); });
  if (hero) new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroArch) heroArch.setVisible(e.isIntersecting); }).observe(hero);
  fontsReady.then(() => { if (heroArch) heroArch.resize(); setupCrowd(); M.refresh(); });
  root.classList.add('scenes-ready');
})();
