export default defineNuxtRouteMiddleware(async () => {
  if (!useRuntimeConfig().public.adminEnabled) return abortNavigation(createError({ statusCode: 404 }))
  const { check } = useAdminSession()
  try {
    await check()
    await useAdminWorkspace().load()
  }
  catch (error) {
    if ((error as { statusCode?: number }).statusCode !== 401) throw error
    return navigateTo(useLocalePath()('/admin/login'))
  }
})
