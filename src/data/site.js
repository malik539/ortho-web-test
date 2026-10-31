/* Site-wide facts and settings. Anything marked `verify: true` came from public listings and must be
   confirmed by Ortho Marketing before launch (see BUILD.md → Content to confirm). */
export const SITE = {
  name: 'Ortho Marketing',
  url: 'https://orthomarketing.com',
  locale: 'en_US',
  tagline: 'We move markets the way you move teeth.',
  description:
    'Ortho Marketing is the brand, web and growth studio for orthodontic practices. Family-run since 2008. Begin with a records appointment for your brand.',
  founded: 2008,                       // verify
  structure: 'Family-run',             // verify
  president: { name: 'Dean Steinman', title: 'President', experience: '25+ years in orthodontic & dental marketing' }, // verify
  specialism: 'Orthodontic practices', // verify
  podcast: {
    name: 'Ortho Marketing Live',
    host: 'Dean Steinman',
    episodes: '170+',                  // verify
    appleUrl: 'https://podcasts.apple.com/us/podcast/id1458503918', // verify
  },
  // Manual setup: fill these before launch. Empty values are simply not rendered.
  contact: { email: '', phone: '', address: '' },
  social: [],                          // e.g. [{ label: 'LinkedIn', url: 'https://…' }]
  consultation: {
    length: '30-minute strategy call', // verify
    keep: 'Your plan is yours to keep', // verify policy
  },
};

export const NAV = [
  { label: 'Treatment', href: '/treatment/' },
  { label: 'Results', href: '/results/' },
  { label: 'Studio', href: '/studio/' },
  { label: 'Live', href: '/live/' },
  { label: 'First visit', href: '/consultation/' },
];

export const FOOTER_LINKS = [
  ...NAV,
  { label: 'Accessibility', href: '/accessibility/' },
  { label: 'Privacy', href: '/privacy/' },
  { label: 'Terms', href: '/terms/' },
];
