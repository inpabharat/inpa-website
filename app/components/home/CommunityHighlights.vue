<script setup lang="ts">
import { communityHighlights } from '~~/content/site/home'

const track = ref<HTMLElement | null>(null)
const canScrollBack = ref(false)
const canScrollForward = ref(true)
const indicator = ref({ left: '0%', width: '100%' })

function move(direction: -1 | 1) {
  if (!track.value) {
    return
  }

  track.value.scrollBy({
    left: direction * track.value.clientWidth * 0.85,
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}

function updateScrollState() {
  if (!track.value?.scrollWidth) {
    return
  }

  const maximum = track.value.scrollWidth - track.value.clientWidth
  canScrollBack.value = track.value.scrollLeft > 2
  canScrollForward.value = track.value.scrollLeft < maximum - 2
  const offset = Math.max(0, Math.min(track.value.scrollLeft, maximum))
  indicator.value = {
    left: `${100 * offset / track.value.scrollWidth}%`,
    width: `${100 * track.value.clientWidth / track.value.scrollWidth}%`,
  }
}

onMounted(() => {
  window.addEventListener('resize', updateScrollState)
  nextTick(updateScrollState)
})

onBeforeUnmount(() => window.removeEventListener('resize', updateScrollState))
</script>

<template>
  <section class="section section--subtle community-highlights" aria-labelledby="community-highlights-title">
    <div class="container">
      <header class="section-heading">
        <h2 id="community-highlights-title">INPA in action</h2>
        <p class="section-heading__intro">
          <time :datetime="communityHighlights.inauguration.datetime">{{ communityHighlights.inauguration.date }}</time>
          · {{ communityHighlights.inauguration.location }}
        </p>
      </header>

      <div
        ref="track"
        class="community-highlights__track"
        tabindex="0"
        aria-label="Community highlight photographs. Swipe or use the arrow keys to explore."
        @scroll.passive="updateScrollState"
        @keydown.left.prevent="move(-1)"
        @keydown.right.prevent="move(1)"
      >
        <article
          v-for="item in communityHighlights.items"
          :key="item.image"
          class="community-highlight-card"
        >
          <figure>
            <img
              :src="item.image"
              :alt="item.alt"
              width="1599"
              height="1066"
              loading="lazy"
            >
            <figcaption>
              <h3>{{ item.title }}</h3>
            </figcaption>
          </figure>
        </article>
      </div>

      <div class="community-highlights__navigation">
        <div class="community-highlights__indicator" aria-hidden="true">
          <span :style="indicator" />
        </div>
        <div class="community-highlights__controls" role="group" aria-label="Community highlights carousel controls">
          <button
            type="button"
            aria-label="Show previous community highlight"
            :disabled="!canScrollBack"
            @click="move(-1)"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            aria-label="Show next community highlight"
            :disabled="!canScrollForward"
            @click="move(1)"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div class="community-highlights__footer">
        <NuxtLink class="text-link" to="/community">Explore community updates <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
