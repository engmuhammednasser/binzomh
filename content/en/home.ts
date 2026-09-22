import type { HomeContent } from '~~/types/content'

export const homeContent: HomeContent = {
  status: 'draft',
  note: 'N02 homepage visual experience. Sections use owner-approved design placeholders per docs/unresolved-content-approvals.md — brand relationship terms, metrics, founding chronology, and contact details all stay out, since each remains blocked or unconfirmed.',

  hero: {
    status: 'draft',
    eyebrow: 'Beauty Care & Health Care Distribution',
    headline: 'Connecting Beauty and Health Care Brands with Saudi Arabia.',
    description:
      'Binzomah distributes Beauty Care and Health Care products to pharmacies, hospitals, wholesalers, and retailers across the Kingdom.',
    primaryCta: { label: 'Explore Our Brands', to: '/brands' },
    secondaryCta: { label: 'Partner With Us', to: '/contact' },
  },

  brands: {
    status: 'draft',
    eyebrow: 'Our Brands',
    heading: 'A Curated Beauty & Health Portfolio',
    intro:
      'A working portfolio of beauty and health care brands distributed by Binzomah in Saudi Arabia.',
    disclaimer: 'Brand roster and portfolio details are being finalized with each principal.',
    cta: { label: 'Explore Our Brands', to: '/brands' },
    note: 'Names reflect a draft design roster per the 2026-09-20 project decision (item 2) — no exclusivity implied, no production logos used.',
  },

  about: {
    status: 'draft',
    eyebrow: 'About Us',
    heading: 'Distribution Built for Beauty and Health Care',
    body:
      'Binzomah is a privately held distributor of Beauty Care and Health Care products, operating from Riyadh and working closely with global principals and local customers across the Kingdom.',
    points: ['Distribution', 'Beauty & Health Care', 'Saudi Market', 'Riyadh Operations'],
    cta: { label: 'Learn More About Us', to: '/about' },
    note: 'Founding chronology (1970 / 2015 / 2021) intentionally omitted as a homepage statistic — see item 4.',
  },

  capabilities: {
    status: 'draft',
    eyebrow: 'Our Capabilities',
    heading: 'How We Operate',
    intro:
      'From brand partnerships to sales, distribution, and warehousing, Binzomah connects global principals to the Saudi market.',
    items: [
      {
        number: '01',
        title: 'Brand Partnerships',
        description: 'Onboarding world-class global brands and building long-term relationships with principals.',
      },
      {
        number: '02',
        title: 'Sales & Distribution',
        description: 'Reaching pharmacies, hospitals, wholesalers, and retailers across the Kingdom.',
      },
      {
        number: '03',
        title: 'Warehousing & Logistics',
        description: 'Operating temperature-controlled storage with structured stock rotation.',
      },
    ],
    cta: { label: 'Discover Our Capabilities', to: '/capabilities' },
  },

  network: {
    status: 'draft',
    eyebrow: 'Our Network',
    heading: 'Reaching Every Channel',
    intro: 'The Binzomah distribution network reaches five key channels across Saudi Arabia.',
    channels: ['Pharmacies', 'E-Commerce', 'Hospitals', 'Wholesale', 'Cosmetics Stores'],
    logosLabel: 'A sample of the partners across these channels.',
    logos: [
      { name: 'Nahdi', logo: { src: '/logos/partners/nahdi.png', width: 160, height: 160 } },
      { name: 'Al-Dawaa', logo: { src: '/logos/partners/al-dawaa.png', width: 184, height: 184 } },
      { name: 'Boutiqaat', logo: { src: '/logos/partners/boutiqaat.png', width: 164, height: 163 } },
      { name: 'Ounass', logo: { src: '/logos/partners/ounass.png', width: 150, height: 148 } },
      { name: 'Dr. Sulaiman Al Habib', logo: { src: '/logos/partners/dr-sulaiman-al-habib.png', width: 171, height: 168 } },
      { name: 'Wared Co.', logo: { src: '/logos/partners/wared-co.png', width: 168, height: 169 } },
      { name: 'Gold Apple', logo: { src: '/logos/partners/gold-apple.png', width: 150, height: 150 } },
      { name: 'Dunia Al-Osra', logo: { src: '/logos/partners/dunia-alosra.png', width: 150, height: 148 } },
    ],
    cta: { label: 'Explore Our Network', to: '/network' },
    note: 'These are distribution channels reached, not Binzomah-owned locations — see item 5 on unpublished metrics. Logos are a curated homepage preview of the /network "Clients & partners" roster — see item 9.',
  },

  partnership: {
    status: 'draft',
    eyebrow: 'Partnership',
    heading: 'Looking to grow your brand in Saudi Arabia?',
    cta: { label: 'Partner With Binzomah', to: '/contact' },
  },
}
