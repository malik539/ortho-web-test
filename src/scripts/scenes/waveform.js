/* Ortho Marketing Live — the waveform and episode tracking. */
import { $, $$, seeded } from '../lib/dom.js';
import { track } from '../lib/track.js';

function init() {
/* ======================================================================
     §6 ACT V — WAVEFORM + episode tracking
     ====================================================================== */
  const wave = $('[data-wave]');
  if (wave) {
    const rand = seeded(23);
    const bars = window.innerWidth < 768 ? 48 : 112;
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
}

init();
