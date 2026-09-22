import type { HomeContent } from '~~/types/content'

// "بنزوما" / "بنزوما كوزمتكس" are the owner-approved working Arabic
// display names (2026-09-20 decision, item 8) — approved for project
// design/content copy, not asserted as a registered legal/trademark name.
export const homeContent: HomeContent = {
  status: 'draft',
  note: 'N02 homepage visual experience. Sections use owner-approved design placeholders per docs/unresolved-content-approvals.md — brand relationship terms, metrics, founding chronology, and contact details all stay out, since each remains blocked or unconfirmed.',

  hero: {
    status: 'draft',
    eyebrow: 'توزيع العناية بالجمال والصحة',
    headline: 'نربط علامات الجمال والعناية الصحية بالسوق السعودي.',
    description:
      'توزّع بنزوما منتجات العناية بالجمال والصحة على الصيدليات والمستشفيات وتجار الجملة والتجزئة في جميع أنحاء المملكة.',
    primaryCta: { label: 'اكتشف علاماتنا التجارية', to: '/brands' },
    secondaryCta: { label: 'كن شريكًا لنا', to: '/contact' },
  },

  brands: {
    status: 'draft',
    eyebrow: 'علاماتنا التجارية',
    heading: 'محفظة مختارة للجمال والعناية الصحية',
    intro:
      'محفظة عمل لعلامات العناية بالجمال والصحة التي توزعها بنزوما في المملكة العربية السعودية.',
    disclaimer: 'قائمة العلامات التجارية وتفاصيل المحفظة الكاملة قيد الإنجاز مع كل شريك.',
    cta: { label: 'اكتشف علاماتنا التجارية', to: '/brands' },
    note: 'Names reflect a draft design roster per the 2026-09-20 project decision (item 2) — no exclusivity implied, no production logos used.',
  },

  about: {
    status: 'draft',
    eyebrow: 'من نحن',
    heading: 'توزيع مصمم للعناية بالجمال والصحة',
    body:
      'بنزوما شركة توزيع مملوكة ملكية خاصة لمنتجات العناية بالجمال والصحة، تعمل من الرياض بالتعاون الوثيق مع الشركات المصنّعة العالمية والعملاء المحليين في جميع أنحاء المملكة.',
    points: ['التوزيع', 'العناية بالجمال والصحة', 'السوق السعودي', 'عمليات الرياض'],
    cta: { label: 'تعرّف على المزيد', to: '/about' },
    note: 'Founding chronology (1970 / 2015 / 2021) intentionally omitted as a homepage statistic — see item 4.',
  },

  capabilities: {
    status: 'draft',
    eyebrow: 'قدراتنا',
    heading: 'كيف نعمل',
    intro:
      'من شراكات العلامات التجارية إلى المبيعات والتوزيع والتخزين، تربط بنزوما الشركات المصنّعة العالمية بالسوق السعودي.',
    items: [
      {
        number: '01',
        title: 'شراكات العلامات التجارية',
        description: 'استقطاب علامات تجارية عالمية رائدة وبناء علاقات طويلة الأمد مع الشركات المصنّعة.',
      },
      {
        number: '02',
        title: 'المبيعات والتوزيع',
        description: 'الوصول إلى الصيدليات والمستشفيات وتجار الجملة والتجزئة في جميع أنحاء المملكة.',
      },
      {
        number: '03',
        title: 'التخزين والخدمات اللوجستية',
        description: 'تشغيل مستودعات مكيّفة الحرارة باتباع ممارسات منظمة لتدوير المخزون.',
      },
    ],
    cta: { label: 'اكتشف قدراتنا', to: '/capabilities' },
  },

  network: {
    status: 'draft',
    eyebrow: 'شبكتنا',
    heading: 'نصل إلى كل قناة',
    intro: 'تصل شبكة توزيع بنزوما إلى خمس قنوات رئيسية في المملكة العربية السعودية.',
    channels: ['الصيدليات', 'التجارة الإلكترونية', 'المستشفيات', 'تجار الجملة', 'متاجر مستحضرات التجميل'],
    logosLabel: 'نماذج من الشركاء عبر هذه القنوات.',
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
    cta: { label: 'اكتشف شبكتنا', to: '/network' },
    note: 'These are distribution channels reached, not Binzomah-owned locations — see item 5 on unpublished metrics. Logos are a curated homepage preview of the /network "Clients & partners" roster — see item 9.',
  },

  partnership: {
    status: 'draft',
    eyebrow: 'الشراكة',
    heading: 'هل تبحث عن شريك لنمو علامتك في السوق السعودي؟',
    cta: { label: 'كن شريكًا مع بنزوما', to: '/contact' },
  },
}
