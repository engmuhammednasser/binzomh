<script setup lang="ts">
import { capabilitiesContent as capabilitiesEn } from '~~/content/en/capabilities'
import { capabilitiesContent as capabilitiesAr } from '~~/content/ar/capabilities'

const content = usePairedContent(capabilitiesEn, capabilitiesAr)
usePageSeo(() => content.value.hero.heading, () => content.value.hero.intro)
</script>

<template>
  <div class="page-capabilities">
    <CapabilitiesHero :content="content.hero" />
    <CapabilitiesSection
      v-for="(item, index) in content.sections"
      :key="item.number"
      :item="item"
      :index="index"
    />
    <CapabilitiesClosingCta :content="content.closing" />
  </div>
</template>
