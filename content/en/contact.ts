import type { ContactContent } from '~~/types/content'

// Phone, email and address are APPROVED for public display (owner
// decision, 2026-09-23 — docs/unresolved-content-approvals.md item 6), and
// working hours were supplied in the same decision. They are rendered here
// as well as in the footer; the intro used to point readers to the footer
// instead, which was the page's real problem.
//
// status stays 'blocked' because the enquiry form's destination is a
// per-environment setting (NUXT_PUBLIC_CONTACT_FORM_ENDPOINT) rather than
// an approved part of this content. With no endpoint the page shows
// formUnavailable in the form's place.
export const contactContent: ContactContent = {
  status: 'blocked',
  eyebrow: 'Contact',
  title: 'Talk to Binzomah',
  intro:
    'Speak with our team about distribution in Saudi Arabia — by phone, by email, or through the enquiry form.',
  note: 'Form destination is environment configuration, not approved content. Phone/email/address/hours are approved (item 6) and now render on this page as well as in the footer.',

  detailsHeading: 'Contact details',
  formHeading: 'Send an enquiry',
  formBody:
    'Tell us about your brand or your business, and the team will come back to you.',
  formUnavailable:
    'The enquiry form is being connected. In the meantime, please call or email us using the details on this page.',

  address: 'Sahafa District, Anas Ibn Malek Road, Riyadh, Saudi Arabia',
  phone: '+966 50 006 4807',
  email: 'info@binzomah.net',
  hours: 'Sunday – Thursday, 9:00 AM – 6:00 PM',
}
