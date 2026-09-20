import type { HomeContent } from '~~/types/content'

export const homeContent: HomeContent = {
  status: 'draft',
  // "Binzomah" is kept in Latin script in Arabic copy: no official Arabic
  // transliteration has been supplied or confirmed. See
  // docs/unresolved-content-approvals.md.
  title: 'Binzomah Cosmetics',
  intro:
    'توزيع منتجات العناية بالجمال والصحة في المملكة العربية السعودية. هذه معاينة أساسية — محتوى الصفحة الرئيسية الكامل قيد مراجعة الجهات المعنية.',
  primaryCta: { label: 'تواصل معنا', to: '/contact' },
  note: 'N01 placeholder only. Final sections are scoped for a later phase once approved copy exists — see docs/unresolved-content-approvals.md.',
}
