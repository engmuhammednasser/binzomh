import type { BrandField, BrandProfile } from '../../types/brands'
import type { LocaleCode } from '../../types/content'

function approved<T>(field: BrandField<T> | undefined, locale: LocaleCode): T | undefined {
  return field?.status === 'approved' ? field.content?.[locale] : undefined
}

/** Missing translations never fall back to unapproved or other-locale claims. */
export function presentBrand(brand: BrandProfile, locale: LocaleCode) {
  const image = approved(brand.image, locale)
  return {
    slug: brand.slug,
    name: brand.name,
    introduction: approved(brand.introduction, locale)?.trim() || undefined,
    relationship: approved(brand.relationship, locale)?.trim() || undefined,
    image: image?.src.startsWith('/images/brands/') && image.alt.trim()
      && image.width > 0 && image.height > 0
      ? image
      : undefined,
    ranges: (approved(brand.ranges, locale) || []).filter(range => range.name.trim()),
  }
}

export type BrandPresentation = ReturnType<typeof presentBrand>
