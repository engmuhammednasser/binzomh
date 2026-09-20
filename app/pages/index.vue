<script setup lang="ts">
import { homeContent as homeEn } from '~~/content/en/home'
import { homeContent as homeAr } from '~~/content/ar/home'
import { homeBrandCandidates } from '~~/content/brands'

const content = usePairedContent(homeEn, homeAr)

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
    />
    <HomeAbout :content="content.about" />
    <HomeCapabilities :content="content.capabilities" />
    <HomeNetwork :content="content.network" />
    <HomePartnershipCta :content="content.partnership" />
  </div>
</template>
