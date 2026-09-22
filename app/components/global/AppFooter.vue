<script setup lang="ts">
import { contactContent as contactEn } from '~~/content/en/contact'
import { contactContent as contactAr } from '~~/content/ar/contact'
import { homeContent as homeEn } from '~~/content/en/home'
import { homeContent as homeAr } from '~~/content/ar/home'
import { homeBrandCandidates } from '~~/content/brands'

const { t } = useI18n()
const localePath = useLocalePath()
const siteName = useSiteName()
const navItems = useNavItems()
const year = new Date().getFullYear()

// Same roster the homepage Brands section already renders publicly
// (content/brands, per docs/unresolved-content-approvals.md item 2 —
// "may appear as portfolio material in N02 design placeholders"). Text
// names only, routed to their real /brands/[slug] pages — no logos (item
// 1 blocks those) and nothing here that isn't already live elsewhere on
// the site.
const brandLinks = homeBrandCandidates

// Address only — see content/en/contact.ts for why: it's the one field
// docs/unresolved-content-approvals.md item 6 grants a labelled
// review/demo exception for. Phone/email/social/hours have no such
// exception (hours and social have no sourced data at all), so none of
// them appear here.
const contact = usePairedContent(contactEn, contactAr)

// The footer's longer description reuses the homepage About section's own
// body copy (content/en/home.ts / content/ar/home.ts) rather than a
// second, separately-maintained copy of the same sentence in i18n — one
// approved source of truth, so the two can't drift out of sync if that
// copy is ever revised.
const home = usePairedContent(homeEn, homeAr)
</script>

<template>
  <footer class="app-footer">
    <MotionZDivider />
    <div class="app-footer__surface surface-inverse">
      <BaseContainer class="app-footer__inner">
        <!--
          Deliberately not a recolored copy of AppHeader: the header is one
          horizontal row (logo, inline nav, CTA, language switcher). This is
          a four-column "mega footer" block — brand+tagline+description, a
          vertical nav list under "Explore", the brand portfolio under
          "Our Brands", and the address under "Our Location" — followed by
          a separate legal bar with the copyright and language switcher
          moved down here, away from the brand mark, so the two don't read
          as the same layout with an inverted color scheme. navItems and
          brandLinks both come from the same shared sources the rest of the
          site uses (useNavItems(), content/brands) — only the presentation
          differs here, nothing is a new or separately-maintained list.

          The address carries a permanent, visible "pending confirmation"
          badge — see content/en/contact.ts. That's not a generic UI
          affordance to reuse elsewhere; it exists because this one field
          is explicitly source-confirmed-but-not-company-approved per
          docs/unresolved-content-approvals.md item 6, which permits
          showing it only in a clearly labelled review/demo state. Do not
          add phone, email, working hours, or social links here — none of
          those have that same exception (hours and social have no
          sourced data anywhere in this project at all).
        -->
        <div class="app-footer__grid">
          <div class="app-footer__brand-col">
            <NuxtLink
              :to="localePath('/')"
              class="app-footer__brand"
            >
              <BaseLogo
                variant="light"
                size="1.875rem"
              />
            </NuxtLink>
            <p class="text-small app-footer__tagline">
              {{ t('footer.tagline') }}
            </p>
            <p class="text-small app-footer__description">
              {{ home.about.body }}
            </p>
          </div>

          <nav
            class="app-footer__nav"
            :aria-label="t('nav.mainNavigation')"
          >
            <p class="text-label app-footer__nav-heading">
              {{ t('footer.explore') }}
            </p>
            <NuxtLink
              v-for="item in navItems"
              :key="item.to"
              :to="localePath(item.to)"
              class="app-footer__link"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <nav
            class="app-footer__nav"
            :aria-label="t('nav.brands')"
          >
            <p class="text-label app-footer__nav-heading">
              {{ t('nav.brands') }}
            </p>
            <NuxtLink
              v-for="brand in brandLinks"
              :key="brand.slug"
              :to="localePath(`/brands/${brand.slug}`)"
              class="app-footer__link"
            >
              {{ brand.name }}
            </NuxtLink>
          </nav>

          <div
            v-if="contact.address"
            class="app-footer__contact-col"
          >
            <p class="text-label app-footer__nav-heading app-footer__nav-heading--icon">
              <!-- Decorative, tied to real approved content (the address
                   right below it) — not a stand-in for the social icons
                   we're not adding; see the template comment above. -->
              <svg
                class="app-footer__icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 21s-7-6.1-7-11.2A7 7 0 0 1 19 9.8C19 14.9 12 21 12 21Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />
                <circle
                  cx="12"
                  cy="9.8"
                  r="2.25"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
              {{ t('footer.location') }}
            </p>
            <p class="text-small app-footer__address">
              {{ contact.address }}
            </p>
            <span class="app-footer__badge">{{ t('footer.addressPending') }}</span>
          </div>
        </div>

        <div class="app-footer__bottom">
          <p class="text-small app-footer__copyright">
            © {{ year }} {{ siteName }}. {{ t('footer.rights') }}
          </p>
          <LanguageSwitcher on-dark />
        </div>
      </BaseContainer>
    </div>
  </footer>
