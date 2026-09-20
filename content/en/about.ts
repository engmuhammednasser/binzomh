import type { AboutContent } from '~~/types/content'

export const aboutContent: AboutContent = {
  status: 'draft',
  note: 'N03 About experience. Company overview omits the establishment date and the "RMZ Holding Company" / "BINZOMAH Group" legal names — both are contradicted or unconfirmed in source material. See docs/unresolved-content-approvals.md item 4 and the source project\'s AB01 entry.',

  hero: {
    status: 'draft',
    eyebrow: 'About Us',
    heading: 'Distribution Built for Beauty and Health Care',
    intro:
      'Corporate heritage and a modern distribution identity, built around Beauty Care and Health Care in Saudi Arabia.',
  },

  overview: {
    status: 'draft',
    eyebrow: 'Company Overview',
    heading: 'A Trusted Distribution Partner',
    body:
      'Binzomah is a privately held distributor of Beauty Care and Health Care products in Saudi Arabia. The company operates from temperature-controlled warehouses in Riyadh, working closely with global principals and local customers across the Kingdom.',
  },

  story: {
    status: 'draft',
    eyebrow: 'Our Story',
    heading: 'A Timeline in Progress',
    intro:
      'The chronology below reflects information provided in company materials. Final confirmation from the company is still pending.',
    timeline: [
      {
        year: '1970',
        description:
          'Establishment of the Binzomah company, forming the foundational origin of what would become the Binzomah Group.',
      },
      {
        year: '2015',
        description:
          'The Group launched its first cosmetics enterprise under the name Cozma Care, serving the mass cosmetics market.',
      },
      {
        year: '2021',
        description:
          'A comprehensive brand transformation: rebranding to Binzomah Cosmetics and a strategic shift toward dermo-cosmetics.',
      },
    ],
    disclaimer:
      'This timeline is presented as documented in company materials and has not been independently verified or finalized.',
    note: 'Excludes the deck\'s own 2024 "market leader" line (an unverified superlative) and the 2021 GM-appointment entry (a named-individual detail that belongs to the still-undecided Team/Leadership question, not this timeline). See docs/unresolved-content-approvals.md item 4.',
  },

  visionMission: {
    status: 'draft',
    eyebrow: 'Vision & Mission',
    heading: 'What Drives Us',
    visionLabel: 'Our Vision',
    vision:
      'At Binzomah Cosmetics, we strive hard to meet the best standards in the industry, keeping in mind the interests of our clients and the benefit of the community at large.',
    missionLabel: 'Our Mission',
    mission:
      'To make Binzomah the preferred distribution partner for health and beauty in the Kingdom by providing the highest standards and the best customer service.',
    note: 'Quotes the company profile (slide 7), lightly copyedited. The slide\'s adjacent "2030" mark is omitted — its connection to Binzomah\'s own vision (vs. a nod to Saudi Vision 2030) is unconfirmed.',
  },

  strategies: {
    status: 'draft',
    eyebrow: 'Key Strategies',
    heading: 'How We Create Value',
    items: [
      {
        number: '01',
        title: 'Leadership in Health & Beauty',
        description:
          'Binzomah aims to strengthen its position in the Saudi health and beauty sector, contributing to industry standards and market innovation.',
      },
      {
        number: '02',
        title: 'Product Quality Excellence',
        description:
          'We are committed to delivering products that meet the highest standards of quality, ensuring safety, effectiveness, and excellence across all our offerings.',
      },
      {
        number: '03',
        title: 'Customer-Centric Service',
        description:
          'Binzomah prioritizes best-in-class customer service, ensuring every interaction is rooted in trust, care, and a seamless experience that exceeds expectations.',
      },
      {
        number: '04',
        title: 'Onboarding World-Class Global Brands',
        description:
          'We are committed to partnering with and onboarding world-class health and beauty brands, serving as a trusted distributor that brings high-quality international products to the Kingdom and enriches consumer choice.',
      },
    ],
    note: 'Source (slide 8) item 1 read "strives to position itself as the top health and beauty company" — reworded here to drop the market-leadership superlative per this phase\'s explicit instruction not to publish leadership claims as established fact. Items 2-4 keep the source wording (quality/service/partnership commitments, not market-position claims).',
  },

  leadership: {
    status: 'blocked',
    eyebrow: 'Leadership',
    heading: 'Leadership & Team',
    body: 'Leadership and team profiles are being finalized and will be added once approved for publication.',
    note: 'Structural placeholder only — no name, photo, or biography. The Chairman profile (slide 3) and team roster (slide 9) are PENDING an explicit IA decision in the source register (feature on About? a future Leadership page? omit?). Do not populate this section until that decision is made. See docs/unresolved-content-approvals.md and the source sitemap\'s "Newly discovered content" section.',
  },

  cta: { label: 'Discover Our Capabilities', to: '/capabilities' },
}
