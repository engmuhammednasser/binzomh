import assert from 'node:assert/strict'
import test from 'node:test'
import { existsSync } from 'node:fs'
import { assessImageFit, describeRatio, MAX_IMAGE_BYTES, validateImageFile } from '../layers/admin/utils/image-validation.ts'
import { pageGalleries, siteImageSlots } from '../content/images.ts'
import { imageFormatPath, imageSources, imageSrcset, imageVariantPath } from '../shared/utils/site-image.ts'

test('replacement files: raster formats only, within the size cap', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/avif']) assert.equal(validateImageFile({ type, size: 1000 }), null, type)
  for (const type of ['image/svg+xml', 'image/gif', 'text/html', '']) assert.equal(validateImageFile({ type, size: 1000 }), 'type', type)
  assert.equal(validateImageFile({ type: 'image/jpeg', size: MAX_IMAGE_BYTES + 1 }), 'size')
})

test('fit: upscaling and cropping are flagged against the slot', () => {
  const slot = { width: 1672, height: 941 }
  assert.deepEqual(assessImageFit({ width: 1920, height: 1080 }, slot, 1440), { tooSmall: false, minWidth: 1440, cropped: false })
  assert.equal(assessImageFit({ width: 1200, height: 675 }, slot, 1440).tooSmall, true)
  assert.equal(assessImageFit({ width: 2000, height: 2000 }, slot, 1440).cropped, true)
  // No derivatives: the frame's own width is the bar.
  assert.equal(assessImageFit({ width: 1400, height: 1050 }, { width: 1448, height: 1086 }).tooSmall, true)
  assert.equal(describeRatio(1672, 941), '16:9')
  assert.equal(describeRatio(1122, 1402), '4:5')
  assert.equal(describeRatio(1000, 370), '2.70:1')
})

test('every slot image, each copy and derivative it declares, and every gallery picture exists in public/', () => {
  for (const slot of Object.values(siteImageSlots)) {
    if (!slot.image) continue
    assert.ok(existsSync(`public${slot.image.src}`), slot.image.src)
    for (const format of slot.image.formats) {
      const path = imageFormatPath(slot.image, format)
      assert.ok(existsSync(`public${path}`), path)
    }
    for (const format of slot.image.variants?.formats ?? []) {
      for (const width of slot.image.variants.widths) {
        const path = imageVariantPath(slot.image, width, format)
        assert.ok(existsSync(`public${path}`), path)
      }
    }
  }
  for (const [page, pictures] of Object.entries(pageGalleries)) {
    for (const picture of pictures) {
      assert.ok(existsSync(`public${picture.src}`), `${page}: ${picture.src}`)
      for (const format of picture.formats ?? []) assert.ok(existsSync(`public${imageFormatPath(picture, format)}`), `${page}: ${picture.id} ${format}`)
      assert.ok(picture.alt.en.trim() && picture.alt.ar.trim(), `${page}: ${picture.id} needs a description in both languages`)
    }
  }
})

test('WebP is the main format: every slot image offers it first, at its own full size', () => {
  for (const slot of Object.values(siteImageSlots)) {
    if (!slot.image) continue
    const sources = imageSources('/', slot.image)
    assert.equal(sources[0]?.type, 'image/webp', `${slot.id}: WebP must be the first source`)
    assert.ok(sources[0].srcset.endsWith(`${imageFormatPath(slot.image, 'webp')} ${slot.image.width}w`), `${slot.id}: the full-size WebP must be offered`)
  }
  // Derivatives first, then the full-size copy; a format with no full-size copy offers only its derivatives.
  assert.equal(
    imageSrcset('/binzomh/', siteImageSlots['home-hero'].image, 'webp'),
    '/binzomh/images/home/hero-960.webp 960w, /binzomh/images/home/hero-1440.webp 1440w, /binzomh/images/home/hero.webp 1672w',
  )
  assert.equal(
    imageSrcset('/binzomh/', siteImageSlots['home-hero'].image, 'avif'),
    '/binzomh/images/home/hero-960.avif 960w, /binzomh/images/home/hero-1440.avif 1440w',
  )
  assert.deepEqual(imageSources('/', siteImageSlots['about-hero'].image), [{ type: 'image/webp', srcset: '/images/about/hero-480.webp 480w, /images/about/hero-960.webp 960w, /images/about/hero.webp 1448w' }])
  // An image with no modern copies ships the original alone.
  assert.deepEqual(imageSources('/', { src: '/images/x.png', width: 800, formats: [] }), [])
})

test('slots are independent: no two share an image object, and each id is unique to its page', () => {
  const slots = Object.values(siteImageSlots)
  const images = slots.map(slot => slot.image).filter(Boolean)
  assert.equal(new Set(images).size, images.length, 'slots on the same file must hold separate copies')
  for (const [key, slot] of Object.entries(siteImageSlots)) assert.equal(slot.id, key)
  // The three places the first capabilities photo appears are three slots.
  const onFirstPhoto = slots.filter(slot => slot.image?.src === '/images/home/capabilities-1.png').map(slot => slot.id)
  assert.deepEqual(onFirstPhoto, ['home-capabilities-1', 'capabilities-hero', 'capabilities-section-1'])
})
