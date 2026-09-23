import type { SocialLink } from '~~/types/content'

// Locale-neutral, like content/brands: the same profile URLs serve /en and
// /ar, so there is no per-locale copy of this list to keep in sync.
//
// INTENTIONALLY EMPTY. docs/unresolved-content-approvals.md item 6 records
// "@Binzomah Cosmetics" with no identified platform, and the owner
// confirmed on 2026-09-23 that no official profile URLs are ready yet.
// AppFooter renders its "Follow Us" block only when this array is
// non-empty, so the footer degrades cleanly until then.
//
// To go live, add one entry per confirmed profile, e.g.
//   { platform: 'linkedin', url: 'https://www.linkedin.com/company/…' }
// Use the exact URL the company supplies — never construct one from a
// handle, and never guess the platform.
export const socialLinks: SocialLink[] = []
