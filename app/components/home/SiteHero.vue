<script setup lang="ts">
import type { PublicCarouselItem } from '../../../shared/types/content'
import { heroContent } from '~~/content/site/home'

defineProps<{ carousel: PublicCarouselItem[] }>()
const animationPaused = ref(false)
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <HomeNucleusSimulation :paused="animationPaused" />
    <div class="container hero__content">
      <div class="hero__copy">
        <p class="eyebrow eyebrow--light">Official digital home</p>
        <h1 id="hero-title">{{ heroContent.title }}</h1>
        <p class="hero__mission">{{ heroContent.mission }}</p>
        <p class="hero__tagline">{{ heroContent.tagline }}</p>
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
        <button
          class="hero__motion-control"
          type="button"
          @click="animationPaused = !animationPaused"
        >
          {{ animationPaused ? 'Resume background animation' : 'Pause background animation' }}
        </button>
      </div>

      <aside class="hero__feature" :aria-label="carousel.length ? 'Featured updates' : 'INPA focus'">
        <HomeHeroSlideshow v-if="carousel.length" :items="carousel" />
        <div v-else class="hero__focus">
          <ul class="hero__focus-list">
            <li v-for="item in heroContent.focusAreas" :key="item">{{ item }}</li>
          </ul>
        </div>
        <p class="hero__statement">{{ heroContent.source }}</p>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.hero__feature {
  overflow: hidden;
  padding: 0;
  border-color: rgb(255 255 255 / 28%);
  background: rgb(4 19 33 / 72%);
}

.hero__focus {
  padding: clamp(1.25rem, 3vw, 2rem);
}

.hero__statement {
  margin: 0;
  padding: 0 clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2rem);
}

@media (min-width: 60rem) {
  .hero__content {
    padding-block: clamp(2.5rem, 4vw, 3.5rem);
    grid-template-columns: minmax(0, 1.05fr) minmax(25rem, 0.95fr);
    gap: clamp(2.5rem, 4vw, 4.5rem);
  }

  .hero__copy h1 {
    max-width: 16ch;
    font-size: clamp(3rem, 4.2vw, 4.5rem);
  }
}

@media (min-width: 60rem) and (max-height: 60rem) {
  .hero__content {
    padding-block: 2.5rem;
  }

  .hero__copy h1 {
    margin-bottom: 1rem;
    font-size: clamp(3rem, 4vw, 4.25rem);
  }

  .hero__mission {
    font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  }
}
</style>
