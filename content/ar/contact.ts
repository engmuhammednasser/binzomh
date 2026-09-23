import type { ContactContent } from '~~/types/content'

// See content/en/contact.ts for the full rationale: phone, email and
// address are APPROVED for public display (owner decision, 2026-09-23 —
// docs/unresolved-content-approvals.md item 6) and working hours were
// supplied in the same decision. The /contact page's form stays blocked.
//
// Latin digits, matching the rest of the Arabic content (content/ar/about.ts
// timeline years, section numbers) rather than Arabic-Indic numerals.
export const contactContent: ContactContent = {
  status: 'blocked',
  title: 'تواصل معنا',
  intro:
    'سيتوفر نموذج طلب الشراكة في مرحلة لاحقة، بعد اعتماد آلية الإرسال. وحتى ذلك الحين تجد رقم الهاتف والبريد الإلكتروني والعنوان في تذييل الموقع.',
  note: 'Contact page form stays blocked pending a submission backend. Phone/email/address/hours are approved and rendered in the footer.',
  address: 'حي الصحافة، طريق أنس بن مالك، الرياض، المملكة العربية السعودية',
  phone: '+966 50 006 4807',
  email: 'info@binzomah.net',
  hours: 'الأحد – الخميس، 9:00 ص – 6:00 م',
}
