/* Runs the browser and unit suites against dist/ on a throwaway static server.
   npm test = lint → build → html-validate → this file. Needs Playwright with Chromium. */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DIST = path.resolve(__dirname, '../dist');
const PORT = Number(process.env.TEST_PORT || 4340);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const SUITES = ['consultation-function.mjs', 'site-check.cjs', 'a11y-check.cjs', 'motion-check.cjs'];

if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('dist/ is missing — run npm run build first.'); process.exit(1); }

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(DIST, p);
  let status = 200;
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { file = path.join(DIST, '404.html'); status = 404; }
  res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});

// Suites run as child processes, one at a time; the server keeps answering because nothing here blocks.
const run = (suite, env) => new Promise((resolve) => {
  spawn(process.execPath, [path.join(__dirname, suite)], { env, stdio: 'inherit' }).on('close', (code) => resolve(code === 0));
});

server.listen(PORT, async () => {
  const env = { ...process.env, BASE: `http://localhost:${PORT}` };
  const results = [];
  for (const s of SUITES) {
    console.log(`\n━━ ${s} ━━`);
    results.push([s, await run(s, env)]);
  }
  server.close();
  console.log('\n━━ summary ━━');
  results.forEach(([s, ok]) => console.log(`${ok ? 'PASS' : 'FAIL'}  ${s}`));
  process.exit(results.every(([, ok]) => ok) ? 0 : 1);
});
