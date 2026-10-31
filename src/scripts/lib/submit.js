/* Sends a records appointment. Configure PUBLIC_CONSULT_ENDPOINT (see .env.example / BUILD.md):
   any HTTPS endpoint that accepts JSON — the bundled Netlify function, a CRM webhook, Formspree, etc. */
const ENDPOINT = import.meta.env.PUBLIC_CONSULT_ENDPOINT || '';
const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])$/;

const attribution = () => {
  try { return JSON.parse(sessionStorage.getItem('om-attribution') || '{}'); } catch (e) { return {}; }
};

export async function submitRecords(fd, source) {
  if (fd.get('company_website')) return { ok: true, spam: true };        // honeypot filled: quietly drop
  const payload = {
    practice: fd.get('practice') || '', website: fd.get('website') || '', city: fd.get('city') || '',
    locations: fd.get('locations') || '', goals: fd.getAll('goals'), current: fd.get('current') || '',
    budget: fd.get('budget') || '', notes: fd.get('notes') || '', name: fd.get('name') || '',
    role: fd.get('role') || '', email: fd.get('email') || '', phone: fd.get('phone') || '', time: fd.get('time') || '',
    meta: { source, page: location.pathname, submitted_at: new Date().toISOString(), ...attribution() },
  };
  if (!ENDPOINT) {
    if (LOCAL.test(location.hostname)) {
      console.info('[consultation] PUBLIC_CONSULT_ENDPOINT is not set — local demo submission, nothing was sent.', payload);
      await new Promise((r) => setTimeout(r, 600));
      return { ok: true, demo: true };
    }
    return { ok: false, reason: 'not-configured' };
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    return res.ok ? { ok: true } : { ok: false, reason: `http-${res.status}` };
  } catch (e) {
    return { ok: false, reason: e.name === 'AbortError' ? 'timeout' : 'network' };
  }
}
