<script setup lang="ts">
import type { SocialPlatform } from '~~/types/content'
import { contactContent as contactEn } from '~~/content/en/contact'
import { contactContent as contactAr } from '~~/content/ar/contact'
import { homeContent as homeEn } from '~~/content/en/home'
import { homeContent as homeAr } from '~~/content/ar/home'
import { homeBrandCandidates } from '~~/content/brands'
import { socialLinks } from '~~/content/social'

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

// Phone, email, address and working hours are all approved for public
// display by the owner on 2026-09-23 (docs/unresolved-content-approvals.md
// item 6), which is why the earlier "pending confirmation" badge on the
// address is gone. Every field is still optional on ContactContent and
// guarded below, so clearing one in the content files hides its row rather
// than rendering an empty link.
const contact = usePairedContent(contactEn, contactAr)

// The footer's longer description reuses the homepage About section's own
// body copy (content/en/home.ts / content/ar/home.ts) rather than a
// second, separately-maintained copy of the same sentence in i18n — one
// approved source of truth, so the two can't drift out of sync if that
// copy is ever revised.
const home = usePairedContent(homeEn, homeAr)

// Derived from the single display string in the content files instead of
// stored as a second field, so the dialled number can never disagree with
// the printed one. Keeps "+" and digits; drops the display spacing.
const telHref = computed(() => {
  const phone = contact.value.phone
  return phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined
})

const hasContactDetails = computed(() => {
  const { phone, email, address, hours } = contact.value
  return Boolean(phone || email || address || hours)
})

// Proper nouns, deliberately not i18n strings: platform names aren't
// translated in either locale. Typed against SocialPlatform so adding a
// platform in types/content.ts fails the build here until it is named.
//
// Rendered as text rather than the platforms' own glyphs: redrawing a
// third-party mark from memory is exactly what
// docs/unresolved-content-approvals.md item 1 forbids ("do not fabricate,
// redraw, or imitate any logo"). Swap in official brand assets here if the
// company supplies them under each platform's brand guidelines.
const socialLabels: Record<SocialPlatform, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  x: 'X',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
}
</script>

