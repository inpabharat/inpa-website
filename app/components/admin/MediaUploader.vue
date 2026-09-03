<script setup lang="ts">
const emit = defineEmits<{ uploaded: [value: { key: string, url: string, alt: string }] }>()
const file = ref<File | null>(null)
const alt = ref('')
const credit = ref('')
const licence = ref('')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')

function choose(event: Event): void {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0] ?? null
}

async function upload(): Promise<void> {
  if (!file.value) return
  busy.value = true
  message.value = ''
  errorMessage.value = ''
  try {
    const body = new FormData()
    body.append('file', file.value)
    body.append('alt', alt.value)
    body.append('credit', credit.value)
    body.append('licence', licence.value)
    const response = await $fetch<{ data: { key: string, url: string, alt: string }, message: string }>('/api/admin/media', { method: 'POST', body })
    message.value = response.message
    emit('uploaded', response.data)
  } catch (error) {
    const candidate = error as { data?: { statusMessage?: string }, message?: string }
    errorMessage.value = candidate.data?.statusMessage ?? candidate.message ?? 'Upload failed.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <form class="editor-form editor-form--media" enctype="multipart/form-data" @submit.prevent="upload">
    <p>JPEG, PNG, WebP and PDF files up to 8 MB are accepted. Images require alternative text. Credit and licence information travel with the R2 object.</p>
    <label>File <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" required @change="choose"></label>
    <label>Alternative text <textarea v-model="alt" rows="3" maxlength="300" /></label>
    <div class="editor-form__row"><label>Photographer/source credit <input v-model="credit" maxlength="300"></label><label>Licence/permission note <input v-model="licence" maxlength="300"></label></div>
    <button class="button button--gold" type="submit" :disabled="busy || !file">{{ busy ? 'Uploading…' : 'Upload media' }}</button>
    <p v-if="message" class="admin-alert admin-alert--success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>
  </form>
</template>
