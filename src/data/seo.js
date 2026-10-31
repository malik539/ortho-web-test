import { SITE } from './site.js';

/* Breadcrumb trail → visible crumbs + BreadcrumbList structured data. */
export const crumbs = (...items) => [{ label: 'Home', href: '/' }, ...items];
export const breadcrumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.label, item: `${SITE.url}${c.href}` })),
});
export const faqLd = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const serviceLd = (p) => ({
  '@type': 'Service', name: `${p.name}: ${p.summary}`, serviceType: p.summary, description: p.copy,
  url: `${SITE.url}/treatment/${p.slug}/`, provider: { '@id': `${SITE.url}/#organization` }, areaServed: 'US',
});
