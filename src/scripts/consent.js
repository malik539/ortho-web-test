/* Consent-gated Google Tag Manager. Rendered only when PUBLIC_GTM_ID is set at build time.
   Choice persists in localStorage ("granted" | "denied"); nothing loads before "Accept". */
const bar = document.querySelector('[data-consent]');
const KEY = 'om-consent';
const get = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
const set = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* storage unavailable */ } };

function loadGtm(id) {
  if (!id || window.__omGtm) return;
  window.__omGtm = true;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

if (bar) {
  const id = bar.dataset.gtm;
  const choice = get();
  if (choice === 'granted') loadGtm(id);
  else if (choice !== 'denied') bar.hidden = false;
  bar.querySelector('[data-consent-accept]').addEventListener('click', () => { set('granted'); bar.hidden = true; loadGtm(id); });
  bar.querySelector('[data-consent-decline]').addEventListener('click', () => {
    const wasLoaded = window.__omGtm;
    set('denied'); bar.hidden = true;
    if (wasLoaded) location.reload();   // a loaded tag manager can't be unloaded: start clean
  });
  // "Cookie preferences" in the footer reopens the choice at any time.
  document.querySelectorAll('[data-consent-open]').forEach((btn) => btn.addEventListener('click', () => {
    bar.hidden = false;
    bar.querySelector(get() === 'granted' ? '[data-consent-decline]' : '[data-consent-accept]').focus();
  }));
}
