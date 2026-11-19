<script setup lang="ts">
import type { AdminFieldAttributes } from '~/composables/useAdminFormErrors'
import { editorTimeOptions, localDateTimeToIso, minimumEndDate, normaliseEditorTime } from '~~/shared/utils/editor-date'

const props = defineProps<{
  label: string
  description?: string
  required?: boolean
  after?: string | null
  field?: AdminFieldAttributes
}>()
const model = defineModel<string | null>({ required: true })
const id = useId()
const dateInput = ref<HTMLInputElement | null>(null)
const timeInput = ref<HTMLInputElement | null>(null)
const validated = ref(false)
const date = computed(() => model.value?.split('T', 1)[0] ?? '')
const time = computed(() => model.value?.slice(date.value.length + 1) ?? '')
const minimum = computed(() => minimumEndDate(props.after ?? null))
const times = computed(() => editorTimeOptions(date.value, props.after ?? null))
const helpId = `${id}-help`
const errorId = `${id}-error`
const dateError = computed(() => {
  if (!date.value && (props.required || time.value)) return 'Choose a date.'
  if (minimum.value && date.value && date.value < minimum.value) return `Choose ${minimum.value} or a later date.`
  return ''
})
const timeError = computed(() => {
  if (!date.value && !time.value) return ''
  const formatted = normaliseEditorTime(time.value)
  if (!formatted) return 'Enter a time in 24-hour format, such as 14:30.'
  if (!date.value || dateError.value) return ''
  const timestamp = localDateTimeToIso(`${date.value}T${formatted}`)
  if (!timestamp) return 'Choose a valid local time for this date.'
  const start = localDateTimeToIso(props.after ?? null)
  if (start && timestamp <= start) return 'Choose a time after the start time.'
  return ''
})
const shownError = computed(() => validated.value ? dateError.value || timeError.value : '')

watch(() => props.after, () => {
  if (date.value && time.value) validated.value = true
})

watchEffect(() => {
  dateInput.value?.setCustomValidity(dateError.value)
  timeInput.value?.setCustomValidity(timeError.value)
}, { flush: 'post' })

function update(dateValue: string, timeValue: string): void {
  model.value = dateValue || timeValue ? `${dateValue}T${timeValue}` : null
}

function finishTime(): void {
  const formatted = normaliseEditorTime(time.value)
  if (formatted) update(date.value, formatted)
  if (date.value || time.value) validated.value = true
}

function pickTime(event: Event): void {
  update(date.value, (event.target as HTMLSelectElement).value)
  validated.value = true
}

async function clear(): Promise<void> {
  model.value = null
  validated.value = false
  await nextTick()
  dateInput.value?.focus()
}
</script>

<template>
  <fieldset class="admin-date-time" :aria-describedby="description ? `${id}-description` : undefined">
    <legend>{{ label }}</legend>
    <p v-if="description" :id="`${id}-description`" class="meta">{{ description }}</p>
    <div class="admin-date-time__controls">
      <label>
        Date
        <input
          ref="dateInput" v-bind="field ?? {}" type="date" :value="date" :min="minimum" :required="required || Boolean(time)"
          :aria-invalid="validated && dateError ? true : field?.['aria-invalid']"
          :aria-describedby="[field?.['aria-describedby'], shownError === dateError && shownError ? errorId : undefined].filter(Boolean).join(' ') || undefined"
          @input="update(($event.target as HTMLInputElement).value, time)" @invalid="validated = true"
        >
      </label>
      <label>
        Time
        <input
          ref="timeInput" type="text" inputmode="numeric" maxlength="5" placeholder="HH:MM" :value="time"
          :required="required || Boolean(date)" :aria-invalid="validated && timeError && !dateError ? true : undefined"
          :aria-describedby="shownError && !dateError ? `${helpId} ${errorId}` : helpId"
          @input="update(date, ($event.target as HTMLInputElement).value)" @blur="finishTime" @invalid="validated = true"
        >
      </label>
    </div>
    <div class="admin-date-time__controls">
      <select
        :aria-label="`Pick ${label.toLowerCase()} time`" :disabled="!times.length" :value="times.includes(time) ? time : ''"
        @change="pickTime"
      >
        <option value="" disabled>Pick a time</option>
        <option v-for="option in times" :key="option" :value="option">{{ option }}</option>
      </select>
      <button v-if="!required && (date || time)" type="button" class="text-button" :aria-label="`Clear ${label.toLowerCase()}`" @click="clear">Clear</button>
    </div>
    <p :id="helpId" class="meta">24-hour time. Type 1430 for 14:30.</p>
    <p v-if="shownError" :id="errorId" class="admin-field-error">{{ shownError }}</p>
  </fieldset>
</template>

<style scoped>
.admin-date-time { display: grid; min-inline-size: 0; margin: 0; padding: .75rem; border: 1px solid var(--color-border); gap: .65rem; }
.admin-date-time legend { padding-inline: .25rem; color: var(--color-navy-950); font-weight: 750; }
.admin-date-time__controls { display: grid; grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr); align-items: end; gap: .5rem; }
.admin-date-time__controls input { min-width: 0; }
.admin-date-time__controls button { justify-self: start; min-height: 2.75rem; }
.admin-date-time p { margin: 0; }
@media (max-width: 23rem) {
  .admin-date-time__controls { grid-template-columns: minmax(0, 1fr); }
}
</style>
