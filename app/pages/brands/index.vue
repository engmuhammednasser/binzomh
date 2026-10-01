<script setup lang="ts">
import { brandsContent as brandsEn } from '~~/content/en/brands'
import { brandsContent as brandsAr } from '~~/content/ar/brands'

const { brands: brandProfiles } = useManagedSite()

const content = usePairedContent(brandsEn, brandsAr, 'brands')
usePageSeo(() => content.value.title, () => content.value.description)
</script>

<template>
  <div>
    <BrandsPortfolio
      :brands="brandProfiles"
      :content="content"
    />
    <BaseGallery page="brands" />
  </div>
</template>
