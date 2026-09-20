import type { ContactContent } from '~~/types/content'

// Address / phone / email are intentionally left unset. The source register
// marks these as SOURCED-but-not-company-confirmed — do not publish them
// even as a placeholder. See docs/unresolved-content-approvals.md.
export const contactContent: ContactContent = {
  status: 'blocked',
  title: 'Contact Us',
  intro:
    'Contact details and a partnership enquiry form are coming in a later phase, once current contact information and a submission backend are approved.',
  note: 'Do not add address/phone/email here until the company confirms they are current and approved for public display.',
}
