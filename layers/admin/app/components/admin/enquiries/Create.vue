<script setup lang="ts">
const { t } = useI18n()
const { add, busy } = useAdminEnquiries()
const open = ref(useRoute().query.create === '1')
const form = useTemplateRef<HTMLFormElement>('captureForm')
const focusName = () => form.value?.querySelector('input')?.focus()
watch(open, (value) => {
  if (value) nextTick(focusName)
})
onMounted(() => {
  if (open.value) focusName()
})
const draft = reactive({ name: '', email: '', company: '', message: '' })
const added = ref(false)
async function submit() {
  if (await add({ ...draft })) {
    Object.assign(draft, { name: '', email: '', company: '', message: '' })
    open.value = false
    added.value = true
  }
}
</script>

<template>
  <div class="capture">
    <button
      class="admin-btn"
      :aria-expanded="open"
      aria-controls="capture-form"
      @click="open = !open; added = false"
    >
      + {{ t('admin.live.addEnquiry') }}
    </button>
    <p
      v-if="added"
      role="status"
    >
      {{ t('admin.live.enquiryAdded') }}
    </p>
    <form
      v-if="open"
      id="capture-form"
      ref="captureForm"
      class="admin-panel capture__form"
      @submit.prevent="submit"
    >
      <p>{{ t('admin.live.manualNote') }}</p>
      <label
        v-for="field in (['name', 'email', 'company'] as const)"
        :key="field"
        class="admin-field"
      >
        <span>{{ t(`admin.live.${field}`) }}</span>
        <input
          v-model="draft[field]"
          class="admin-field__input"
          :type="field === 'email' ? 'email' : 'text'"
          :required="field !== 'company'"
          :maxlength="field === 'name' ? 150 : field === 'company' ? 200 : 254"
          :disabled="busy"
        >
      </label>
      <label class="admin-field"><span>{{ t('admin.enquiries.message') }}</span><textarea
        v-model="draft.message"
        class="admin-field__input"
        required
        maxlength="8000"
        rows="4"
        :disabled="busy"
      /></label>
      <button
        class="admin-btn admin-btn--primary"
        :disabled="busy"
      >
        {{ t('admin.live.addEnquiry') }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.capture { margin-bottom: 1rem; }
.capture__form { display: grid; gap: 1rem; max-width: 44rem; margin-top: 1rem; padding: 1.25rem; }
</style>
