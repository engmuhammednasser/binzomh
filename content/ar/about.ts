import type { AboutContent } from '~~/types/content'

// "بنزوما" / "بنزوما كوزمتكس" are the owner-approved working Arabic
// display names (docs/unresolved-content-approvals.md item 8).
//
// See content/en/about.ts for the sourcing notes on every section; they are
// not duplicated here. Personal names are transliterated to Arabic, and the
// portraits are the same approved files (item 10) — the photo/name pairing
// comes from the slide 9 XML groups, so it must stay identical in both
// locales. Latin digits, matching the rest of the Arabic content.
export const aboutContent: AboutContent = {
  status: 'draft',
  note: 'N03 About experience. The "RMZ Holding Company" / "BINZOMAH Group" legal names stay out — still unconfirmed (item 4). Founding year and the leadership roster are both owner-confirmed as of 2026-09-23; see items 4 and 10.',

  hero: {
    status: 'draft',
    eyebrow: 'من نحن',
    heading: 'توزيع مصمم للعناية بالجمال والصحة',
    intro: 'إرث مؤسسي وهوية توزيع عصرية، مبنية حول العناية بالجمال والصحة في المملكة العربية السعودية.',
  },

  overview: {
    status: 'draft',
    eyebrow: 'نظرة عامة على الشركة',
    heading: 'شريك توزيع موثوق',
    body:
      'بنزوما شركة توزيع مملوكة ملكية خاصة لمنتجات العناية بالجمال والصحة في المملكة العربية السعودية. تعمل الشركة من مستودعات مكيّفة الحرارة في الرياض، بالتعاون الوثيق مع الشركات المصنّعة العالمية والعملاء المحليين في جميع أنحاء المملكة.',
  },

  location: {
    status: 'draft',
    eyebrow: 'موقعنا',
    heading: 'في قلب الخليج',
    body:
      'يقع المقر الرئيسي لبنزوما في الرياض، ويتم التوزيع من مستودعات مكيّفة الحرارة داخل المملكة، بما يضع أعمال الشركة على مقربة من أبرز المراكز التجارية السعودية ومن منطقة الخليج الأوسع.',
    city: 'الرياض',
    cityLabel: 'المقر الرئيسي',
    address: 'حي الصحافة، طريق أنس بن مالك، الرياض، المملكة العربية السعودية',
  },

  story: {
    status: 'draft',
    eyebrow: 'قصتنا',
    heading: 'من 1970 إلى بنزوما كوزمتكس',
    intro:
      'يتتبع المسار التالي مواد الشركة نفسها: بيت تجاري عائلي تأسس عام 1970، ثم أول دخول إلى قطاع مستحضرات التجميل عام 2015، ثم إعادة بناء العلامة التي أنتجت بنزوما كوزمتكس بصورتها الحالية.',
    timeline: [
      {
        year: '1970',
        description: 'تأسيس شركة بنزوما، التي شكّلت النواة الأولى لما أصبح فيما بعد مجموعة بنزوما.',
      },
      {
        year: '2015',
        description: 'أطلقت المجموعة أول مؤسسة لمستحضرات التجميل تحت اسم Cozma Care، لخدمة سوق مستحضرات التجميل الواسع.',
      },
      {
        year: '2021',
        description: 'تحول شامل للعلامة التجارية: إعادة التسمية إلى بنزوما كوزمتكس وتوجه استراتيجي نحو مستحضرات التجميل الجلدية. وفي العام نفسه عُيّن محمود الديب مديرًا عامًا، وانتقل المقر الرئيسي من جدة إلى الرياض.',
      },
    ],
    disclaimer: 'يُعرض هذا المسار كما ورد في مواد الشركة.',
  },

  visionMission: {
    status: 'draft',
    eyebrow: 'الرؤية والرسالة',
    heading: 'ما يقودنا',
    visionLabel: 'رؤيتنا',
    vision: 'في بنزوما كوزمتكس، نسعى جاهدين لتحقيق أفضل المعايير في الصناعة، آخذين في الاعتبار مصالح عملائنا ومنفعة المجتمع بشكل عام.',
    missionLabel: 'رسالتنا',
    mission: 'أن نجعل بنزوما الشريك المفضّل لتوزيع منتجات الصحة والجمال في المملكة من خلال تقديم أعلى المعايير وأفضل خدمة للعملاء.',
  },

  strategies: {
    status: 'draft',
    eyebrow: 'استراتيجياتنا الرئيسية',
    heading: 'كيف نحقق القيمة',
    items: [
      {
        number: '01',
        title: 'الريادة في مجال الصحة والجمال',
        description: 'تهدف بنزوما إلى تعزيز مكانتها في قطاع الصحة والجمال في المملكة العربية السعودية، والمساهمة في معايير الصناعة والابتكار في السوق.',
      },
      {
        number: '02',
        title: 'التميّز في جودة المنتجات',
        description: 'نلتزم بتقديم منتجات تفي بأعلى مستويات الجودة، بما يضمن السلامة والفعالية والتميّز في جميع منتجاتنا.',
      },
      {
        number: '03',
        title: 'خدمة تتمحور حول العميل',
        description: 'تولي بنزوما الأولوية لخدمة عملاء متميزة، بحيث تقوم كل تجربة على الثقة والاهتمام وتجربة سلسة تفوق التوقعات.',
      },
      {
        number: '04',
        title: 'استقطاب علامات تجارية عالمية رائدة',
        description: 'نلتزم بالشراكة مع العلامات التجارية العالمية الرائدة في مجال الصحة والجمال واستقطابها. وباعتبارنا موزعًا موثوقًا، نقدّم للمملكة منتجات عالمية عالية الجودة، ونثري خيارات المستهلك ونرفع معايير الصناعة.',
      },
    ],
  },

  leadership: {
    status: 'draft',
    eyebrow: 'القيادة',
    heading: 'الأشخاص وراء بنزوما',
    body:
      'يقود بنزوما رئيس مجلس الإدارة وفريق إداري يغطي التوزيع والمالية والتخطيط والمبيعات والتدريب الطبي وإدارة العلامات.',

    chairman: {
      status: 'draft',
      label: 'رئيس مجلس الإدارة',
      person: {
        slug: 'rashid-bin-zomah',
        name: 'د. راشد بن زومه',
        role: 'رئيس مجلس الإدارة',
        photo: '/images/about/chairman.jpeg',
        width: 1122,
        height: 1402,
      },
      biography: [
        'يمثّل د. راشد بن زومه الامتداد الطبيعي لتاريخ تجاري عائلي حافل، بدأ مع جدّه علي محمد بن زومه، واستمر عبر والديه سعد ومحفوظ، ويواصله اليوم الجيل الثالث.',
        'ويُعدّ من أبرز المستثمرين والروّاد في قطاع المياه المعبأة في المملكة العربية السعودية ودول مجلس التعاون الخليجي.',
        'وعلى صعيد مسؤولياته المجتمعية، يرأس د. راشد ديوان الشباب والرياضة، الذي يضم رجال أعمال وصنّاع قرار ومستثمرين ورياضيين يعملون على تهيئة الرياضة السعودية لمرحلة الخصخصة وتطوير الاستثمار في مختلف الألعاب. كما انتُخب بالتزكية رئيسًا لنادي جدة لذوي الإعاقة، خلال الجمعية العمومية غير العادية التي عُقدت في مقر هيئة الرياضة بجدة.',
      ],
      quote: 'قد يملك صاحب الشركة الأرقام، لكن المالك الحقيقي لقيمتها ونجاحها هم موظفوها.',
    },

    teamLabel: 'الفريق الإداري',
    team: [
      { slug: 'mahmoud-eldeeb', name: 'محمود الديب', role: 'المدير العام', photo: '/images/about/team/mahmoud-eldeeb.jpeg', width: 605, height: 737 },
      { slug: 'youssef-ghaly', name: 'يوسف غالي', role: 'مدير التوزيع', photo: '/images/about/team/youssef-ghaly.jpeg', width: 605, height: 807 },
      { slug: 'mohamed-hassan', name: 'محمد حسن', role: 'مدير المالية والمحاسبة', photo: '/images/about/team/mohamed-hassan.jpeg', width: 605, height: 731 },
      { slug: 'amr-dwidar', name: 'عمرو دويدار', role: 'مدير تخطيط الطلب', photo: '/images/about/team/amr-dwidar.jpeg', width: 605, height: 807 },
      { slug: 'ramy-khedr', name: 'رامي خضر', role: 'مدير المبيعات', photo: '/images/about/team/ramy-khedr.jpeg', width: 605, height: 807 },
      { slug: 'samar-lotfy', name: 'سمر لطفي', role: 'مديرة التوعية الطبية والتدريب', photo: '/images/about/team/samar-lotfy.jpeg', width: 605, height: 807 },
      { slug: 'mariam-fathalla', name: 'مريم فتح الله', role: 'مديرة العلامات التجارية', photo: '/images/about/team/mariam-fathalla.jpeg', width: 605, height: 807 },
    ],
  },

  cta: { label: 'اكتشف قدراتنا', to: '/capabilities' },
}
