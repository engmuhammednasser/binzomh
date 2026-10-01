<script setup lang="ts">
import { networkContent as networkEn } from '~~/content/en/network'
import { networkContent as networkAr } from '~~/content/ar/network'

const content = usePairedContent(networkEn, networkAr, 'network')
usePageSeo(() => content.value.title, () => content.value.description)
</script>

<template>
  <div>
    <NetworkExperience :content="content" />
    <BaseGallery page="network" />
  </div>
</template>
