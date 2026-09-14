<script setup lang="ts">
import type { MediaKind, MediaSelection } from '~~/shared/types/media'

const props = withDefaults(defineProps<{
  modelValue: string | null
  alt?: string | null
  label: string
  accept?: MediaKind
}>(), { alt: null, accept: 'image' })

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:alt': [value: string]
}>()

const mode = ref<'library' | 'upload' | null>(null)
const refreshKey = ref(0)
const selectedName = ref('')
const fieldId = useId()

const previewUrl = computed(() => {
  if (!props.modelValue) return ''
  if (/^(?:https?:)?\//.test(props.modelValue)) return props.modelValue
  return `/media/${props.modelValue}`
})

const fallbackName = computed(() => {
  if (!props.modelValue) return ''
  const part = props.modelValue.split('/').pop() || props.modelValue
  try { return decodeURIComponent(part) } catch { return part }
})

function useMedia(value: MediaSelection): void {
  selectedName.value = value.originalName || ''
  emit('update:modelValue', value.key)
  emit('update:alt', props.accept === 'image' ? value.alt : '')
  mode.value = null
}

function uploaded(value: MediaSelection): void {
  refreshKey.value += 1
  useMedia(value)
}

function clear(): void {
  selectedName.value = ''
  emit('update:modelValue', '')
  emit('update:alt', '')
  mode.value = null
}
</script>

<template>
  <fieldset class="media-field">
    <legend>{{ label }}</legend>
    <p class="media-field__help">Choose an existing {{ accept === 'pdf' ? 'PDF' : 'image' }} or upload a new one. Your other form entries will stay in place.</p>

    <div v-if="modelValue" class="media-field__current">
      <img v-if="accept === 'image'" :src="previewUrl" :alt="alt || ''" width="320" height="180">
      <div v-else class="media-field__pdf" aria-hidden="true">PDF</div>
      <div>
        <p><strong>Current {{ accept === 'pdf' ? 'PDF' : 'image' }}:</strong> {{ selectedName || fallbackName }}</p>
        <a :href="previewUrl" target="_blank" rel="noopener">Open preview in a new tab</a>
      </div>
    </div>
    <p v-else class="media-field__empty">No {{ accept === 'pdf' ? 'PDF' : 'image' }} selected.</p>

    <label v-if="accept === 'image' && modelValue" :for="`${fieldId}-alt`" class="media-field__alt">
      Image description
      <textarea :id="`${fieldId}-alt`" :value="alt || ''" rows="2" maxlength="300" @input="emit('update:alt', ($event.target as HTMLTextAreaElement).value)" />
      <span>Describe the important content for visitors who cannot see the image.</span>
    </label>

    <div class="media-field__actions">
      <button type="button" :aria-expanded="mode === 'library'" @click="mode = mode === 'library' ? null : 'library'">Choose from library</button>
      <button type="button" :aria-expanded="mode === 'upload'" @click="mode = mode === 'upload' ? null : 'upload'">Upload new</button>
      <button v-if="modelValue" type="button" class="danger-button" @click="clear">Remove selection</button>
    </div>

    <div v-if="mode === 'library'" class="media-field__panel">
      <AdminMediaLibrary :refresh-key="refreshKey" :accept="accept" @selected="useMedia" />
    </div>
    <div v-else-if="mode === 'upload'" class="media-field__panel">
      <AdminMediaUploader :accept="accept" @uploaded="uploaded" />
    </div>
  </fieldset>
</template>

<style scoped>
.media-field { min-width: 0; margin: 0; padding: 1rem; border: 1px solid var(--color-border); background: var(--color-surface); }
.media-field legend { padding-inline: 0.35rem; color: var(--color-navy-950); font-weight: 800; }
.media-field__help,
.media-field__empty { margin: 0 0 1rem; color: var(--color-text-muted); }
.media-field__current { display: grid; align-items: center; margin-bottom: 1rem; padding: 0.75rem; background: var(--color-surface-subtle); gap: 1rem; }
.media-field__current img,
.media-field__pdf { width: 100%; max-width: 12rem; aspect-ratio: 16 / 9; object-fit: cover; }
.media-field__pdf { display: grid; place-items: center; background: var(--color-navy-950); color: white; font-weight: 800; }
.media-field__current p { margin: 0 0 0.35rem; overflow-wrap: anywhere; }
.media-field__current a { color: var(--color-navy-800); font-weight: 700; text-underline-offset: 0.2rem; }
.media-field__alt { display: grid; margin-bottom: 1rem; color: var(--color-navy-950); font-size: 0.88rem; font-weight: 750; gap: 0.4rem; }
.media-field__alt textarea { width: 100%; min-height: 2.75rem; padding: 0.65rem 0.75rem; border: 1px solid #97acb9; background: var(--color-surface); color: var(--color-text); font: inherit; font-weight: 450; resize: vertical; }
.media-field__alt span { color: var(--color-text-muted); font-size: 0.82rem; font-weight: 450; }
.media-field__actions { display: flex; flex-wrap: wrap; gap: 0.65rem; }
.media-field__actions button { min-height: 2.75rem; padding: 0.55rem 0.85rem; border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-navy-800); cursor: pointer; font: inherit; font-weight: 700; }
.media-field__panel { min-width: 0; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--color-border); }

@media (min-width: 34rem) {
  .media-field__current { grid-template-columns: auto minmax(0, 1fr); }
}
</style>
