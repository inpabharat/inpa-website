<script setup lang="ts">
interface MediaItem {
  key: string
  url: string
  size: number
  uploadedAt: string
  contentType: string
  alt: string
  credit: string
  licence: string
}

const props = defineProps<{ refreshKey: number }>()
const emit = defineEmits<{ selected: [value: { key: string, url: string, alt: string }] }>()
const items = ref<MediaItem[]>([])
const busyKey = ref('')
const errorMessage = ref('')

async function load(): Promise<void> {
  errorMessage.value = ''
  try {
    const response = await $fetch<{ data: MediaItem[] }>('/api/admin/media')
    items.value = response.data
  } catch (error) {
    const candidate = error as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = candidate.data?.statusMessage ?? candidate.message ?? 'The media library could not be loaded.'
  }
}

async function remove(item: MediaItem): Promise<void> {
  if (!window.confirm('Delete this unused media object permanently?')) return
  busyKey.value = item.key
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/media', { method: 'DELETE', query: { key: item.key } })
    await load()
  } catch (error) {
    const candidate = error as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = candidate.data?.statusMessage ?? candidate.message ?? 'The media object could not be deleted.'
  } finally {
    busyKey.value = ''
  }
}

watch(() => props.refreshKey, load)
onMounted(load)
</script>

<template>
  <section class="media-library" aria-labelledby="media-library-title">
    <h3 id="media-library-title">Available media</h3>
    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>
    <ul v-if="items.length" class="media-library__grid">
      <li v-for="item in items" :key="item.key">
        <img v-if="item.contentType.startsWith('image/')" :src="item.url" :alt="item.alt" width="480" height="270" loading="lazy">
        <div v-else class="media-library__document" aria-hidden="true">PDF</div>
        <div class="media-library__body">
          <p class="media-library__key"><code>{{ item.key }}</code></p>
          <p class="meta">{{ Math.ceil(item.size / 1024) }} KB · {{ new Date(item.uploadedAt).toLocaleString('en-IN') }}</p>
          <p v-if="item.credit">Credit: {{ item.credit }}</p>
          <div class="editor-row-actions"><button type="button" @click="emit('selected', { key: item.key, url: item.url, alt: item.alt })">Select</button><button class="danger-button" type="button" :disabled="busyKey === item.key" @click="remove(item)">Delete unused</button></div>
        </div>
      </li>
    </ul>
    <p v-else-if="!errorMessage">No media has been uploaded in this environment.</p>
  </section>
</template>
