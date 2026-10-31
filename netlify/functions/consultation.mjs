/* POST /api/consultation — receives a records appointment from the site and forwards it to your CRM.

   Environment (Netlify → Site configuration → Environment variables):
     CONSULT_WEBHOOK_URL    required. Any HTTPS endpoint that accepts JSON: a HubSpot/Salesforce
                            workflow webhook, Zapier or Make catch hook, Slack workflow, etc.
     CONSULT_WEBHOOK_TOKEN  optional. Sent as "Authorization: Bearer <token>".
   Front end: build with PUBLIC_CONSULT_ENDPOINT=/api/consultation.

   The function validates and normalises the payload, drops honeypot submissions, accepts requests
   only from this site's own origins, and never logs personal data. */

export const config = { path: '/api/consultation' };

const MAX_BYTES = 12_000;
const ENUMS = {
  locations: ['1', '2-3', '4+'],
  goals: ['starts', 'adults', 'website', 'rebrand', 'reputation', 'location', 'recovery'],
  current: ['in-house', 'agency', 'little'],
  budget: ['', 'Under $3,000', '$3,000–$6,000', '$6,000–$12,000', '$12,000+'],
  role: ['', 'Orthodontist / owner', 'Practice manager', 'Marketing lead', 'Other'],
  time: ['', 'morning', 'midday', 'afternoon'],
};
const META_KEYS = ['source', 'page', 'submitted_at', 'landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (status, body, extra = {}) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
});
const text = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function allowedOrigin(origin, env) {
  if (!origin) return true;                                   // same-origin form posts may omit it
  const own = [env.URL, env.DEPLOY_PRIME_URL, env.DEPLOY_URL, env.SITE_URL].filter(Boolean).map((u) => new URL(u).origin);
  if (own.includes(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) && env.CONTEXT !== 'production';
}

export function validate(body) {
  const lead = {
    practice: text(body.practice), website: text(body.website, 300), city: text(body.city),
    locations: text(body.locations, 8), current: text(body.current, 16), budget: text(body.budget, 32),
    notes: text(body.notes, 2000), name: text(body.name), role: text(body.role, 40),
    email: text(body.email, 254).toLowerCase(), phone: text(body.phone, 40), time: text(body.time, 16),
    goals: Array.isArray(body.goals) ? [...new Set(body.goals.filter((g) => ENUMS.goals.includes(g)))] : [],
  };
  const errors = [];
  for (const f of ['practice', 'city', 'name']) if (!lead[f]) errors.push(f);
  if (!EMAIL.test(lead.email)) errors.push('email');
  if (!ENUMS.locations.includes(lead.locations)) errors.push('locations');
  if (!lead.goals.length) errors.push('goals');
  if (!ENUMS.current.includes(lead.current)) errors.push('current');
  for (const f of ['budget', 'role', 'time']) if (!ENUMS[f].includes(lead[f])) errors.push(f);
  const meta = {};
  if (body.meta && typeof body.meta === 'object') for (const k of META_KEYS) if (body.meta[k]) meta[k] = text(String(body.meta[k]), 300);
  return { lead, meta, errors };
}

export default async function handler(req, context = {}) {
  const env = process.env;
  if (req.method !== 'POST') return json(405, { ok: false, reason: 'method' }, { Allow: 'POST' });
  if (!allowedOrigin(req.headers.get('origin'), env)) return json(403, { ok: false, reason: 'origin' });
  if (!(req.headers.get('content-type') || '').includes('application/json')) return json(415, { ok: false, reason: 'content-type' });

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return json(413, { ok: false, reason: 'too-large' });
  let body;
  try { body = JSON.parse(raw); } catch (e) { return json(400, { ok: false, reason: 'json' }); }
  if (!body || typeof body !== 'object') return json(400, { ok: false, reason: 'json' });
  if (body.company_website) return json(200, { ok: true });  // honeypot: accept quietly, forward nothing

  const { lead, meta, errors } = validate(body);
  if (errors.length) return json(422, { ok: false, reason: 'invalid', fields: errors });

  if (!env.CONSULT_WEBHOOK_URL) return json(503, { ok: false, reason: 'not-configured' });
  try {
    const res = await fetch(env.CONSULT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(env.CONSULT_WEBHOOK_TOKEN ? { Authorization: `Bearer ${env.CONSULT_WEBHOOK_TOKEN}` } : {}),
      },
      body: JSON.stringify({ type: 'consultation_request', received_at: new Date().toISOString(), lead, meta }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) { console.error(`[consultation] webhook responded ${res.status}`); return json(502, { ok: false, reason: 'upstream' }); }
  } catch (e) {
    console.error(`[consultation] webhook unreachable: ${e.name}`);
    return json(502, { ok: false, reason: 'upstream' });
  }
  return json(200, { ok: true });
}
