import type { SocialPlatform } from '../../../types/content'

/**
 * Validation for the dashboard's contact-details form. Kept here, apart
 * from the component, so the rules are unit-tested
 * (tests/admin-contact-validation.test.mjs) and can move unchanged into a
 * server endpoint once saving exists — where they must be enforced again,
 * since a browser check is never the security boundary.
 *
 * Each validator returns null when the value is acceptable, or an error
 * code the form translates (admin.contactInfo.errors.*).
 */
export type ContactFieldError = 'required' | 'phone' | 'email' | 'url' | 'host'

export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = ['linkedin', 'instagram', 'x', 'facebook', 'tiktok', 'youtube']

/** The site each profile must live on. X accepts its old domain too. */
export const SOCIAL_HOSTS: Record<SocialPlatform, readonly string[]> = {
  linkedin: ['linkedin.com'],
  instagram: ['instagram.com'],
  x: ['x.com', 'twitter.com'],
  facebook: ['facebook.com'],
  tiktok: ['tiktok.com'],
  youtube: ['youtube.com'],
}

/**
 * The dialable form of a display number: "+" and digits only. The site
 * derives its tel: link the same way (ContactExperience.vue, AppFooter.vue),
 * so what the form previews is what the page will dial.
 */
export function dialable(phone: string) {
  return phone.replace(/[^\d+]/g, '')
}

export function validatePhone(value: string): ContactFieldError | null {
  if (!value.trim()) return 'required'
  // Only digits, spaces, dashes, dots, brackets and one leading "+" may be
  // typed; 8–15 digits is E.164's range once the formatting is dropped.
  if (!/^\+?[\d\s\-().]+$/.test(value.trim())) return 'phone'
  const digits = dialable(value).replace('+', '')
  return digits.length >= 8 && digits.length <= 15 ? null : 'phone'
}

export function validateEmail(value: string): ContactFieldError | null {
  if (!value.trim()) return 'required'
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? null : 'email'
}

export function validateRequired(value: string): ContactFieldError | null {
  return value.trim() ? null : 'required'
}

/**
 * An empty profile field is valid — it hides that platform. Anything
 * else must be an absolute https:// URL on the platform's own domain, so a
 * typo or a pasted link to another site cannot end up behind the
 * platform's name in the footer.
 */
export function validateSocialUrl(platform: SocialPlatform, value: string): ContactFieldError | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  let url: URL
  try {
    url = new URL(trimmed)
  }
  catch {
    return 'url'
  }
  if (url.protocol !== 'https:' || url.username || url.password) return 'url'
  const host = url.hostname.toLowerCase()
  const allowed = SOCIAL_HOSTS[platform]
  return allowed.some(domain => host === domain || host.endsWith(`.${domain}`)) ? null : 'host'
}
