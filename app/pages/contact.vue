<script setup lang="ts">
import { contactContent as contactEn } from '~~/content/en/contact'
import { contactContent as contactAr } from '~~/content/ar/contact'

const { galleryFor } = useManagedSite()
const galleryImages = computed(() => galleryFor('contact'))

const content = usePairedContent(contactEn, contactAr, 'contact')
usePageSeo(() => content.value.title, () => content.value.intro)
</script>

<template>
  <div>
    <ContactExperience :content="content" />
    <BaseGallery
      page="contact"
      :images="galleryImages"
    />
  </div>
</template>
