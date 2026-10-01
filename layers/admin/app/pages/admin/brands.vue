<script setup lang="ts">
const { draft } = useAdminWorkspace()
const brandProfiles = computed(() => draft.value?.brands ?? [])

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { t } = useI18n()

useHead({ title: () => t('admin.brands.heading') })

const editingSlug = ref<string | null>(useRoute().hash.replace('#brand-', '') || null)
const editing = computed(() => brandProfiles.value.find(brand => brand.slug === editingSlug.value) ?? null)
</script>

<template>
  <div>
    <AdminPageHeader
      :heading="t('admin.brands.heading')"
      :intro="t('admin.brands.intro')"
    />

    <AdminBrandsTable
      :brands="brandProfiles"
      :editing-slug="editingSlug"
      @edit="brand => editingSlug = brand.slug"
    />

    <AdminBrandsEditor
      v-if="editing"
      :brand="editing"
      @close="editingSlug = null"
    />
  </div>
</template>
