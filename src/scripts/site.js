/* ==========================================================================
   Site-wide behaviour (every page): scene-aware nav, nav hide/show, menu,
   section + CTA + FAQ tracking, attribution capture. Motion comes from the kernel.
   ========================================================================== */
import M from './motion/kernel.js';
import { root, $, $$ } from './lib/dom.js';
import { track } from './lib/track.js';
import { setInert, trapTab } from './lib/overlay.js';

function init() {
  const body = document.body;
  const nav = $('[data-nav]');
  const scenes = $$('[data-scene]').filter((el) => el !== body);
  let lastY = window.scrollY;

  // Scene-aware nav (logo + colours follow the section under it) and hide-on-scroll-down.
  M.onScroll((y, vh) => {
    for (const s of scenes) {
      const r = s.getBoundingClientRect();
      if (r.top <= 36 && r.bottom > 36) { if (body.dataset.scene !== s.dataset.scene) body.dataset.scene = s.dataset.scene; break; }
    }
    if (nav && !root.classList.contains('menu-open')) {
      if (y > vh * 0.6 && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4 || y < vh * 0.6) nav.classList.remove('is-hidden');
    }
    lastY = y;
  });

  // Which sections people actually reach (one event per section per page view).
  const seen = new Set();
  const acts = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !seen.has(e.target.id)) { seen.add(e.target.id); track('scroll_act', { act: e.target.id, page: location.pathname }); }
    });
  }, { threshold: 0.25 });
  $$('main section[id]').forEach((s) => acts.observe(s));
  $$('[data-cta]').forEach((el) => el.addEventListener('click', () => track('cta_click', { location: el.dataset.cta, page: location.pathname })));

/* ======================================================================
     §7 FAQ
     ====================================================================== */
  $$('.faq details').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() });
  }));

  
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

  
  // Attribution: first-touch UTM / click IDs for the consultation payload (session only).
  try {
    const q = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    if (keys.some((k) => q.has(k)) || !sessionStorage.getItem('om-attribution')) {
      const data = { landing_page: location.pathname, referrer: document.referrer || '' };
      keys.forEach((k) => { if (q.get(k)) data[k] = q.get(k); });
      sessionStorage.setItem('om-attribution', JSON.stringify(data));
    }
  } catch { /* storage unavailable */ }

  root.classList.add('scenes-ready');
}

init();
