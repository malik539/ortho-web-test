// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages kept out of search until real content replaces drafts/illustrations (see BUILD.md).
const NOINDEX = ['/results/alder-lane/', '/privacy/', '/terms/'];

export default defineConfig({
  site: 'https://orthomarketing.com',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [
    sitemap({ filter: (page) => !NOINDEX.some((p) => page.endsWith(p)) }),
  ],
  vite: {
    build: {
      assetsInlineLimit: 0,
      // CSS is lowered for browsers back to 2022 so fallbacks survive minification
      // (e.g. 100vh before 100svh for Safari 15 and Chrome < 108).
      cssTarget: ['chrome100', 'edge100', 'firefox100', 'safari15'],
    },
  },
});
