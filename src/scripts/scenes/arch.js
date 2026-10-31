/* Finale — Debond: the wire settles into an arch; fourteen brackets engage. */
import M from '../motion/kernel.js';
import { $, seeded } from '../lib/dom.js';

function init() {
  const easeSettle = (t) => M.ease.settle(t);
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
    const make = (tag, attrs) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      return el;
    };
    widths.forEach((w, i) => {
      const f = 0.03 + (i / (widths.length - 1)) * 0.94;
      const pt = archWire.getPointAtLength(f * archLen);
      const pt2 = archWire.getPointAtLength(Math.min(archLen, f * archLen + 1));
      const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
      // A bracket glyph: base pad, the wire seated in the slot, four tie-wings (steel, lit from above).
      const at = make('g', { transform: `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})` });
      const rect = make('g', { class: 'bk' });
      const hw = w / 2, gx = Math.max(2, w * 0.09);
      rect.appendChild(make('rect', { class: 'bk__pad', x: -hw * 1.1, y: -10, width: hw * 2.2, height: 20, rx: 3 }));
      rect.appendChild(make('rect', { class: 'bk__slot', x: -hw * 1.1, y: -0.9, width: hw * 2.2, height: 1.8 }));
      [[-hw, -gx, -8.5], [gx, hw, -8.5], [-hw, -gx, 2.2], [gx, hw, 2.2]].forEach(([x0, x1, y]) => {
        rect.appendChild(make('rect', { class: 'bk__wing', x: x0.toFixed(1), y, width: (x1 - x0).toFixed(1), height: 6.3, rx: 1.2 }));
      });
      at.appendChild(rect);
      const crooked = (rand() - 0.5) * 50;
      rect.style.transform = M.reduced ? `rotate(${angle}deg)` : `rotate(${angle + crooked}deg) scale(.4)`;
      rect.style.opacity = M.reduced ? 1 : 0;
      archGroup.appendChild(at);
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
}

init();
