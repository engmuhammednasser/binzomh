import type { ContactContent } from '~~/types/content'

// Phone / email stay unset. Address is populated below, but per
// docs/unresolved-content-approvals.md item 6 it is
// SOURCE-CONFIRMED-FROM-PROFILE / PENDING CURRENT COMPANY CONFIRMATION —
// "not approved production contact data," shown only in a clearly labelled
// review/demo state. AppFooter.vue renders it with a permanent "pending
// confirmation" badge for exactly that reason; that badge must not be
// removed until the company confirms the address is current and approved
// for public display. Do not add phone/email here at all — the doc's
// review/demo exception was granted for the address specifically, not
// blanket contact details.
export const contactContent: ContactContent = {
  status: 'blocked',
  title: 'Contact Us',
  intro:
    'Contact details and a partnership enquiry form are coming in a later phase, once current contact information and a submission backend are approved.',
  note: 'Full contact page (phone/email/form) stays blocked until the company confirms. Address is shown only in the footer, in a labelled review/demo state — see the file-level comment above.',
  address: 'Sahafa District, Anas Ibn Malek Road, Riyadh, Saudi Arabia',
}
