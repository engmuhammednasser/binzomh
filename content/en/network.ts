import type { NetworkPageContent } from '~~/types/network'

export const networkContent: NetworkPageContent = {
  status: 'draft',
  title: 'Our Network',
  description: 'Explore Binzomah’s distribution channels in Saudi Arabia: pharmacies, e-commerce, hospitals, wholesale and cosmetics stores.',
  eyebrow: 'Connected through distribution',
  intro: 'Connecting brands with the channels that serve the Saudi market.',
  channelsHeading: 'Different channels. A shared market.',
  channelsLabel: 'Explore our customer channels',
  channels: [
    { id: 'pharmacies', name: 'Pharmacies', description: 'Beauty and health care products within the pharmacy retail channel.' },
    { id: 'e-commerce', name: 'E-Commerce', description: 'Online retail as part of the customer-channel mix.' },
    { id: 'hospitals', name: 'Hospitals', description: 'Hospital purchasing and healthcare customer channels.' },
    { id: 'wholesale', name: 'Wholesale', description: 'Business-to-business supply through wholesale channels.' },
    { id: 'cosmetics-stores', name: 'Cosmetics Stores', description: 'Specialist beauty and cosmetics retailers.' },
  ],
  reach: {
    heading: 'A network defined by the customers it serves.',
    body: 'Binzomah connects beauty and health care brands with customer channels in Saudi Arabia. The channel mix brings pharmacy, digital, healthcare, wholesale and specialist retail into one distribution network.',
    note: 'These are customer and distribution channels, not locations owned by Binzomah.',
  },
  partners: {
    heading: 'Clients & partners',
    body: 'Named relationships will be presented here when approved for publication.',
    pendingLabel: 'Names pending confirmation',
    pendingBody: 'Client and partner names and logos are awaiting approval.',
    names: [],
  },
  enquiry: {
    heading: 'Let’s talk about your channel needs.',
    body: 'Start a commercial conversation with the Binzomah team about the Saudi market.',
    cta: { label: 'Discuss a commercial enquiry', to: '/contact' },
  },
}
