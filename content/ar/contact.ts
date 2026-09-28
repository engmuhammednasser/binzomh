import type { ContactContent } from '~~/types/content'

// See content/en/contact.ts for the full rationale: phone, email and
// address are APPROVED for public display (owner decision, 2026-09-23 —
// docs/unresolved-content-approvals.md item 6) and working hours were
// supplied in the same decision. Latin digits, matching the rest of the
// Arabic content.
export const contactContent: ContactContent = {
  status: 'blocked',
  eyebrow: 'تواصل معنا',
  title: 'تحدّث إلى بنزوما',
  intro:
    'تواصل مع فريقنا بشأن التوزيع في المملكة العربية السعودية — هاتفيًا أو عبر البريد الإلكتروني أو من خلال نموذج الطلب.',
  note: 'Form destination is environment configuration, not approved content. Phone/email/address/hours are approved (item 6) and now render on this page as well as in the footer.',

  detailsHeading: 'بيانات التواصل',
  formHeading: 'أرسل طلبك',
  formBody:
    'أخبرنا عن علامتك التجارية أو نشاطك، وسيعود إليك الفريق.',
  formUnavailable:
    'جارٍ ربط نموذج الطلب. وحتى ذلك الحين، يرجى الاتصال بنا أو مراسلتنا عبر البيانات الموجودة في هذه الصفحة.',

  address: 'حي الصحافة، طريق أنس بن مالك، الرياض، المملكة العربية السعودية',
  phone: '+966 50 006 4807',
  email: 'info@binzomah.net',
  hours: 'الأحد – الخميس، 9:00 ص – 6:00 م',
}
