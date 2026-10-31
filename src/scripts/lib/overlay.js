// Shared overlay helpers: inert background + focus trap (menu, consultation).
import { $, $$ } from './dom.js';

const backgroundEls = () => [$('#main'), $('[data-nav]'), $('.credits'), $('.hud'), $('[data-consent]')].filter(Boolean);
export const setInert = (on) => backgroundEls().forEach((el) => { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
export const focusables = (el) => $$('a[href], button:not([disabled]):not([hidden]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', el)
  .filter((n) => n.offsetParent !== null || n === document.activeElement);
export const trapTab = (container) => (e) => {
  if (e.key !== 'Tab') return;
  const f = focusables(container);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
};

