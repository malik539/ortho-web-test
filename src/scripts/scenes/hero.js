/* Hero — "Shape Memory" (see experience/HERO.md). Glyph alignment, the 3D arch, the operatory
   light, the CTA charge and the scroll crane. */
import M from '../motion/kernel.js';
import { root, $, $$, clamp, lerp, seeded, finePointer, fontsReady } from '../lib/dom.js';

function init() {
  const easeForce = (t) => M.ease.force(t);
  const easeSettle = (t) => M.ease.settle(t);
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
    // Characters are aria-hidden once split, so the heading keeps one readable copy of its text.
    const text = title.textContent.replace(/\s+/g, ' ').trim();
    title.querySelectorAll('.line').forEach(split);
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = text;
    title.appendChild(sr);
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
      // Depth of field as aerial perspective: far brackets fade a little further into the dark.
      // (A canvas blur filter here cost ~2s of main-thread time per entrance on software raster.)
      const depth = (p.z - zmin) / ((zmax - zmin) || 1);
      const f = fog(p.z) * (depth > 0.55 ? 1 - (depth - 0.55) * 0.6 : 1);
      const tone = (l, a) => `rgba(${Math.round(l * 228)},${Math.round(l * 233)},${Math.round(Math.min(1, l * 1.05) * 250)},${a})`;
      const quad = (pts, fill) => {
        ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      };
      const box = (x0, x1, y0, y1) => [corner(x0, y1), corner(x1, y1), corner(x1, y0), corner(x0, y0)];
      // base pad (mesh), slightly larger and darker
      quad(box(-hw * 1.08, hw * 1.08, -hh * 1.12, hh * 1.12), tone(lum * 0.42, f));
      if (facing <= 0) return;
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

  // Wiring: visibility gating, resize, fonts, and the hand-off from the loader.
  if (hero) new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroArch) heroArch.setVisible(e.isIntersecting); }).observe(hero);
  M.onResize(() => { if (heroArch) heroArch.resize(); });
  fontsReady.then(() => { if (heroArch) heroArch.resize(); M.refresh(); });
  if (root.classList.contains('cold-open-go') || !$('[data-loader]')) requestAnimationFrame(startColdOpen);
  else document.addEventListener('om:coldopen', startColdOpen, { once: true });
}

init();
