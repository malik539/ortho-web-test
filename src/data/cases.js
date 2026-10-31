/* Case files. The only case so far is ILLUSTRATIVE (fictional practice, illustrative numbers):
   it ships as a template, is marked noindex, and must be replaced with verified client work. */
export const CASES = [
  {
    slug: 'alder-lane',
    illustrative: true,
    practice: 'Alder Lane Orthodontics',
    type: 'Specialist practice · two locations',
    challenge: 'Growth',
    situation: 'A respected specialist practice with an outdated template website, a crowded local market and paid search that brought clicks but few consultations.',
    insight: 'Parents trusted the doctors in person — nothing online showed why.',
    phases: ['records', 'alignment', 'force', 'retention'],
    metrics: [
      { value: '+212%', label: 'Organic consultation requests, 12 months' },
      { value: '9', small: '/11', label: 'Target zip codes where the practice holds #1 in the map pack' },
      { value: '−38%', label: 'Cost per new-patient start' },
    ],
    quote: { text: 'They spoke to us like clinicians, not customers. Eighteen months later, our schedule looks like a different practice.', by: 'Practice owner · Alder Lane Orthodontics' },
    retention: 'Monthly force reports, review generation and a referring-doctor program continue.',
  },
];

export const caseBySlug = (slug) => CASES.find((c) => c.slug === slug);
