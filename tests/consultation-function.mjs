/* Unit checks for netlify/functions/consultation.mjs against a local mock webhook.
   Run: node tests/consultation-function.mjs  (part of npm test) */
import { createServer } from 'node:http';
import assert from 'node:assert/strict';
import handler from '../netlify/functions/consultation.mjs';

const received = [];
const hook = createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    received.push({ auth: req.headers.authorization, body: JSON.parse(body) });
    res.statusCode = req.url === '/fail' ? 500 : 200;
    res.end('{}');
  });
});
await new Promise((r) => hook.listen(0, r));
const HOOK = `http://127.0.0.1:${hook.address().port}`;

const SITE = 'https://orthomarketing.com';
const valid = {
  practice: 'Maple Ortho', website: 'mapleortho.com', city: 'Austin, TX', locations: '2-3', goals: ['starts', 'website', 'bogus'],
  current: 'agency', budget: '$3,000–$6,000', notes: '', name: 'Jordan Lee', role: 'Practice manager',
  email: 'Jordan@Example.com', phone: '', time: 'morning', meta: { source: 'hero', page: '/', utm_source: 'google', evil: 'x' },
};
const call = (body, { method = 'POST', origin = SITE, type = 'application/json' } = {}) => handler(new Request(`${SITE}/api/consultation`, {
  method, headers: { 'content-type': type, ...(origin ? { origin } : {}) },
  ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
}));

let passed = 0;
const check = async (name, fn) => { await fn(); passed++; console.log(`PASS  ${name}`); };

process.env.URL = SITE;
process.env.CONTEXT = 'production';
delete process.env.CONSULT_WEBHOOK_URL;

try {
  await check('rejects non-POST', async () => assert.equal((await call(null, { method: 'GET' })).status, 405));
  await check('rejects foreign origins', async () => assert.equal((await call(valid, { origin: 'https://evil.example' })).status, 403));
  await check('rejects localhost origin in production', async () => assert.equal((await call(valid, { origin: 'http://localhost:4321' })).status, 403));
  await check('rejects non-JSON bodies', async () => assert.equal((await call('a=b', { type: 'application/x-www-form-urlencoded' })).status, 415));
  await check('rejects malformed JSON', async () => assert.equal((await call('{nope')).status, 400));
  await check('rejects oversized bodies', async () => assert.equal((await call({ ...valid, notes: 'x'.repeat(13000) })).status, 413));
  await check('reports invalid fields', async () => {
    const res = await call({ ...valid, email: 'not-an-email', locations: '9', goals: [] });
    assert.equal(res.status, 422);
    assert.deepEqual((await res.json()).fields.sort(), ['email', 'goals', 'locations']);
  });
  await check('says when the webhook is not configured', async () => assert.equal((await call(valid)).status, 503));

  process.env.CONSULT_WEBHOOK_URL = `${HOOK}/ok`;
  process.env.CONSULT_WEBHOOK_TOKEN = 'secret-token';
  await check('drops honeypot submissions without forwarding', async () => {
    const res = await call({ ...valid, company_website: 'http://spam.example' });
    assert.equal(res.status, 200);
    assert.equal(received.length, 0);
  });
  await check('forwards a clean, normalised lead with the bearer token', async () => {
    const res = await call(valid);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(received.length, 1);
    const { auth, body } = received[0];
    assert.equal(auth, 'Bearer secret-token');
    assert.equal(body.type, 'consultation_request');
    assert.equal(body.lead.email, 'jordan@example.com');
    assert.deepEqual(body.lead.goals, ['starts', 'website']);
    assert.deepEqual(body.meta, { source: 'hero', page: '/', utm_source: 'google' });
  });
  await check('accepts same-origin requests without an Origin header', async () => assert.equal((await call(valid, { origin: null })).status, 200));
  await check('returns 502 when the webhook fails', async () => {
    process.env.CONSULT_WEBHOOK_URL = `${HOOK}/fail`;
    const err = console.error; console.error = () => {};
    const res = await call(valid);
    console.error = err;
    assert.equal(res.status, 502);
  });
  console.log(`\n${passed}/12 checks passed`);
} finally {
  hook.close();
}
