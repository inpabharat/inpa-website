<script setup lang="ts">
import { communityHighlights } from '~~/content/site/home'

const track = ref<HTMLElement | null>(null)
const canScrollBack = ref(false)
const canScrollForward = ref(true)

function move(direction: -1 | 1) {
  if (!track.value) {
    return
  }

  track.value.scrollBy({
    left: direction * track.value.clientWidth * 0.85,
    behavior: 'smooth',
  })
}

function updateScrollState() {
  if (!track.value) {
    return
  }

  const maximum = track.value.scrollWidth - track.value.clientWidth
  canScrollBack.value = track.value.scrollLeft > 2
  canScrollForward.value = track.value.scrollLeft < maximum - 2
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
      <div class="community-highlights__heading">
        <SectionHeading
          id="community-highlights-title"
          eyebrow="Community highlights"
          title="INPA in action"
          :intro="communityHighlights.introduction"
        />
        <div class="community-highlights__controls" aria-label="Community highlights carousel controls">
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

      <div
        ref="track"
        class="community-highlights__track"
        tabindex="0"
        aria-label="Community highlight photographs. Swipe or scroll horizontally to explore."
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
              width="1600"
              height="1066"
              loading="lazy"
            >
            <figcaption>
              <p class="meta">{{ item.date }} · {{ item.location }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.caption }}</p>
            </figcaption>
          </figure>
        </article>
      </div>

      <div class="community-highlights__footer">
        <p class="source-note">{{ communityHighlights.credit }}</p>
        <NuxtLink class="text-link" to="/community">Explore community updates <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
