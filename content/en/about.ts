import type { AboutContent } from '~~/types/content'

export const aboutContent: AboutContent = {
  status: 'draft',
  note: 'N03 About experience. The "RMZ Holding Company" / "BINZOMAH Group" legal names stay out — still unconfirmed (item 4). Founding year and the leadership roster are both owner-confirmed as of 2026-09-23; see docs/unresolved-content-approvals.md items 4 and 10.',

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

  location: {
    status: 'draft',
    eyebrow: 'Our Location',
    heading: 'At the Heart of the GCC',
    body:
      'Binzomah is headquartered in Riyadh and distributes from temperature-controlled warehouses in the Kingdom, placing the business within reach of Saudi Arabia\'s major commercial centres and the wider Gulf region.',
    city: 'Riyadh',
    cityLabel: 'Headquarters',
    address: 'Sahafa District, Anas Ibn Malek Road, Riyadh, Saudi Arabia',
    note: 'Slide 4 ("At The Heart of GCC", RIYADH (HQ)). The slide\'s map graphic is reference-only and not reproduced. No coverage counts appear here — "+70 cities" and every other figure stay blocked under item 5. The address is the same approved string the footer renders (item 6).',
  },

  story: {
    status: 'draft',
    eyebrow: 'Our Story',
    heading: 'From 1970 to Binzomah Cosmetics',
    intro:
      'The chronology below follows the company\'s own materials: a family trading house founded in 1970, a first move into cosmetics in 2015, and the rebranding that created Binzomah Cosmetics as it operates today.',
    timeline: [
      {
        year: '1970',
        description:
          'Binzomah is founded, forming the foundational origin of what would become the Binzomah Group.',
      },
      {
        year: '2015',
        description:
          'The Group launched its first cosmetics enterprise under the name Cozma Care, serving the mass cosmetics market.',
      },
      {
        year: '2021',
        description:
          'A comprehensive brand transformation: the rebranding to Binzomah Cosmetics and a strategic shift toward dermo-cosmetics. Mahmoud Eldeeb was appointed General Manager and the head office moved from Jeddah to Riyadh.',
      },
    ],
    disclaimer:
      'This timeline is presented as documented in company materials.',
    note: 'Owner confirmed on 2026-09-23 that the earlier year (1970) is the founding year and the later year (2021) is the rebranding — resolving the slide 2 ("Established in 2015") vs slide 6 conflict recorded in item 4. Slide 6\'s second 2021 entry (GM appointment + Jeddah-to-Riyadh head-office move) is folded into the 2021 entry now that named individuals are approved (item 10); the deck\'s 2024 "market leader in face care hydration" line is still excluded as an unverified superlative.',
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
    status: 'draft',
    eyebrow: 'Leadership',
    heading: 'The People Behind Binzomah',
    body:
      'Binzomah is led by its chairman and a management team spanning distribution, finance, planning, sales, medical training, and brand.',

    chairman: {
      status: 'draft',
      label: 'Our Chairman',
      person: {
        slug: 'rashid-bin-zomah',
        name: 'Dr. Rashid bin Zomah',
        role: 'Chairman',
        photo: '/images/about/chairman.png',
        width: 1122,
        height: 1402,
      },
      biography: [
        'Dr. Rashid bin Zomah is the natural extension of a remarkable family commercial history, which began with his grandfather, Ali Muhammad bin Zomah, continued through his parents, Saad and Mahfouz, and is carried on today by the third generation.',
        'He is considered one of the main investors and market pioneers in the bottled water sector in Saudi Arabia and the GCC countries.',
        'In his social responsibility roles, Dr. Rashid is Chairman of the Youth and Sports Diwan, which brings together businessmen, decision-makers, investors, and athletes working to prepare Saudi sport for the privatization era and to develop investment across a range of sports. He was also elected Chairman of the Jeddah Disabled Sports Club by acclamation, at an extraordinary General Assembly held at the Sports Authority office in Jeddah.',
      ],
      quote:
        'The owner of the company may own the numbers, but the true owner of its value and success is its employees.',
      note: 'Slide 3, lightly copyedited. Two source claims are deliberately omitted: "owner of RMZ Holding, which owns five companies" (the legal-entity names remain unconfirmed under item 4) and any restatement of the group ownership chain from slide 2. The bottled-water line keeps the source\'s own hedge ("considered one of the main..."), not a bare superlative.',
    },

    teamLabel: 'Management Team',
    team: [
      { slug: 'mahmoud-eldeeb', name: 'Mahmoud Eldeeb', role: 'General Manager', photo: '/images/about/team/mahmoud-eldeeb.jpeg', width: 605, height: 737 },
      { slug: 'youssef-ghaly', name: 'Youssef Ghaly', role: 'Head of Physical Distribution', photo: '/images/about/team/youssef-ghaly.jpeg', width: 605, height: 807 },
      { slug: 'mohamed-hassan', name: 'Mohamed Hassan', role: 'Head of Finance and Accounting', photo: '/images/about/team/mohamed-hassan.jpeg', width: 605, height: 731 },
      { slug: 'amr-dwidar', name: 'Amr Dwidar', role: 'Head of Demand Planning', photo: '/images/about/team/amr-dwidar.jpeg', width: 605, height: 807 },
      { slug: 'ramy-khedr', name: 'Ramy Khedr', role: 'Sales Manager', photo: '/images/about/team/ramy-khedr.jpeg', width: 605, height: 807 },
      { slug: 'samar-lotfy', name: 'Samar Lotfy', role: 'Medical Detailing & Training Manager', photo: '/images/about/team/samar-lotfy.jpeg', width: 605, height: 807 },
      { slug: 'mariam-fathalla', name: 'Mariam Fathalla', role: 'Brand Manager', photo: '/images/about/team/mariam-fathalla.jpeg', width: 605, height: 807 },
    ],
    note: 'Slides 3 and 9, published under the owner\'s 2026-09-23 approval (item 10). Each portrait is matched to its person from the slide 9 XML groups, not from text order — every card in that slide wraps one image with one name and one title, so the pairing is unambiguous. The source\'s "HEAD OF FINACNE AND ACCOUNTING" typo is corrected to "Finance". No person appears here who is not named on those two slides.',
  },

  cta: { label: 'Discover Our Capabilities', to: '/capabilities' },
}
