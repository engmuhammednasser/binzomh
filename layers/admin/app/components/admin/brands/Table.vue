<script setup lang="ts">
import type { BrandProfile } from '~~/types/brands'
import type { ContentStatus } from '~~/types/content'

defineProps<{ brands: BrandProfile[], editingSlug: string | null }>()
const emit = defineEmits<{ edit: [brand: BrandProfile] }>()

const { t } = useI18n()
const assetUrl = useAssetUrl()

const columns = ['introduction', 'relationship', 'image', 'ranges'] as const

// A field with no record at all reads as "missing", matching how the
// public site treats it (content/brands/presentation.ts).
const fieldStatus = (field?: { status: ContentStatus }): ContentStatus => field?.status ?? 'missing'
</script>

<template>
  <div class="admin-panel admin-table-wrap">
    <table class="admin-table">
      <thead>
        <tr>
          <th scope="col">
            {{ t('admin.brands.logo') }}
          </th>
          <th scope="col">
            {{ t('admin.brands.name') }}
          </th>
          <th
            v-for="column in columns"
            :key="column"
            scope="col"
          >
            {{ t(`admin.brands.${column}`) }}
          </th>
          <th scope="col">
            <span class="visually-hidden">{{ t('admin.common.edit') }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="brand in brands"
          :id="`brand-${brand.slug}`"
          :key="brand.slug"
          :class="{ 'is-editing': brand.slug === editingSlug }"
        >
          <td>
            <img
              v-if="brand.logo"
              :src="assetUrl(brand.logo.src)"
              :width="brand.logo.width"
              :height="brand.logo.height"
              alt=""
              class="logo"
            >
            <span
              v-else
              class="text-small text-muted"
            >{{ t('admin.brands.noLogo') }}</span>
          </td>
          <th scope="row">
            {{ brand.name }}
          </th>
          <td
            v-for="column in columns"
            :key="column"
          >
            <AdminStatus :status="fieldStatus(brand[column])" />
          </td>
          <td>
            <button
              type="button"
              class="admin-btn admin-btn--small"
              @click="emit('edit', brand)"
            >
              {{ t('admin.common.edit') }}
              <span class="visually-hidden">{{ brand.name }}</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-table td,
.admin-table th {
  white-space: nowrap;
}

.admin-table tr.is-editing {
  background: var(--color-bg-raised);
}

.logo {
  display: block;
  inline-size: 3rem;
  block-size: 3rem;
  object-fit: contain;
  padding: 0.25rem;
  border-radius: 6px;
  background: #f7f7f5;
}

.admin-table tr:target {
  background: var(--color-bg-raised);
  box-shadow: inset 3px 0 0 var(--admin-accent);
  scroll-margin-block-start: 2rem;
}

.admin-table tr:target:dir(rtl) {
  box-shadow: inset -3px 0 0 var(--admin-accent);
}
</style>
