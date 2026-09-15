<script setup lang="ts">
import { formatSessionTime } from '~~/shared/utils/session-time'

const props = defineProps<{
  expiresAt: string | null
  isDevelopment?: boolean
}>()

const now = ref(0)
let timer: ReturnType<typeof setInterval> | undefined

const remainingSeconds = computed(() => {
  if (!props.expiresAt || now.value === 0) return null
  return Math.max(0, Math.ceil((Date.parse(props.expiresAt) - now.value) / 1000))
})
const remainingLabel = computed(() => remainingSeconds.value === null ? '' : formatSessionTime(remainingSeconds.value))

onMounted(() => {
  now.value = Date.now()
  timer = setInterval(() => { now.value = Date.now() }, 1000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <p v-if="isDevelopment" class="admin-session-timer">Local development session</p>
  <p v-else-if="!expiresAt" class="admin-session-timer">Session expiry is unavailable</p>
  <p v-else-if="remainingSeconds === 0" class="admin-session-timer admin-session-timer--expired" role="alert">
    Session expired — sign in again before making changes.
  </p>
  <p v-else class="admin-session-timer" aria-live="off">
    Session time remaining:
    <time :datetime="expiresAt">{{ remainingLabel || 'Calculating…' }}</time>
  </p>
</template>
