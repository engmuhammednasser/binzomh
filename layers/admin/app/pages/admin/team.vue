<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { t } = useI18n()

useHead({ title: () => t('admin.team.heading') })
</script>

<template>
  <div>
    <AdminPageHeader
      :heading="t('admin.team.heading')"
      :intro="t('admin.team.intro')"
    />
    <AdminTeamMembers />
    <AdminTeamLogos />
  </div>
</template>
