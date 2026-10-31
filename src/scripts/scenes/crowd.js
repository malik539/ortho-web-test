/* Act I — Crowding: a pinned, smoothed scroll scene. */
import M from '../motion/kernel.js';
import { $, $$, clamp, lerp, range, seeded, fontsReady } from '../lib/dom.js';

function init() {
  const easeForce = (t) => M.ease.force(t);
  const easeSettle = (t) => M.ease.settle(t);
  let vw = window.innerWidth, vh = window.innerHeight;
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
    // Start crowded, not illegible: each claim tries a few spots in the cluster and keeps the one it
    // overlaps least, so the market reads as noise without words being cut in half.
    const spanX = Math.min(vw * (narrow ? 0.62 : 0.5), 700), spanY = vh * (narrow ? 0.26 : 0.3);
    const placed = [];
    const overlap = (x, y, w, h) => placed.reduce((sum, q) => {
      const ox = Math.max(0, Math.min(x + w / 2, q.x + q.w / 2) - Math.max(x - w / 2, q.x - q.w / 2));
      const oy = Math.max(0, Math.min(y + h / 2, q.y + q.h / 2) - Math.max(y - h / 2, q.y - q.h / 2));
      return sum + ox * oy;
    }, 0);
    claims.forEach((c, i) => {
      const w = c.el.offsetWidth;
      const h = c.el.offsetHeight;
      let best = null;
      for (let k = 0; k < 24; k++) {
        const x = (rand() - 0.5) * (spanX - w * 0.5), y = (rand() - 0.5) * spanY;
        const o = overlap(x, y, w, h) / (w * h);
        if (!best || o < best.o) best = { x, y, o };
        if (o < 0.12) break;
      }
      placed.push({ x: best.x, y: best.y, w, h });
      c.sx = best.x;
      c.sy = best.y;
      c.sr = (rand() - 0.5) * 22;
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
  M.onResize((w, h) => { vw = w; vh = h; setupCrowd(); });
  fontsReady.then(() => { setupCrowd(); M.refresh(); });
}

init();
