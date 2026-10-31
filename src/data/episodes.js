/* Ortho Marketing Live — episodes referenced from public podcast listings.
   verify: numbers, titles and guests must be confirmed against the RSS feed before launch.
   Production: sync this list from the podcast RSS feed at build time. */
export const EPISODES = [
  {
    slug: '172-virtual-assistants',
    number: 172,
    title: 'Streamlining your practice with virtual assistants',
    guest: 'with the COO of MyOrthoVA',
    summary: 'Dean Steinman and the COO of MyOrthoVA talk about how virtual assistants can take administrative work off an orthodontic team.',
    topics: ['Operations', 'Team'],
  },
  {
    slug: '168-patient-reactivation',
    number: 168,
    title: 'Bringing past patients back',
    guest: 'with Blair Feldman, Retainer Club',
    summary: 'Dean Steinman and Blair Feldman of Retainer Club discuss reactivating past patients and keeping finished patients connected to the practice.',
    topics: ['Retention', 'Growth'],
  },
  {
    slug: '79-website-security',
    number: 79,
    title: 'Protecting your practice website from hackers',
    guest: 'with our SEO manager',
    summary: 'Ortho Marketing’s SEO manager explains how practices can protect their websites from attacks — and why it matters for search.',
    topics: ['Websites', 'Search'],
  },
];

export const episodeBySlug = (slug) => EPISODES.find((e) => e.slug === slug);
