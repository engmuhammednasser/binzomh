<script setup lang="ts">
import { contactContent as contactEn } from '~~/content/en/contact'
import { contactContent as contactAr } from '~~/content/ar/contact'

const content = usePairedContent(contactEn, contactAr)
usePageSeo(() => content.value.title, () => content.value.intro)
</script>

<template>
  <ContactExperience :content="content" />
</template>
