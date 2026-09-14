<script setup lang="ts">
import type { MediaKind, MediaSelection } from '~~/shared/types/media'

const props = withDefaults(defineProps<{ accept?: MediaKind }>(), { accept: 'image' })
const emit = defineEmits<{ uploaded: [value: MediaSelection] }>()
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const alt = ref('')
const credit = ref('')
const licence = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')

const acceptedTypes = computed(() => props.accept === 'pdf'
  ? 'application/pdf'
  : 'image/jpeg,image/png,image/webp')

const acceptedDescription = computed(() => props.accept === 'pdf'
  ? 'PDF files up to 8 MB'
  : 'JPEG, PNG or WebP images up to 8 MB')

function choose(event: Event): void {
  const input = event.target as HTMLInputElement
  const selected = input.files?.[0] ?? null
  message.value = ''
  errorMessage.value = ''
  if (!selected) {
    file.value = null
    return
  }
  const valid = props.accept === 'pdf'
    ? selected.type === 'application/pdf'
    : ['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)
  if (!valid) {
    input.value = ''
    file.value = null
    errorMessage.value = props.accept === 'pdf'
      ? 'Choose a PDF file.'
      : 'Choose a JPEG, PNG or WebP image.'
    return
  }
  file.value = selected
}

async function upload(): Promise<void> {
  if (!file.value) {
    errorMessage.value = `Choose ${props.accept === 'pdf' ? 'a PDF' : 'an image'} first.`
    return
  }
  if (props.accept === 'image' && !alt.value.trim()) {
    errorMessage.value = 'Describe what the image shows for visitors who cannot see it.'
    return
  }
  busy.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    const selectedFile = file.value
    const body = new FormData()
    body.append('file', selectedFile)
    body.append('alt', alt.value)
    body.append('credit', credit.value)
    body.append('licence', licence.value)
    const response = await $fetch<{ data: MediaSelection, message: string }>('/api/admin/media', { method: 'POST', body })
    message.value = response.message
    emit('uploaded', {
      ...response.data,
      contentType: response.data.contentType || selectedFile.type,
      originalName: response.data.originalName || selectedFile.name,
    })
    file.value = null
    alt.value = ''
    credit.value = ''
    licence.value = ''
    if (fileInput.value) fileInput.value.value = ''
  } catch (error) {
    const candidate = error as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = candidate.data?.statusMessage ?? candidate.message ?? 'Upload failed.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="media-uploader" aria-label="Upload a new file">
    <p class="media-uploader__intro">
      Upload {{ acceptedDescription }}. The file is saved in the media library and will appear on the public website only after you attach it to a published item.
    </p>
    <p class="media-uploader__privacy">Do not upload confidential files. Anyone with a file's public link may be able to open it.</p>
    <label>
      {{ accept === 'pdf' ? 'PDF file' : 'Image file' }}
      <input ref="fileInput" type="file" :accept="acceptedTypes" @change="choose">
    </label>
    <p v-if="file" class="media-uploader__chosen">Selected: <strong>{{ file.name }}</strong></p>
    <label v-if="accept === 'image'">
      Image description
      <textarea v-model="alt" rows="3" maxlength="300" placeholder="Describe the important content of the image." />
      <span>Used by screen readers and shown if the image cannot load.</span>
    </label>
    <div class="media-uploader__row">
      <label>Photographer or source credit <input v-model="credit" maxlength="300"></label>
      <label>Licence or permission note <input v-model="licence" maxlength="300"></label>
    </div>
    <button class="button button--gold" type="button" :disabled="busy" @click="upload">{{ busy ? 'Uploading…' : `Upload ${accept === 'pdf' ? 'PDF' : 'image'}` }}</button>
    <p v-if="message" class="admin-alert admin-alert--success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>
  </section>
</template>

<style scoped>
.media-uploader {
  display: grid;
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid var(--color-border);
  background: var(--color-surface-subtle);
  gap: 1rem;
}

.media-uploader__intro,
.media-uploader__privacy,
.media-uploader__chosen { margin: 0; }
.media-uploader__privacy { color: var(--color-text-muted); font-size: 0.9rem; }
.media-uploader__chosen { overflow-wrap: anywhere; }
.media-uploader label { display: grid; color: var(--color-navy-950); font-size: 0.88rem; font-weight: 750; gap: 0.4rem; }
.media-uploader label span { color: var(--color-text-muted); font-size: 0.82rem; font-weight: 450; }
.media-uploader input,
.media-uploader textarea { width: 100%; min-height: 2.75rem; padding: 0.65rem 0.75rem; border: 1px solid #97acb9; background: var(--color-surface); color: var(--color-text); font: inherit; font-weight: 450; }
.media-uploader textarea { resize: vertical; }
.media-uploader__row { display: grid; gap: 1rem; }
.media-uploader .button { justify-self: start; }

@media (min-width: 40rem) {
  .media-uploader__row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>
