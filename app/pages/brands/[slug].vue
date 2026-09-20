<script setup lang="ts">
import { findBrand } from '~~/content/brands'
import { presentBrand } from '~~/content/brands/presentation'
import { brandsContent as brandsEn } from '~~/content/en/brands'
import { brandsContent as brandsAr } from '~~/content/ar/brands'

// A different slug must run lookup/404 handling again during client navigation.
definePageMeta({ key: route => route.path })

const route = useRoute()
const brand = findBrand(String(route.params.slug))
if (!brand) throw createError({ statusCode: 404, statusMessage: 'Brand not found', fatal: import.meta.client })

const { locale } = useI18n()
const content = usePairedContent(brandsEn, brandsAr)
const presentation = computed(() => presentBrand(brand, locale.value === 'ar' ? 'ar' : 'en'))
usePageSeo(
  () => brand.name,
  () => content.value.detail.description.replace('{brand}', brand.name),
)
</script>

<template>
  <BrandsDetail
    :brand="presentation"
    :content="content"
  />
</template>
