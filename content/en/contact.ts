import type { ContactContent } from '~~/types/content'

// Phone, email and address are APPROVED for public display (owner
// decision, 2026-09-23 — docs/unresolved-content-approvals.md item 6),
// which replaces the earlier labelled review/demo state: the footer's
// "pending confirmation" badge was removed with that approval.
//
// Working hours were supplied by the owner in the same decision and have
// no other source in this project — do not edit them from a guess.
//
// The /contact page itself stays status: 'blocked'. The approval covers
// these detail fields, not the page's enquiry form, which still has no
// approved submission backend.
export const contactContent: ContactContent = {
  status: 'blocked',
  title: 'Contact Us',
  intro:
    'A partnership enquiry form is coming in a later phase, once a submission backend is approved. In the meantime, our phone, email and address are listed in the site footer.',
  note: 'Contact page form stays blocked pending a submission backend. Phone/email/address/hours are approved and rendered in the footer.',
  address: 'Sahafa District, Anas Ibn Malek Road, Riyadh, Saudi Arabia',
  phone: '+966 50 006 4807',
  email: 'info@binzomah.net',
  hours: 'Sunday – Thursday, 9:00 AM – 6:00 PM',
}
