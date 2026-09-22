import type { ContactContent } from '~~/types/content'

// See the English content/en/contact.ts for the full rationale: address is
// SOURCE-CONFIRMED-FROM-PROFILE / PENDING CURRENT COMPANY CONFIRMATION
// (docs/unresolved-content-approvals.md item 6) and is shown only in the
// footer with a permanent "pending confirmation" badge. Do not add
// phone/email — only the address exception was granted.
export const contactContent: ContactContent = {
  status: 'blocked',
  title: 'تواصل معنا',
  intro:
    'ستتوفر تفاصيل التواصل ونموذج طلب الشراكة في مرحلة لاحقة، بعد اعتماد بيانات التواصل الحالية وآلية الإرسال.',
  note: 'Full contact page (phone/email/form) stays blocked until the company confirms. Address is shown only in the footer, in a labelled review/demo state.',
  address: 'حي الصحافة، طريق أنس بن مالك، الرياض، المملكة العربية السعودية',
}
