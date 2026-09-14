<script setup lang="ts">
import type { PublicCarouselItem } from '../../../shared/types/content'
import { publicMediaUrl } from '~/utils/media'

const props = defineProps<{ items: PublicCarouselItem[] }>()
const activeIndex = ref(0)
const failedImages = ref(new Set<string>())
const touchStart = ref<{ x: number, y: number } | null>(null)
const activeSlide = computed(() => props.items[activeIndex.value] ?? null)

watch(() => props.items.length, (length) => {
  if (length === 0) activeIndex.value = 0
  else if (activeIndex.value >= length) activeIndex.value = length - 1
})

function showSlide(index: number): void {
  if (!props.items.length) return
  activeIndex.value = (index + props.items.length) % props.items.length
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    showSlide(activeIndex.value - 1)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    showSlide(activeIndex.value + 1)
  }
}

function onTouchStart(event: TouchEvent): void {
  const touch = event.touches[0]
  if (touch) touchStart.value = { x: touch.clientX, y: touch.clientY }
}

function onTouchEnd(event: TouchEvent): void {
  const start = touchStart.value
  const touch = event.changedTouches[0]
  touchStart.value = null
  if (!start || !touch) return

  const deltaX = touch.clientX - start.x
  const deltaY = touch.clientY - start.y
  if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.25) return
  showSlide(activeIndex.value + (deltaX < 0 ? 1 : -1))
}

function markImageFailed(id: string): void {
  failedImages.value = new Set(failedImages.value).add(id)
}
</script>

<template>
  <div
    v-if="activeSlide"
    class="slideshow"
    role="region"
    aria-roledescription="carousel"
    aria-label="Featured updates"
    tabindex="0"
    @keydown="onKeydown"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    @touchcancel="touchStart = null"
  >
    <Transition name="slide" mode="out-in">
      <article :key="activeSlide.id" class="slideshow__slide" aria-live="polite">
        <div class="slideshow__media">
          <img
            v-if="!failedImages.has(activeSlide.id) && publicMediaUrl(activeSlide.imageKey)"
            :src="publicMediaUrl(activeSlide.imageKey) ?? undefined"
            :alt="activeSlide.imageAlt"
            width="720"
            height="405"
            @error="markImageFailed(activeSlide.id)"
          >
          <div v-else class="slideshow__image-fallback" role="img" :aria-label="activeSlide.imageAlt">
            <span aria-hidden="true">INPA</span>
          </div>
          <span class="slideshow__count">{{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}</span>
        </div>

        <div class="slideshow__body">
          <p v-if="activeSlide.eyebrow" class="slideshow__eyebrow">{{ activeSlide.eyebrow }}</p>
          <h2 class="slideshow__title">{{ activeSlide.title }}</h2>
          <p v-if="activeSlide.summary" class="slideshow__summary">{{ activeSlide.summary }}</p>
          <NuxtLink v-if="activeSlide.ctaLabel && activeSlide.ctaUrl" class="slideshow__link" :to="activeSlide.ctaUrl">
            {{ activeSlide.ctaLabel }} <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </article>
    </Transition>

    <div v-if="items.length > 1" class="slideshow__navigation">
      <button type="button" class="slideshow__arrow" aria-label="Show previous featured update" @click="showSlide(activeIndex - 1)">
        <span aria-hidden="true">←</span>
      </button>
      <div class="slideshow__selectors" aria-label="Choose featured update">
        <button
          v-for="(item, index) in items"
          :key="item.id"
          type="button"
          :class="['slideshow__selector', { 'slideshow__selector--active': index === activeIndex }]"
          :aria-label="`Show featured update ${index + 1}: ${item.title}`"
          :aria-current="index === activeIndex ? 'true' : undefined"
          @click="showSlide(index)"
        />
      </div>
      <button type="button" class="slideshow__arrow" aria-label="Show next featured update" @click="showSlide(activeIndex + 1)">
        <span aria-hidden="true">→</span>
      </button>
    </div>
    <p class="slideshow__hint">Use left and right arrow keys when this feature is focused.</p>
  </div>
</template>

<style scoped>
.slideshow {
  --slideshow-border: rgb(255 255 255 / 22%);
  outline: none;
  touch-action: pan-y;
}

.slideshow:focus-visible {
  box-shadow: inset 0 0 0 3px var(--color-gold-300);
}

.slideshow__slide {
  display: grid;
  min-width: 0;
}

.slideshow__media {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--slideshow-border);
  background: #071d30;
}

