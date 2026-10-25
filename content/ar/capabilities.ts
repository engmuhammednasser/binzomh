import type { CapabilitiesContent } from '~~/types/content'

export const capabilitiesContent: CapabilitiesContent = {
  status: 'draft',
  note: 'N03 Capabilities experience — deeper than the N02 homepage teaser. Warehouse count and delivered-order-capacity figures are deliberately excluded (blocked metrics).',

  hero: {
    status: 'draft',
    eyebrow: 'قدراتنا',
    heading: 'كيف نعمل',
    intro: 'تدعم بنزوما الشركات المصنّعة والعملاء عبر أربعة مجالات أساسية من القدرات: شراكات العلامات التجارية، والمبيعات والتوزيع، والتسويق وبناء العلامة التجارية، والتخزين والخدمات اللوجستية.',
  },

  sections: [
    {
      status: 'draft',
      id: 'brand-partnerships',
      imageSlotId: 'capabilities-section-1',
      number: '01',
      title: 'شراكات العلامات التجارية',
      summary: 'استقطاب ودعم العلامات التجارية العالمية للصحة والجمال.',
      body: 'نستقبل وندعم العلامات التجارية العالمية للصحة والجمال الراغبة في دخول السوق السعودي أو التوسع فيه، بالتعاون الوثيق مع الشركات المصنّعة طوال العلاقة.',
      cta: { label: 'كن شريكًا لنا', to: '/contact' },
    },
    {
      status: 'draft',
      id: 'sales-distribution',
      imageSlotId: 'capabilities-section-2',
      number: '02',
      title: 'المبيعات والتوزيع',
      summary: 'الوصول إلى الصيدليات والمستشفيات وتجار الجملة والتجزئة.',
      body: 'تصل شبكة التوزيع لدينا إلى الصيدليات ومنصات التجارة الإلكترونية ومتاجر التجزئة لمستحضرات التجميل والمستشفيات وتجار الجملة في جميع أنحاء المملكة.',
      cta: { label: 'شبكتنا', to: '/network' },
    },
    {
      status: 'draft',
      id: 'marketing-branding',
      imageSlotId: 'capabilities-section-4',
      number: '03',
      title: 'التسويق وبناء العلامة التجارية',
      summary: 'تنفيذ استراتيجيات وخطط تسويقية لعلاماتنا التجارية.',
      body: 'ننفّذ استراتيجيات وخطط تسويقية متكاملة لعلاماتنا التجارية في السوق السعودي.',
    },
    {
      status: 'draft',
      id: 'warehousing-logistics',
      imageSlotId: 'capabilities-section-3',
      number: '04',
      title: 'التخزين والخدمات اللوجستية',
      summary: 'تخزين مكيّف الحرارة مع تدوير منظم للمخزون.',
      body: 'يقع مركز التوزيع الرئيسي لدينا في السلي بالرياض. وتتّبع عمليات التوزيع مبدأ الوارد أولًا صادر أولًا (FIFO) وظروف تخزين منضبطة.',
    },
  ],

  closing: {
    status: 'draft',
    heading: 'هل أنت مستعد لتقديم علامتك التجارية في السوق السعودي؟',
    cta: { label: 'كن شريكًا مع بنزوما', to: '/contact' },
  },
}
