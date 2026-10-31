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
  vite: { build: { assetsInlineLimit: 0 } },
});
