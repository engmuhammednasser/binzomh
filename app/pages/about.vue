<script setup lang="ts">
import { aboutContent as aboutEn } from '~~/content/en/about'
import { aboutContent as aboutAr } from '~~/content/ar/about'

const content = usePairedContent(aboutEn, aboutAr)
usePageSeo(() => content.value.hero.heading, () => content.value.hero.intro)
</script>

<template>
  <div class="page-about">
    <!--
      Section order also sets the surface rhythm, alternating so no two
      adjacent sections share a background:
      Hero (base) → Overview (alt) → Location (base) → Story (alt) →
      Vision & Mission (inverse) → Strategies (base) → Leadership (alt) →
      closing (base). Moving Location between Overview and Story is what
      keeps that alternation intact; dropping it in elsewhere puts two
      identical surfaces back-to-back.
    -->
    <AboutHero :content="content.hero" />
    <AboutOverview :content="content.overview" />
    <AboutLocation :content="content.location" />
    <AboutStory :content="content.story" />
    <AboutVisionMission :content="content.visionMission" />
    <AboutStrategies :content="content.strategies" />
    <AboutLeadership :content="content.leadership" />

    <section
      v-if="content.cta"
      class="about-closing"
    >
      <BaseContainer
        content
        class="about-closing__inner"
      >
        <MotionReveal>
          <BaseButton
            :to="content.cta.to"
            variant="secondary"
          >
            {{ content.cta.label }}
          </BaseButton>
        </MotionReveal>
      </BaseContainer>
    </section>
  </div>
</template>

<style scoped>
.about-closing {
  padding-block-end: var(--space-section);
}

.about-closing__inner {
  display: flex;
  justify-content: center;
}
</style>