<template>
  <footer class="app-footer">
    <MotionZDivider />
    <div class="app-footer__surface surface-inverse">
      <BaseContainer class="app-footer__inner">
        <!--
          Deliberately not a recolored copy of AppHeader: the header is one
          horizontal row (logo, inline nav, CTA, language switcher). This is
          a four-column "mega footer" block — brand+tagline+description+social,
          a vertical nav list under "Explore", the brand portfolio under
          "Our Brands", and the contact details under "Contact" — closed by
          a slim centered legal strip, so the whole thing doesn't read as
          the header layout with an inverted color scheme. navItems,
          brandLinks, contact and socialLinks all come from the same shared
          sources the rest of the site uses (useNavItems(), content/brands,
          content/{en,ar}/contact, content/social) — only the presentation
          differs here, nothing is a new or separately-maintained list.

          The contact block prints only the fields the company has approved
          (item 6, 2026-09-23). The social block renders nothing at all
          while content/social.ts is empty — do not invent profile URLs to
          fill it; that file explains why.
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

            <div
              v-if="socialLinks.length"
              class="app-footer__social"
            >
              <p class="text-label app-footer__nav-heading">
                {{ t('footer.followUs') }}
              </p>
              <ul class="app-footer__social-list">
                <li
                  v-for="link in socialLinks"
                  :key="link.platform"
                >
                  <!-- External destinations: rel="noopener noreferrer" so
                       the opened tab gets no window.opener handle back. -->
                  <a
                    :href="link.url"
                    class="app-footer__link"
                    target="_blank"
                    rel="noopener noreferrer"
                    :aria-label="t('footer.followOn', { platform: socialLabels[link.platform] })"
                  >
                    {{ socialLabels[link.platform] }}
                  </a>
                </li>
              </ul>
            </div>
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
            v-if="hasContactDetails"
            class="app-footer__contact-col"
          >
            <p class="text-label app-footer__nav-heading">
              {{ t('footer.contact') }}
            </p>
            <!--
              Each row pairs a decorative icon with a visually-hidden text
              label, so the icon alone never has to carry the meaning for
              screen-reader or forced-colors users.

              dir="ltr" on the phone and email: both are left-to-right
              Latin-script values. Without it the RTL layout moves the
              number's leading "+" to the wrong end.
            -->
            <ul class="app-footer__contact-list">
              <li
                v-if="contact.phone"
                class="app-footer__contact-item"
              >
                <svg
                  class="app-footer__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="visually-hidden">{{ t('footer.phoneLabel') }}</span>
                <a
                  :href="telHref"
                  class="app-footer__link"
                  dir="ltr"
                >{{ contact.phone }}</a>
              </li>

              <li
                v-if="contact.email"
                class="app-footer__contact-item"
              >
                <svg
                  class="app-footer__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5.5"
                    width="18"
                    height="13"
                    rx="2"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="m3.75 7 8.25 6 8.25-6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="visually-hidden">{{ t('footer.emailLabel') }}</span>
                <a
                  :href="`mailto:${contact.email}`"
                  class="app-footer__link"
                  dir="ltr"
                >{{ contact.email }}</a>
              </li>

              <li
                v-if="contact.address"
                class="app-footer__contact-item"
              >
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
                <span class="visually-hidden">{{ t('footer.addressLabel') }}</span>
                <span class="text-small app-footer__contact-text">{{ contact.address }}</span>
              </li>

              <li
                v-if="contact.hours"
                class="app-footer__contact-item"
              >
                <svg
                  class="app-footer__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.25"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <path
                    d="M12 7.5V12l3 1.75"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span class="visually-hidden">{{ t('footer.hoursLabel') }}</span>
                <span class="text-small app-footer__contact-text">{{ contact.hours }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="app-footer__bottom">
          <p class="text-small app-footer__copyright">
            © {{ year }} {{ siteName }}. {{ t('footer.rights') }}
          </p>
        </div>
      </BaseContainer>
    </div>
  </footer>
</template>

<style scoped>
/* Asymmetric on purpose: the generous top padding gives the four content
   columns room to breathe under the divider, but repeating it underneath
   left the copyright floating in 3-5rem of dead space. The legal strip is
   a closing rule, not a section, so it sits close to the bottom edge. */
.app-footer__inner {
  padding-block: clamp(var(--space-7), 5vw, var(--space-9)) var(--space-4);
  display: flex;
  flex-direction: column;
  /* Only gap in here is the one above the legal strip; kept tighter than
     the column gaps so that strip stays visually attached to the footer
     rather than floating as its own band. */
  gap: var(--space-5);
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

.app-footer__icon {
  flex: none;
  inline-size: 1rem;
  block-size: 1rem;
  /* Nudged down so the 1rem box sits on the first text line's optical
     center instead of overshooting its top. */
  margin-block-start: 0.1875rem;
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

/* Horizontal, unlike the vertical nav columns: the platform names are
   short and read as one row of destinations rather than a list. */
.app-footer__social {
  margin-block-start: var(--space-5);
}

.app-footer__social-list {
  list-style: none;
  padding-inline-start: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-4);
}

.app-footer__contact-col {
  flex: 0 0 auto;
  max-inline-size: 17rem;
}

.app-footer__contact-list {
  list-style: none;
  padding-inline-start: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Icon and value on one row, top-aligned so the multi-line address keeps
   its icon beside the first line rather than centered against the block. */
.app-footer__contact-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.app-footer__contact-text {
  color: var(--color-text-on-dark);
}

/* A slim legal strip: one centered line under a divider, deliberately kept
   to a single row. The language switcher is not repeated here — AppHeader
   renders it at every breakpoint (no display:none on .app-header__language),
   so duplicating it below only forced this strip to wrap onto two rows on
   narrow screens and made it read as a second, heavier section. */
.app-footer__bottom {
  display: flex;
  justify-content: center;
  padding-block-start: var(--space-4);
  border-block-start: 1px solid var(--color-text-on-dark-muted);
}

.app-footer__copyright {
  color: var(--color-text-on-dark-muted);
  text-align: center;
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
