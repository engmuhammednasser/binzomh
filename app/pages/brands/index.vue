<script setup lang="ts">
import { brandProfiles } from '~~/content/brands'
import { brandsContent as brandsEn } from '~~/content/en/brands'
import { brandsContent as brandsAr } from '~~/content/ar/brands'

const content = usePairedContent(brandsEn, brandsAr)
usePageSeo(() => content.value.title, () => content.value.description)
</script>

<template>
  <BrandsPortfolio
    :brands="brandProfiles"
    :content="content"
  />
</template>
