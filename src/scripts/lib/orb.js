import M from '../motion/kernel.js';

// The Orb's smile: t = 0 closed (zero-area band) → 1 the logo's crescent.
export const smileD = (t) => {
  const cy = (49.6 + 7.1 * t).toFixed(2);
  const ry = (38.4 + 17.9 * t).toFixed(2);
  return `M0 49.6A62 38.4 0 0 0 124 49.6L124 ${cy}A62 ${ry} 0 0 1 0 ${cy}Z`;
};
export const animateSmile = (path, dur = 700, delay = 0) => new Promise((resolve) => {
  if (!path) return resolve();
  M.tween({ duration: dur, delay, ease: 'force', onUpdate: (v) => path.setAttribute('d', smileD(v)), onComplete: resolve });
});
