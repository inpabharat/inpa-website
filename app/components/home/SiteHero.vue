<script setup lang="ts">
import type { PublicCarouselItem } from '../../../shared/types/content'
import { heroContent } from '~~/content/site/home'

const props = defineProps<{ carousel: PublicCarouselItem[] }>()
const activeIndex = ref(0)
const activeSlide = computed(() => props.carousel[activeIndex.value] ?? null)

function showPrevious(): void {
  if (props.carousel.length === 0) return
  activeIndex.value = (activeIndex.value - 1 + props.carousel.length) % props.carousel.length
}

function showNext(): void {
  if (props.carousel.length === 0) return
  activeIndex.value = (activeIndex.value + 1) % props.carousel.length
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__scientific-field" aria-hidden="true">
      <span class="orbit orbit--one" />
      <span class="orbit orbit--two" />
      <span class="beam" />
    </div>
    <div class="container hero__content">
      <p class="hero__status">{{ heroContent.imageStatus }}</p>
      <p class="eyebrow eyebrow--light">Official digital home</p>
      <h1 id="hero-title">{{ heroContent.title }}</h1>
      <p class="hero__tagline">{{ heroContent.tagline }}</p>
      <p class="source-note source-note--light">{{ heroContent.source }}</p>
      <div class="hero__actions" aria-label="Featured destinations">
        <NuxtLink
          v-for="(action, index) in heroContent.actions"
          :key="action.to"
          :class="['button', index === 0 ? 'button--gold' : 'button--outline-light']"
          :to="action.to"
        >
          {{ action.label }}
        </NuxtLink>
      </div>

      <div v-if="activeSlide" class="hero__carousel" aria-live="polite">
        <div>
          <p class="eyebrow eyebrow--light">{{ activeSlide.eyebrow }}</p>
          <p class="hero__carousel-title">{{ activeSlide.title }}</p>
          <p v-if="activeSlide.summary">{{ activeSlide.summary }}</p>
        </div>
        <div v-if="carousel.length > 1" class="hero__carousel-controls" aria-label="Carousel controls">
          <button type="button" aria-label="Show previous carousel item" @click="showPrevious">Previous</button>
          <span aria-live="off">{{ activeIndex + 1 }} / {{ carousel.length }}</span>
          <button type="button" aria-label="Show next carousel item" @click="showNext">Next</button>
        </div>
      </div>
    </div>
  </section>
</template>
