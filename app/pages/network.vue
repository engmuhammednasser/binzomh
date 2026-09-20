<script setup lang="ts">
import { networkContent as networkEn } from '~~/content/en/network'
import { networkContent as networkAr } from '~~/content/ar/network'

const content = usePairedContent(networkEn, networkAr)
usePageSeo(() => content.value.title, () => content.value.description)
</script>

<template>
  <NetworkExperience :content="content" />
</template>
