import { absoluteSiteUrl } from '~~/shared/utils/site-url'

export function useSiteUrl() {
  const config = useRuntimeConfig()
  return (path = '/') => absoluteSiteUrl(config.public.siteUrl, path)
}
