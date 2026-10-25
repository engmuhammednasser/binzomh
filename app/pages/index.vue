<script setup lang="ts">
import { homeContent as homeEn } from '~~/content/en/home'
import { homeContent as homeAr } from '~~/content/ar/home'

const { brands, logoBrands, galleryFor } = useManagedSite()
const galleryImages = computed(() => galleryFor('home'))
const homeBrandCandidates = computed(() => brands.value.map(({ slug, name, status, logo }) => ({ slug, name, status, logo })))

const content = usePairedContent(homeEn, homeAr, 'home')

// H06 (metrics) is intentionally not rendered — every candidate figure is
// blocked for public display; see docs/unresolved-content-approvals.md
// item 5 and types/content.ts's note on HomeContent.
usePageSeo(() => content.value.hero.headline, () => content.value.hero.description)
</script>

<template>
  <div class="page-home">
    <HomeHero :content="content.hero" />
    <HomeBrands
      :content="content.brands"
      :brands="homeBrandCandidates"
      :logos="logoBrands"
    />
    <HomeAbout :content="content.about" />
    <HomeCapabilities :content="content.capabilities" />
    <HomeNetwork :content="content.network" />
    <BaseGallery
      page="home"
      :images="galleryImages"
    />
    <HomePartnershipCta :content="content.partnership" />
  </div>
</template>
