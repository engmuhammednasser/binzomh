import assert from 'node:assert/strict'
import test from 'node:test'
import { pendingBrandFields } from '../layers/admin/utils/brand-review.ts'

function readyBrand() {
  const image = { src: '/images/brands/test.jpg', alt: 'Test', width: 800, height: 1000 }
  return {
    slug: 'test', name: 'Test', status: 'approved',
    introduction: { status: 'approved', content: { en: 'Introduction', ar: 'تعريف' } },
    relationship: { status: 'approved', content: { en: 'Relationship', ar: 'علاقة' } },
    image: { status: 'approved', content: { en: { ...image }, ar: { ...image } } },
    ranges: { status: 'approved', content: { en: [{ name: 'Range' }], ar: [{ name: 'مجموعة' }] } },
  }
}

test('dashboard readiness requires approved, usable content in both languages', () => {
  const brand = readyBrand()
  assert.deepEqual(pendingBrandFields(brand), [])
  delete brand.introduction.content.ar
  brand.relationship.status = 'draft'
  brand.image.content.ar.alt = ' '
  brand.ranges.content.en = [{ name: ' ' }]
  assert.deepEqual(pendingBrandFields(brand), ['introduction', 'relationship', 'image', 'ranges'])
})

test('dashboard readiness handles missing records and does not change editorial data', () => {
  const brand = readyBrand()
  delete brand.image
  brand.introduction.status = 'blocked'
  const before = structuredClone(brand)
  assert.deepEqual(pendingBrandFields(brand), ['introduction', 'image'])
  assert.deepEqual(brand, before)
  assert.deepEqual(pendingBrandFields({ slug: 'empty', name: 'Empty', status: 'draft' }), [
    'introduction', 'relationship', 'image', 'ranges',
  ])
})
