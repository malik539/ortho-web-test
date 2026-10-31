/* ==========================================================================
   Conversion — the records appointment. Two modes, one form:
   overlay ([data-consult], opened by any [data-consult-open], Orb flood) and
   page ([data-consult-page], the standalone /consultation/ page).
   ========================================================================== */
import M from './motion/kernel.js';
import { root, $, $$, clamp, store } from './lib/dom.js';
import { track } from './lib/track.js';
import { setInert, trapTab } from './lib/overlay.js';
import { animateSmile } from './lib/orb.js';
import { submitRecords } from './lib/submit.js';

function init() {
/* ======================================================================
     §13 CONSULTATION — the records appointment
     ====================================================================== */
  const consult = $('[data-consult]') || $('[data-consult-page]');
  if (!consult) return;
  const page = consult.hasAttribute('data-consult-page');   // standalone /consultation/ page vs. global overlay
  const menu = $('[data-menu]');
  {
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
    const sendError = $('[data-csend-error]', consult);
    const DRAFT = 'om-consult-draft';
    const trap = trapTab(consult);
    let step = 1;
    let trigger = null;
    let source = 'unknown';
    let submitted = false;

    // Bring the top of the form (or the thank-you panel) back into view after it changes height.
    const toTop = () => {
      const behavior = M.reduced ? 'auto' : 'smooth';
      if (!page) { $('.consult__inner', consult).scrollTo({ top: 0, behavior }); return; }
      const top = consult.getBoundingClientRect().top + window.scrollY - 96;
      if (window.scrollY > top) window.scrollTo({ top, behavior });
    };

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
        toTop();
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
      sendError.hidden = true;
      const result = await submitRecords(new FormData(form), source);
      next.removeAttribute('aria-busy');
      if (!result.ok) {
        nextLabel.textContent = 'Request consultation';
        sendError.hidden = false;
        sendError.focus();
        track('consultation_send_error', { reason: result.reason });
        return;
      }
      submitted = true;
      store.del(DRAFT);
      const fd = new FormData(form);
      const first = String(fd.get('name') || '').trim().split(/\s+/)[0];
      $('[data-done-name]', consult).textContent = first ? `, ${first}` : '';
      $('[data-done-practice]', consult).textContent = String(fd.get('practice') || 'your practice').trim();
      bodyEl.hidden = true;
      done.hidden = false;
      done.focus({ preventScroll: true });
      toTop();
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
      let x = window.innerWidth / 2, y = window.innerHeight / 2;
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

    if (page) {
      source = 'page';
      showStep(restoreDraft(), false);
      return;
    }
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
}

init();
