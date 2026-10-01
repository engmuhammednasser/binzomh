<script setup lang="ts">
import { presentBrand } from '~~/content/brands/presentation'
import { brandsContent as brandsEn } from '~~/content/en/brands'
import { brandsContent as brandsAr } from '~~/content/ar/brands'

const { brands } = useManagedSite()

// A different slug must run lookup/404 handling again during client navigation.
definePageMeta({ key: route => route.path })

const route = useRoute()
const brand = computed(() => brands.value.find(brand => brand.slug === String(route.params.slug)))
if (!brand.value) throw createError({ statusCode: 404, statusMessage: 'Brand not found', fatal: import.meta.client })

const { locale } = useI18n()
const content = usePairedContent(brandsEn, brandsAr, 'brands')
const presentation = computed(() => presentBrand(brand.value!, locale.value === 'ar' ? 'ar' : 'en'))
usePageSeo(
  () => brand.value!.name,
  () => content.value.detail.description.replace('{brand}', brand.value!.name),
)
</script>

<template>
  <BrandsDetail
    :brand="presentation"
    :content="content"
  />
</template>
