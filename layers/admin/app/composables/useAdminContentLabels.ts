/** Translate the fixed CMS schema into labels for content editors. */
export function useAdminContentLabels() {
  const { t, te } = useI18n()
  function partLabel(part: string) {
    if (/^\d+$/.test(part)) return String(Number(part) + 1)
    const key = `admin.editor.labels.${part}`
    return te(key) ? t(key) : part.replace(/([a-z])([A-Z])/g, '$1 $2')
  }
  function groupKey(path: string) {
    const parts = path.split('.')
    if (parts[0] === 'sections' || (parts[0] === 'leadership' && ['chairman', 'team'].includes(parts[1] ?? ''))) return parts.slice(0, 2).join('.')
    return parts.length > 1 ? parts[0]! : 'general'
  }
  const groupLabel = (key: string) => key.split('.').map(partLabel).join(' · ')
  function fieldLabel(path: string) {
    const group = groupKey(path)
    const parts = (group === 'general' ? path : path.slice(group.length + 1)).split('.')
    // "Button text" is already expressed by primaryCta/cta.
    return parts.filter(part => part !== 'person' && !(part === 'label' && parts.length > 1)).map(partLabel).join(' · ')
  }
  return { groupKey, groupLabel, fieldLabel }
}
