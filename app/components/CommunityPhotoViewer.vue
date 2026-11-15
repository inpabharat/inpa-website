<script setup lang="ts">
import type { CommunityHighlightItem } from '~~/content/site/home'

const props = defineProps<{ photos: readonly CommunityHighlightItem[] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const photoTrack = ref<HTMLElement | null>(null)
const closeButton = ref<HTMLButtonElement | null>(null)
const isOpen = ref(false)
const visibleIndex = ref(0)
let photoTrigger: HTMLButtonElement | null = null
let lastWheelStep = Number.NEGATIVE_INFINITY

function openPhoto(index: number, event: MouseEvent): void {
  if (!dialog.value || dialog.value.open || !props.photos[index]) return
  photoTrigger = event.currentTarget as HTMLButtonElement
  visibleIndex.value = index
  lastWheelStep = Number.NEGATIVE_INFINITY
  isOpen.value = true
  dialog.value.showModal()
  nextTick(() => {
    const track = photoTrack.value
    if (track) track.scrollTo({ left: index * track.clientWidth, behavior: 'instant' })
    closeButton.value?.focus({ preventScroll: true })
  })
}

function closePhoto(): void {
  isOpen.value = false
}

function finishClosingPhoto(): void {
  dialog.value?.close()
  photoTrigger?.focus({ preventScroll: true })
  photoTrigger = null
}

function movePhoto(direction: -1 | 1): void {
  const track = photoTrack.value
  const index = visibleIndex.value + direction
  if (!track || index < 0 || index >= props.photos.length) return

  track.scrollTo({
    left: index * track.clientWidth,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}

function updateVisiblePhoto(): void {
  const track = photoTrack.value
  if (!track?.clientWidth) return
  visibleIndex.value = Math.max(0, Math.min(props.photos.length - 1, Math.round(track.scrollLeft / track.clientWidth)))
}

function handleWheel(event: WheelEvent): void {
  if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return
  event.preventDefault()
  const now = performance.now()
  if (now - lastWheelStep < 400) return
  lastWheelStep = now
  movePhoto(event.deltaY < 0 ? -1 : 1)
}
</script>

<template>
  <slot :open-photo="openPhoto" />
  <dialog
    ref="dialog"
    class="community-photo-dialog"
    aria-label="Community highlight photos"
    @cancel.prevent="closePhoto"
    @keydown.left.prevent="movePhoto(-1)"
    @keydown.right.prevent="movePhoto(1)"
  >
    <Transition name="community-photo" @after-leave="finishClosingPhoto">
      <div v-if="isOpen" class="community-photo-dialog__stage" @wheel="handleWheel">
        <button ref="closeButton" type="button" class="community-photo-dialog__close" aria-label="Close photo viewer" @click="closePhoto">
          <span aria-hidden="true">×</span>
        </button>

        <div ref="photoTrack" class="community-photo-dialog__track" @scroll.passive="updateVisiblePhoto">
          <div
            v-for="(photo, index) in photos"
            :key="photo.image"
            class="community-photo-dialog__slide"
            :aria-hidden="index !== visibleIndex"
            @click.self="closePhoto"
          >
            <figure class="community-photo-dialog__figure">
              <img
                :src="photo.image"
                :alt="photo.alt"
                :loading="index === visibleIndex ? 'eager' : 'lazy'"
                draggable="false"
              >
              <figcaption>{{ photo.title }}</figcaption>
            </figure>
          </div>
        </div>

        <div v-if="photos.length > 1" class="community-photo-dialog__controls" role="group" aria-label="Photo navigation">
          <button type="button" aria-label="Previous photo" :aria-disabled="visibleIndex === 0" @click="movePhoto(-1)">
            <span aria-hidden="true">←</span>
          </button>
          <span role="status" class="community-photo-dialog__position">Photo {{ visibleIndex + 1 }} of {{ photos.length }}</span>
          <button type="button" aria-label="Next photo" :aria-disabled="visibleIndex === photos.length - 1" @click="movePhoto(1)">
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </Transition>
  </dialog>
</template>

<style scoped>
.community-photo-dialog {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  border: 0;
  background: transparent;
}

.community-photo-dialog::backdrop {
  background: transparent;
}

:global(html:has(.community-photo-dialog[open])) {
  overflow: hidden;
  scrollbar-gutter: stable;
}

.community-photo-dialog__stage {
  position: relative;
  height: 100%;
  background: rgb(5 17 30 / 94%);
}

.community-photo-dialog__track {
  display: grid;
  height: 100%;
  overflow: auto hidden;
  grid-auto-columns: 100%;
  grid-auto-flow: column;
  overscroll-behavior: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.community-photo-dialog__slide {
  display: grid;
  min-width: 0;
  padding-inline: max(0.75rem, env(safe-area-inset-left)) max(0.75rem, env(safe-area-inset-right));
  place-items: center;
  scroll-snap-align: start;
}

.community-photo-dialog__figure {
  display: grid;
  min-width: 0;
  max-width: min(100%, 74rem);
  justify-items: center;
  margin: 0;
  color: white;
  text-align: center;
  gap: 0.65rem;
}

.community-photo-dialog__figure img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: calc(100dvh - 10rem - env(safe-area-inset-bottom));
  border-radius: 0.25rem;
  box-shadow: 0 0.75rem 3rem rgb(0 0 0 / 28%);
  object-fit: contain;
}

.community-photo-dialog__close,
.community-photo-dialog__controls button {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 55%);
  border-radius: 50%;
  background: var(--color-navy-950);
  color: white;
  cursor: pointer;
  font-size: 1.3rem;
  line-height: 1;
  place-items: center;
}

.community-photo-dialog__close {
  position: absolute;
  z-index: 1;
  top: max(0.75rem, env(safe-area-inset-top));
  right: max(0.75rem, env(safe-area-inset-right));
  font-size: 1.55rem;
}

.community-photo-dialog__controls {
  position: absolute;
  z-index: 1;
  bottom: max(0.75rem, env(safe-area-inset-bottom));
  inset-inline: 0;
  display: flex;
  width: max-content;
  align-items: center;
  margin-inline: auto;
  color: white;
  font-size: 0.85rem;
  gap: 0.85rem;
}

.community-photo-dialog__controls button[aria-disabled="true"] {
  opacity: 0.45;
  cursor: default;
}

.community-photo-dialog__position {
  min-width: 6rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.community-photo-enter-active,
.community-photo-leave-active {
  transition: opacity 240ms ease;
}

.community-photo-enter-active .community-photo-dialog__figure,
.community-photo-leave-active .community-photo-dialog__figure {
  transition: transform 240ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.community-photo-enter-from,
.community-photo-leave-to {
  opacity: 0;
}

.community-photo-enter-from .community-photo-dialog__figure,
.community-photo-leave-to .community-photo-dialog__figure {
  transform: scale(0.86);
}

@media (prefers-reduced-motion: reduce) {
  .community-photo-enter-active,
  .community-photo-leave-active,
  .community-photo-enter-active .community-photo-dialog__figure,
  .community-photo-leave-active .community-photo-dialog__figure {
    transition: none;
  }
}
</style>
