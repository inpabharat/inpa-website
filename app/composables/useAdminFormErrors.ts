interface AdminErrorResponse {
  data?: { statusMessage?: string, data?: { issues?: string[], fieldIssues?: Record<string, string> } }
  message?: string
}

export interface AdminFieldAttributes {
  id: string
  'aria-invalid'?: true
  'aria-describedby'?: string
}

export function describeAdminError(error: unknown): string {
  const response = error as AdminErrorResponse | null
  return response?.data?.data?.issues?.join(' ') || response?.data?.statusMessage || response?.message || 'The request could not be completed.'
}

export function revealAdminField(element: HTMLElement): void {
  for (let details = element.closest('details'); details; details = details.parentElement?.closest('details') ?? null) {
    details.open = true
  }
}

export function revealInvalidAdminField(event: Event): void {
  if (event.target instanceof HTMLElement) revealAdminField(event.target)
}

export function useAdminFormErrors() {
  const id = useId()
  const fields = reactive(new Map<string, string>())
  const general = ref<string[]>([])
  const summaryId = `${id}-errors`
  const entries = computed(() => [
    ...Array.from(fields, ([key, message]) => ({
      id: `${id}-${key}-error`, fieldId: `${id}-${key}`, message,
    })),
    ...general.value.map((message, index) => ({ id: `${id}-general-${index}`, message })),
  ])

  function field(key: string): AdminFieldAttributes {
    const fieldId = `${id}-${key}`
    if (!fields.has(key)) return { id: fieldId }
    return { id: fieldId, 'aria-invalid': true, 'aria-describedby': `${fieldId}-error` }
  }

  function clear(): void {
    fields.clear()
    general.value = []
  }

  function clearField(...keys: string[]): void {
    for (const key of keys) fields.delete(key)
  }

  function clearOnInput(event: Event): void {
    if (!(event.target instanceof HTMLElement)) return
    const key = event.target.id.startsWith(`${id}-`) ? event.target.id.slice(id.length + 1) : ''
    if (key) clearField(key)
  }

  async function show(error: unknown): Promise<void> {
    const data = (error as AdminErrorResponse | null)?.data?.data
    fields.clear()
    for (const [key, message] of Object.entries(data?.fieldIssues ?? {})) fields.set(key, message)
    const linked = [...fields.values()]
    general.value = data?.issues?.filter(message => !linked.includes(message)) ?? []
    if (!linked.length && !general.value.length) general.value = [describeAdminError(error)]
    await nextTick()
    document.getElementById(summaryId)?.focus()
  }

  return { entries, summaryId, clear, clearField, clearOnInput, field, show }
}
