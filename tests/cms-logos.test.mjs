import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync } from 'node:fs'
import { siteLogos } from '../content/logos.ts'
import { brandProfiles, logoOnlyBrands } from '../content/brands/index.ts'
import { homeContent as homeEn } from '../content/en/home.ts'
import { homeContent as homeAr } from '../content/ar/home.ts'
import { networkContent as networkEn } from '../content/en/network.ts'
import { networkContent as networkAr } from '../content/ar/network.ts'
import { applyLogos } from '../shared/utils/cms-logos.ts'

test('every logo the site shows is listed once, under its approved file', () => {
  const shown = [
    ...brandProfiles.map(brand => brand.logo),
    ...[networkEn, networkAr].flatMap(content => content.partners.names.map(partner => partner.logo)),
    ...[homeEn, homeAr].flatMap(content => (content.network.logos ?? []).map(entry => entry.logo)),
    ...logoOnlyBrands.map(brand => brand.logo),
  ].filter(Boolean)
  const ids = siteLogos.map(logo => logo.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const logo of shown) assert.ok(ids.includes(logo.src), logo.src)
  for (const logo of siteLogos) {
    assert.equal(logo.file.src, logo.id)
    assert.ok(existsSync(`public${logo.id}`), logo.id)
  }
})

test('a replacement reaches every copy of its logo and nothing else', () => {
  const replacement = { src: '/images/admin/0f0e.webp', width: 320, height: 160 }
  const source = {
    brand: { name: 'Zoa', logo: { src: '/logos/brands/zoa.png', width: 1365, height: 667 } },
    wall: [{ name: 'Nahdi', logo: { src: '/logos/partners/nahdi.png', width: 160, height: 160 } }],
    marquee: [{ name: 'Nahdi', logo: { src: '/logos/partners/nahdi.png', width: 160, height: 160 } }],
    photo: { src: '/images/home/hero.png', width: 1672, height: 941 },
  }
  const result = applyLogos(source, {
    '/logos/brands/zoa.png': source.brand.logo,
    '/logos/partners/nahdi.png': replacement,
  })
  assert.deepEqual(result.brand, source.brand)
  assert.deepEqual(result.wall[0].logo, replacement)
  assert.deepEqual(result.marquee[0].logo, replacement)
  assert.equal(result.wall[0].name, 'Nahdi')
  assert.deepEqual(result.photo, source.photo)
  assert.equal(source.wall[0].logo.src, '/logos/partners/nahdi.png', 'source is not mutated')
})

test('with nothing replaced, content is returned untouched', () => {
  const source = { logo: { src: '/logos/brands/zoa.png', width: 1, height: 1 } }
  assert.equal(applyLogos(source, { '/logos/brands/zoa.png': { src: '/logos/brands/zoa.png', width: 1, height: 1 } }), source)
  assert.equal(applyLogos(source, undefined), source)
})
