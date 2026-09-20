import assert from 'node:assert/strict'
import test from 'node:test'
import { brandProfiles, findBrand, homeBrandCandidates } from '../content/brands/index.ts'
import { presentBrand } from '../content/brands/presentation.ts'
import { brandsContent as brandsEn } from '../content/en/brands.ts'
import { brandsContent as brandsAr } from '../content/ar/brands.ts'
import { networkContent as networkEn } from '../content/en/network.ts'
import { networkContent as networkAr } from '../content/ar/network.ts'

test('only the working roster resolves; homepage and detail identities stay aligned', () => {
  assert.deepEqual(brandProfiles.map(({ slug, name }) => [slug, name]), [
    ['embryolisse', 'Embryolisse'], ['zoa', 'Zoā'], ['rvb-lab', 'RVB LAB'],
  ])
  assert.deepEqual(homeBrandCandidates.map(brand => brand.slug), brandProfiles.map(brand => brand.slug))
  for (const brand of brandProfiles) assert.equal(findBrand(brand.slug), brand)
  for (const slug of ['', 'unknown', 'constructor', 'toString', 'Embryolisse']) assert.equal(findBrand(slug), undefined)
})

test('record approval cannot publish draft, blocked or missing brand fields', () => {
  for (const status of ['draft', 'blocked', 'missing']) {
    const record = {
      slug: 'fixture', name: 'Test fixture', status: 'approved',
      introduction: { status, content: { en: 'UNAPPROVED INTRO' } },
      relationship: { status, content: { en: 'UNAPPROVED RELATIONSHIP' } },
      image: { status, content: { en: { src: '/images/brands/unapproved.jpg', alt: 'Unapproved', width: 800, height: 1000 } } },
      ranges: { status, content: { en: [{ name: 'UNAPPROVED RANGE' }] } },
    }
    assert.deepEqual(presentBrand(record, 'en'), {
      slug: 'fixture', name: 'Test fixture', introduction: undefined, relationship: undefined, image: undefined, ranges: [],
    })
  }
})

test('approved fields are independent, locale-specific and never inferred from reference copy', () => {
  const image = { src: '/images/brands/fixture.jpg', alt: 'Approved test image', width: 800, height: 1000 }
  const fixture = {
    slug: 'fixture', name: 'Test fixture', status: 'draft',
    introduction: { status: 'approved', content: { en: 'Approved test introduction' } },
    relationship: { status: 'blocked', content: { en: 'Reference relationship' } },
    image: { status: 'approved', content: { en: image } },
    ranges: { status: 'approved', content: { en: [{ name: 'Approved test category' }] } },
  }
  const en = presentBrand(fixture, 'en')
  assert.equal(en.introduction, 'Approved test introduction')
  assert.equal(en.relationship, undefined)
  assert.deepEqual(en.image, image)
  assert.equal(en.ranges.length, 1)
  const ar = presentBrand(fixture, 'ar')
  assert.equal(ar.introduction, undefined)
  assert.equal(ar.image, undefined)
  assert.deepEqual(ar.ranges, [])
  fixture.introduction.content.en = '   '
  fixture.image.content.en.alt = ''
  fixture.ranges.content.en = [{ name: ' ' }]
  assert.equal(presentBrand(fixture, 'en').introduction, undefined)
  assert.equal(presentBrand(fixture, 'en').image, undefined)
  assert.deepEqual(presentBrand(fixture, 'en').ranges, [])
})

function shape(value) {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, shape(item)]))
  assert.notEqual(value, '', 'Page copy must not contain empty strings')
  return typeof value
}

test('EN/AR page copy and channel anchors have matching structures', () => {
  assert.deepEqual(shape(brandsAr), shape(brandsEn))
  assert.deepEqual(shape(networkAr), shape(networkEn))
  assert.deepEqual(networkEn.channels.map(channel => channel.id), ['pharmacies', 'e-commerce', 'hospitals', 'wholesale', 'cosmetics-stores'])
  assert.deepEqual(networkAr.channels.map(channel => channel.id), networkEn.channels.map(channel => channel.id))
  assert.deepEqual(networkEn.partners.names, [])
  assert.deepEqual(networkAr.partners.names, [])
  for (const brand of brandProfiles) {
    for (const locale of ['en', 'ar']) {
      const view = presentBrand(brand, locale)
      assert.equal(view.image, undefined)
      assert.equal(view.relationship, undefined)
      assert.equal(view.introduction, undefined)
      assert.deepEqual(view.ranges, [])
    }
  }
})
