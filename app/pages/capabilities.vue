<script setup lang="ts">
import { capabilitiesContent as capabilitiesEn } from '~~/content/en/capabilities'
import { capabilitiesContent as capabilitiesAr } from '~~/content/ar/capabilities'

const { galleryFor } = useManagedSite()
const galleryImages = computed(() => galleryFor('capabilities'))

const content = usePairedContent(capabilitiesEn, capabilitiesAr, 'capabilities')
usePageSeo(() => content.value.hero.heading, () => content.value.hero.intro)
</script>

<template>
  <div class="page-capabilities">
    <CapabilitiesHero :content="content.hero" />
    <CapabilitiesSection
      v-for="(item, index) in content.sections"
      :key="item.id"
      :item="item"
      :index="index"
    />
    <BaseGallery
      page="capabilities"
      :images="galleryImages"
    />
    <CapabilitiesClosingCta :content="content.closing" />
  </div>
</template>
