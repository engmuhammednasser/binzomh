import type { InjectionKey } from 'vue'
import type { SocialPlatform } from '~~/types/content'
import {
  SOCIAL_PLATFORMS,
  validateEmail,
  validatePhone,
  validateRequired,
  validateSocialUrl,
  type ContactFieldError,
} from '#shared/utils/contact-validation'

export interface ContactInfoDraft {
  phone: string
  email: string
  addressEn: string
  addressAr: string
  hoursEn: string
  hoursAr: string
  social: Record<SocialPlatform, string>
}

export function useAdminContactInfo() {
  const { draft: workspace, state: baseline } = useAdminWorkspace()
  const draft = reactive({
    phone: useAdminCopyField('contact', 'phone', 'en'),
    email: useAdminCopyField('contact', 'email', 'en'),
    addressEn: useAdminCopyField('contact', 'address', 'en'),
    addressAr: useAdminCopyField('contact', 'address', 'ar'),
    hoursEn: useAdminCopyField('contact', 'hours', 'en'),
    hoursAr: useAdminCopyField('contact', 'hours', 'ar'),
    social: computed(() => workspace.value!.social),
  })
  // Phone/email are shared business details; keep their localized copies aligned.
  watch(() => [draft.phone, draft.email], () => {
    for (const field of ['phone', 'email'] as const) {
      const row = workspace.value?.copy.contact.find(row => row.path === field)
      if (row) row.ar = draft[field]
    }
  }, { flush: 'sync' })
  const original = computed<ContactInfoDraft>(() => {
    const get = (path: string, lang: 'en' | 'ar') => baseline.value?.draft.copy.contact.find(row => row.path === path)?.[lang] ?? ''
    return { phone: get('phone', 'en'), email: get('email', 'en'), addressEn: get('address', 'en'), addressAr: get('address', 'ar'), hoursEn: get('hours', 'en'), hoursAr: get('hours', 'ar'), social: baseline.value!.draft.social }
  })

  const errors = computed(() => {
    const out: Partial<Record<string, ContactFieldError>> = {
      phone: validatePhone(draft.phone) ?? undefined,
      email: validateEmail(draft.email) ?? undefined,
      addressEn: validateRequired(draft.addressEn) ?? undefined,
      addressAr: validateRequired(draft.addressAr) ?? undefined,
      hoursEn: validateRequired(draft.hoursEn) ?? undefined,
      hoursAr: validateRequired(draft.hoursAr) ?? undefined,
    }
    for (const platform of SOCIAL_PLATFORMS) {
      out[`social.${platform}`] = validateSocialUrl(platform, draft.social[platform]) ?? undefined
    }
    return out
  })

  const changedFields = computed(() => {
    const scalar = (['phone', 'email', 'addressEn', 'addressAr', 'hoursEn', 'hoursAr'] as const)
      .filter(key => draft[key].trim() !== original.value[key].trim())
    const social = SOCIAL_PLATFORMS
      .filter(platform => draft.social[platform].trim() !== original.value.social[platform].trim())
      .map(platform => `social.${platform}`)
    return [...scalar, ...social]
  })

  const hasErrors = computed(() => Object.values(errors.value).some(Boolean))

  const state = { draft, original, errors, changedFields, hasErrors }
  // The page owns the state; its form sections and preview inject it
  // rather than each receiving (and mutating) the draft as a prop.
  provide(CONTACT_INFO_KEY, state)
  return state
}

type ContactInfoState = ReturnType<typeof useAdminContactInfo>
const CONTACT_INFO_KEY: InjectionKey<ContactInfoState> = Symbol('admin-contact-info')

/** For the page's child sections: the state the page created. */
export function useAdminContactInfoContext() {
  const state = inject(CONTACT_INFO_KEY)
  if (!state) throw new Error('useAdminContactInfoContext() must be used inside the contact-info page')
  return state
}

/** Platform names are brand names, written the same in both locales. */
export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}
