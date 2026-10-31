// Copies the latin subsets of the open-source prototype faces into public/fonts.
// Run after upgrading the @fontsource packages:  node scripts/copy-fonts.mjs
// Production faces (GT Sectra Display, Söhne, Söhne Mono) are licensed separately — see BUILD.md.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const out = new URL('../public/fonts/', import.meta.url);
mkdirSync(out, { recursive: true });
const files = [
  ['@fontsource-variable/fraunces', 'fraunces-latin-opsz-normal.woff2', 'fraunces-opsz-latin.woff2'],
  ['@fontsource-variable/fraunces', 'fraunces-latin-opsz-italic.woff2', 'fraunces-opsz-italic-latin.woff2'],
  ['@fontsource-variable/hanken-grotesk', 'hanken-grotesk-latin-wght-normal.woff2', 'hanken-grotesk-wght-latin.woff2'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono-latin-400-normal.woff2', 'ibm-plex-mono-400-latin.woff2'],
];
let notice = 'Fonts in this folder are licensed under the SIL Open Font License 1.1.\n\n';
for (const [pkg, file, name] of files) {
  const dir = require.resolve(`${pkg}/package.json`).replace(/package\.json$/, '');
  const { version } = JSON.parse(readFileSync(dir + 'package.json', 'utf8'));
  const versioned = name.replace('.woff2', `.v${version}.woff2`);
  copyFileSync(dir + 'files/' + file, new URL(versioned, out));
  notice += `${versioned}  ←  ${pkg}@${version}\n`;
  console.log('copied', versioned);
}
copyFileSync(require.resolve('@fontsource-variable/fraunces/LICENSE'), new URL('LICENSE-fraunces.txt', out));
copyFileSync(require.resolve('@fontsource-variable/hanken-grotesk/LICENSE'), new URL('LICENSE-hanken-grotesk.txt', out));
copyFileSync(require.resolve('@fontsource/ibm-plex-mono/LICENSE'), new URL('LICENSE-ibm-plex-mono.txt', out));
writeFileSync(new URL('README.txt', out), notice);
