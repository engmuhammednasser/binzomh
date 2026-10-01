<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { t } = useI18n()
useAdminContactInfo()

useHead({ title: () => t('admin.contactInfo.heading') })
</script>

<template>
  <div class="page">
    <AdminPageHeader
      :heading="t('admin.contactInfo.heading')"
      :intro="t('admin.contactInfo.intro')"
    />

    <div class="layout">
      <div class="forms">
        <AdminContactDetailsForm />
        <AdminContactSocialForm />
      </div>
      <AdminContactPreview class="layout__preview" />
    </div>

    <!-- aria-live so the running count of unsaved edits is announced as
         it changes, without moving focus off the field being typed in. -->
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(16rem, 22rem);
  align-items: start;
  gap: 1.5rem;
}

.forms {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-inline-size: 0;
}

.layout__preview {
  position: sticky;
  inset-block-start: 1.5rem;
}

@media (max-width: 1100px) {
  .layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .layout__preview {
    position: static;
  }
}
</style>