</template>

<style scoped>
.app-footer__inner {
  padding-block: clamp(var(--space-7), 5vw, var(--space-9));
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* flex-start, not space-between: with a container up to 1240px wide and
   only a handful of short columns, space-between spread them toward the
   container's edges and left large, contentless gaps between them.
   Keeping the columns close together instead reads as one considered
   group, with any leftover space trailing normally at the end like every
   other left-aligned section on the site, rather than as empty voids
   between them. */
.app-footer__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: var(--space-7) clamp(var(--space-7), 6vw, 5rem);
}

.app-footer__brand-col {
  flex: 1 1 16rem;
  max-inline-size: 22rem;
}

/* The short brand line stays bright/primary; the fuller description
   underneath (reused About copy — see the script) is muted, so the two
   read as a clear headline-then-detail pair rather than two competing
   statements of equal weight. */
.app-footer__tagline {
  margin-block-start: var(--space-3);
  color: var(--color-text-on-dark);
}

.app-footer__description {
  margin-block-start: var(--space-3);
  color: var(--color-text-on-dark-muted);
}

/* A vertical list under its own heading, not a horizontal inline row —
   the header's nav is a single flat line; this reads as its own labeled
   block instead of a repeat of that row in a different color. */
.app-footer__nav {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.app-footer__nav-heading {
  color: var(--color-text-on-dark-muted);
  margin-block-end: var(--space-1);
}

.app-footer__nav-heading--icon {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.app-footer__icon {
  flex: none;
  inline-size: 1rem;
  block-size: 1rem;
  color: var(--color-text-on-dark-muted);
}

.app-footer__link {
  inline-size: fit-content;
  font-size: var(--font-size-small);
  font-weight: 500;
  text-decoration: none;
  color: var(--color-text-on-dark);
}

.app-footer__link:hover {
  text-decoration: underline;
}

.app-footer__contact-col {
  flex: 0 0 auto;
  max-inline-size: 16rem;
}

.app-footer__address {
  color: var(--color-text-on-dark);
}

/* A permanent, visible status tag — not a decorative badge. It exists so
   real, sourced-but-unconfirmed data can be shown for layout purposes
   without misrepresenting it as approved production content. See the
   template comment above and content/en/contact.ts. */
.app-footer__badge {
  display: inline-block;
  margin-block-start: var(--space-2);
  padding: 0.1875rem var(--space-2);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: var(--letter-spacing-label);
  text-transform: uppercase;
  color: var(--color-text-on-dark-muted);
  border: 1px solid var(--color-text-on-dark-muted);
  border-radius: var(--radius-sm);
}

/* The legal bar: its own row, separated by a divider, holding the
   copyright line and the language switcher (moved down here from beside
   the logo) — a distinct zone the header has no equivalent of. */
.app-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding-block-start: var(--space-5);
  border-block-start: 1px solid var(--color-text-on-dark-muted);
}

.app-footer__copyright {
  color: var(--color-text-on-dark-muted);
}

@media (max-width: 639px) {
  .app-footer__grid {
    flex-direction: column;
    gap: var(--space-6);
  }

  /* flex-basis: 16rem on .app-footer__brand-col is a width hint for the
     row layout above — once the grid flips to a column, flex-basis
     applies to the block axis instead and would stretch this to a fixed
     16rem tall with mostly empty space. Reset it here. */
  .app-footer__brand-col {
    flex: 0 0 auto;
    max-inline-size: none;
  }
}
</style>
