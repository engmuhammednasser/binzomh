import type { CapabilitiesContent } from '~~/types/content'

export const capabilitiesContent: CapabilitiesContent = {
  status: 'draft',
  note: 'N03 Capabilities experience — deeper than the N02 homepage teaser. Warehouse count and delivered-order-capacity figures are deliberately excluded (blocked metrics); the deck\'s "match the MOH, Saudi FDA and FMCG Standards" line is deliberately not upgraded to a certification claim. See docs/unresolved-content-approvals.md and the source project\'s CAP04 entry.',

  hero: {
    status: 'draft',
    eyebrow: 'Our Capabilities',
    heading: 'How We Operate',
    intro:
      'Binzomah supports brand principals and customers across four core capability areas: brand partnerships, sales and distribution, marketing and branding, and warehousing and logistics.',
  },

  sections: [
    {
      status: 'draft',
      id: 'brand-partnerships',
      imageSlotId: 'capabilities-section-1',
      number: '01',
      title: 'Brand Partnerships',
      summary: 'Onboarding and supporting global health and beauty brands.',
      body:
        'We onboard and support global health and beauty brands entering or growing in the Saudi market, working closely with principals throughout the relationship.',
      cta: { label: 'Partner With Us', to: '/contact' },
    },
    {
      status: 'draft',
      id: 'sales-distribution',
      imageSlotId: 'capabilities-section-2',
      number: '02',
      title: 'Sales & Distribution',
      summary: 'Reaching pharmacies, hospitals, wholesalers, and retailers.',
      body:
        'Our distribution network reaches pharmacy, e-commerce, cosmetics retail, hospital, and wholesale channels across the Kingdom.',
      cta: { label: 'See Our Network', to: '/network' },
      note: 'Daily delivered-order capacity is a blocked metric — not quoted here.',
    },
    {
      status: 'draft',
      id: 'marketing-branding',
      imageSlotId: 'capabilities-section-4',
      number: '03',
      title: 'Marketing & Branding',
      summary: 'Executing marketing strategies and plans for our brands.',
      body:
        'We execute full-fledged marketing strategies and plans for our brands in the Saudi market.',
      note: 'Restates the homepage\'s Marketing & Branding line, the only approved copy for this capability; no further marketing claims are made.',
    },
    {
      status: 'draft',
      id: 'warehousing-logistics',
      imageSlotId: 'capabilities-section-3',
      number: '04',
      title: 'Warehousing & Logistics',
      summary: 'Temperature-controlled storage with structured stock rotation.',
      body:
        'Our main distribution centre is located in Al Suly, Riyadh. Distribution operations follow FIFO stock rotation and controlled storage conditions.',
      note: 'Warehouse count (2) is a blocked metric — not restated here. The source deck\'s own "match the MOH, Saudi FDA and FMCG Standards" wording is deliberately not published as a certification claim pending compliance/legal review.',
    },
  ],

  closing: {
    status: 'draft',
    heading: 'Ready to Bring Your Brand to Saudi Arabia?',
    cta: { label: 'Partner With Binzomah', to: '/contact' },
  },
}
