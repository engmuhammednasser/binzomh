import { sendContactEnquiry } from '~/utils/contact-request'

export function useContactSubmission() {
  const config = useRuntimeConfig()
  const endpoint = computed(() => config.public.contactFormEndpoint.trim())
  const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  let controller: AbortController | undefined
  let disposed = false

  onScopeDispose(() => {
    disposed = true
    controller?.abort()
  })

  async function submit(form: HTMLFormElement): Promise<boolean> {
    if (!endpoint.value || status.value === 'sending') return false
    const data = new FormData(form)
    status.value = 'sending'
    controller = new AbortController()
    const timeout = setTimeout(() => controller?.abort(), 15000)
    try {
      await sendContactEnquiry(endpoint.value, data, config.public.contactFormSuccessField, controller.signal)
      if (disposed) return false
      status.value = 'sent'
      return true
    }
    catch {
      if (!disposed) status.value = 'failed'
      return false
    }
    finally {
      clearTimeout(timeout)
      controller = undefined
    }
  }

  function clearResult() {
    if (status.value !== 'sending') status.value = 'idle'
  }

  return { endpoint, status: readonly(status), submit, clearResult }
}