.slideshow__media::after {
  position: absolute;
  inset: auto 0 0;
  height: 45%;
  background: linear-gradient(transparent, rgb(4 19 33 / 72%));
  content: "";
  pointer-events: none;
}

.slideshow__media img,
.slideshow__image-fallback {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.slideshow__image-fallback {
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 70% 30%, rgb(200 155 60 / 24%), transparent 30%),
    linear-gradient(145deg, #103b5e, #061a2c);
  color: rgb(255 255 255 / 35%);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.5rem, 8vw, 5rem);
  letter-spacing: 0.12em;
}

.slideshow__count {
  position: absolute;
  right: 1rem;
  bottom: 0.8rem;
  z-index: 1;
  color: white;
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
  font-weight: 750;
  letter-spacing: 0.12em;
}

.slideshow__body {
  display: grid;
  min-width: 0;
  padding: clamp(1.25rem, 3vw, 1.8rem);
  gap: 0.7rem;
}

.slideshow__eyebrow {
  margin: 0;
  color: var(--color-gold-300);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.slideshow__title {
  max-width: 100%;
  margin: 0;
  overflow-wrap: anywhere;
  color: white;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.45rem, 2.5vw, 2rem);
  line-height: 1.12;
}

.slideshow__summary {
  max-width: 58ch;
  margin: 0;
  overflow-wrap: anywhere;
  color: #d6e1e7;
  line-height: 1.55;
}

.slideshow__link {
  width: fit-content;
  color: white;
  font-weight: 750;
  text-decoration-color: var(--color-gold-300);
  text-decoration-thickness: 2px;
  text-underline-offset: 0.3rem;
}

.slideshow__navigation {
  display: grid;
  align-items: center;
  padding: 0 1rem 1rem;
  grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
  gap: 0.75rem;
}

.slideshow__arrow,
.slideshow__selector {
  border: 1px solid rgb(255 255 255 / 42%);
  background: rgb(255 255 255 / 6%);
  color: white;
  cursor: pointer;
}

.slideshow__arrow {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.15rem;
}

.slideshow__selectors {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: center;
  overflow-x: auto;
  gap: 0.55rem;
  scrollbar-width: none;
}

.slideshow__selector {
  position: relative;
  flex: 0 0 auto;
  width: 2.2rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  background: transparent;
}

.slideshow__selector::before {
  position: absolute;
  top: 50%;
  right: 0.2rem;
  left: 0.2rem;
  height: 0.35rem;
  background: rgb(255 255 255 / 38%);
  content: "";
  transform: translateY(-50%);
}

.slideshow__selector--active {
  width: 3.2rem;
}

.slideshow__selector--active::before {
  background: var(--color-gold-300);
}

.slideshow__arrow:hover,
.slideshow__arrow:focus-visible {
  border-color: var(--color-gold-300);
  background: rgb(200 155 60 / 16%);
}

.slideshow__selector:focus-visible {
  outline: 2px solid white;
  outline-offset: 3px;
}

.slideshow__hint {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.slide-enter-active,
.slide-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(0.75rem);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-0.75rem);
}

@media (max-width: 35rem) {
  .slideshow__body {
    padding: 1.1rem;
  }

}

@media (prefers-reduced-motion: reduce) {
  .slide-enter-active,
  .slide-leave-active {
    transition: none;
  }
}
</style>
