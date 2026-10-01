import type { BrandProfile } from '../../../types/brands'
import { presentBrand } from '../../../content/brands/presentation.ts'

export const brandReviewFields = ['introduction', 'relationship', 'image', 'ranges'] as const
export type BrandReviewField = typeof brandReviewFields[number]

/** A field is ready only when its approved content can render in both locales. */
export function pendingBrandFields(brand: BrandProfile) {
  const views = [presentBrand(brand, 'en'), presentBrand(brand, 'ar')]
  return brandReviewFields.filter(field => views.some(view =>
    field === 'ranges' ? !view.ranges.length : !view[field],
  ))
}
