<script setup lang="ts">
import type { SiteImagePage } from '~~/types/images'

const { galleryFor } = useManagedSite()

/**
 * A page's free-form gallery (content/images.ts → pageGalleries). Renders
 * nothing at all while the page has no pictures, so adding the component
 * to a page changes nothing until the first picture is approved and
 * listed.
 *
 * Each picture has its own description: unlike the section visuals, a
 * gallery picture stands alone with no text beside it.
 */
const props = defineProps<{ page: SiteImagePage }>()

const { t } = useI18n()
const siteImage = useSiteImage()
const images = computed(() => galleryFor(props.page))
</script>

<template>
  <section
    v-if="images.length"
    class="gallery"
    :aria-labelledby="`gallery-${page}`"
  >
    <BaseContainer>
      <h2
        :id="`gallery-${page}`"
        class="text-h3 gallery__heading"
      >
        {{ t('common.gallery') }}
      </h2>
      <ul class="gallery__grid">
        <li
          v-for="image in images"
          :key="image.id"
          class="gallery__item media-frame"
        >
          <picture>
            <source
              v-for="source in siteImage.sources(image)"
              :key="source.type"
              :type="source.type"
              :srcset="source.srcset"
              sizes="(max-width: 639px) calc(100vw - 2.5rem), (max-width: 1023px) 50vw, 380px"
            >
            <img
              :src="siteImage.src(image)"
              :width="image.width"
              :height="image.height"
              :alt="siteImage.alt(image)"
              loading="lazy"
              decoding="async"
            >
          </picture>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>

<style scoped>
.gallery {
  padding-block: var(--space-section);
}

.gallery__heading {
  margin-block-end: var(--space-6);
}

.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
  gap: clamp(var(--space-4), 2vw, var(--space-5));
  margin: 0;
  padding: 0;
  list-style: none;
}

/* One consistent frame for every picture, whatever its own proportions,
   so a mixed set still reads as a grid. */
.gallery__item {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--color-bg-raised);
}

.gallery__item img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}
</style>
