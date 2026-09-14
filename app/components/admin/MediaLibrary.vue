<script setup lang="ts">
import type { MediaItem, MediaKind, MediaSelection } from '~~/shared/types/media'

const props = withDefaults(defineProps<{ refreshKey?: number, accept?: MediaKind | null, selectable?: boolean }>(), { refreshKey: 0, accept: null, selectable: true })
const emit = defineEmits<{ selected: [value: MediaSelection] }>()
const items = ref<MediaItem[]>([])
const search = ref('')
const kind = ref<'all' | MediaKind>(props.accept ?? 'all')
const loading = ref(true)
const busyKey = ref('')
const errorMessage = ref('')

const filteredItems = computed(() => {
  const query = search.value.trim().toLocaleLowerCase('en-IN')
  return items.value.filter((item) => {
    const itemKind: MediaKind = item.contentType === 'application/pdf' ? 'pdf' : 'image'
    if (props.accept && itemKind !== props.accept) return false
    if (kind.value !== 'all' && itemKind !== kind.value) return false
    if (!query) return true
    return [displayName(item), item.alt, item.credit, item.licence]
      .some(value => value.toLocaleLowerCase('en-IN').includes(query))
  })
})

function displayName(item: MediaItem): string {
  if (item.originalName) return item.originalName
  const type = item.contentType === 'application/pdf' ? 'PDF' : 'Image'
  return `${type} uploaded ${new Date(item.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function selectLabel(item: MediaItem): string {
  return item.contentType === 'application/pdf' ? 'Use this PDF' : 'Use this image'
}

async function load(): Promise<void> {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await $fetch<{ data: MediaItem[] }>('/api/admin/media')
    items.value = response.data
  } catch (error) {
    const candidate = error as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = candidate.data?.statusMessage ?? candidate.message ?? 'The media library could not be loaded.'
  } finally {
    loading.value = false
  }
}

async function remove(item: MediaItem): Promise<void> {
  if (!window.confirm(`Delete “${displayName(item)}” permanently?`)) return
  busyKey.value = item.key
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/media', { method: 'DELETE', query: { key: item.key } })
    await load()
  } catch (error) {
    const candidate = error as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = candidate.data?.statusMessage ?? candidate.message ?? 'The file could not be deleted.'
  } finally {
    busyKey.value = ''
  }
}

watch(() => props.refreshKey, load)
watch(() => props.accept, value => { kind.value = value ?? 'all' })
onMounted(load)
</script>

<template>
  <section class="media-library" aria-labelledby="media-library-title">
    <div class="media-library__heading">
      <div>
        <h3 id="media-library-title">Media library</h3>
        <p>Files uploaded here can be reused in news, events, Nuclear Horizons and research features.</p>
      </div>
      <button class="text-button" type="button" :disabled="loading" @click="load">Refresh</button>
    </div>

    <div class="media-library__filters">
      <label>
        Search files
        <input v-model="search" type="search" placeholder="Search by name, description or credit">
      </label>
      <label v-if="!accept">
        File type
        <select v-model="kind">
          <option value="all">Images and PDFs</option>
          <option value="image">Images</option>
          <option value="pdf">PDFs</option>
        </select>
      </label>
    </div>

    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>
    <p v-else-if="loading" role="status">Loading media library…</p>
    <ul v-else-if="filteredItems.length" class="media-library__grid">
      <li v-for="item in filteredItems" :key="item.key">
        <a :href="item.url" target="_blank" rel="noopener" class="media-library__preview" :aria-label="`Open ${displayName(item)} in a new tab`">
          <img v-if="item.contentType.startsWith('image/')" :src="item.url" :alt="item.alt" width="480" height="270" loading="lazy">
          <span v-else class="media-library__document" aria-hidden="true">PDF</span>
        </a>
        <div class="media-library__body">
          <h4>{{ displayName(item) }}</h4>
          <p class="media-library__meta">{{ Math.max(1, Math.ceil(item.size / 1024)) }} KB · {{ new Date(item.uploadedAt).toLocaleString('en-IN') }}</p>
          <p v-if="item.alt"><strong>Image description:</strong> {{ item.alt }}</p>
          <p v-if="item.credit"><strong>Credit:</strong> {{ item.credit }}</p>
          <div v-if="item.usages?.length" class="media-library__usage">
            <p><strong>Used in {{ item.usages.length }} item{{ item.usages.length === 1 ? '' : 's' }}:</strong></p>
            <ul>
              <li v-for="usage in item.usages" :key="`${usage.kind}-${usage.id}`">{{ usage.title }} <span>({{ usage.status }})</span></li>
            </ul>
          </div>
          <p v-else-if="item.usages" class="media-library__unused">Not currently attached to any content.</p>
          <div class="media-library__actions">
            <button v-if="selectable" type="button" @click="emit('selected', item)">{{ selectLabel(item) }}</button>
            <a :href="item.url" target="_blank" rel="noopener">Open file</a>
            <button v-if="!item.usages?.length" class="danger-button" type="button" :disabled="busyKey === item.key" @click="remove(item)">{{ busyKey === item.key ? 'Deleting…' : 'Delete' }}</button>
          </div>
        </div>
      </li>
    </ul>
    <p v-else-if="items.length">No files match your search.</p>
    <p v-else>No files have been uploaded yet.</p>
  </section>
</template>

<style scoped>
.media-library { margin-top: 1.5rem; }
.media-library__heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; }
.media-library__heading h3,
.media-library__heading p { margin-bottom: 0; }
.media-library__heading p { max-width: 42rem; color: var(--color-text-muted); }
.media-library__filters { display: grid; margin-top: 1.25rem; gap: 1rem; }
.media-library__filters label { display: grid; color: var(--color-navy-950); font-size: 0.88rem; font-weight: 750; gap: 0.4rem; }
.media-library__filters input,
.media-library__filters select { width: 100%; min-height: 2.75rem; padding: 0.65rem 0.75rem; border: 1px solid #97acb9; background: var(--color-surface); color: var(--color-text); font: inherit; }
.media-library__grid { display: grid; margin: 1.25rem 0 0; padding: 0; gap: 1rem; list-style: none; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); }
.media-library__grid > li { min-width: 0; border: 1px solid var(--color-border); background: var(--color-surface); }
.media-library__preview { display: block; background: var(--color-navy-950); }
.media-library__preview img,
.media-library__document { display: grid; width: 100%; aspect-ratio: 16 / 9; place-items: center; object-fit: cover; }
.media-library__document { color: white; font-size: 1.5rem; font-weight: 800; }
.media-library__body { padding: 1rem; }
.media-library__body h4 { margin-bottom: 0.35rem; overflow-wrap: anywhere; }
.media-library__body p { margin-bottom: 0.7rem; }
.media-library__meta,
.media-library__unused { color: var(--color-text-muted); font-size: 0.85rem; }
.media-library__usage { margin-block: 0.75rem; padding: 0.75rem; background: var(--color-surface-subtle); }
.media-library__usage p { margin-bottom: 0.35rem; }
.media-library__usage ul { margin: 0; padding-left: 1.1rem; }
.media-library__usage li { margin-top: 0.25rem; }
.media-library__usage span { color: var(--color-text-muted); }
.media-library__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem; }
.media-library__actions button,
.media-library__actions a { display: inline-flex; align-items: center; min-height: 2.75rem; padding: 0.55rem 0.85rem; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-navy-800); cursor: pointer; font: inherit; font-weight: 700; text-decoration: none; }

@media (min-width: 40rem) {
  .media-library__filters { grid-template-columns: minmax(0, 2fr) minmax(10rem, 1fr); }
}

@media (max-width: 30rem) {
  .media-library__heading { align-items: stretch; flex-direction: column; }
  .media-library__heading .text-button { align-self: start; }
}
</style>
