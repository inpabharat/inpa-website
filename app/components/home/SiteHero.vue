<script setup lang="ts">
import type { PublicCarouselItem } from '../../../shared/types/content'
import { heroContent } from '~~/content/site/home'

defineProps<{ carousel: PublicCarouselItem[] }>()
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <HomeNucleusSimulation />
    <div class="container hero__content">
      <div class="hero__copy">
        <p class="eyebrow eyebrow--light">Official digital home</p>
        <h1 id="hero-title">{{ heroContent.title }}</h1>
        <p class="hero__mission"><span>Mission</span>{{ heroContent.mission }}</p>
        <p class="hero__tagline">{{ heroContent.tagline }}</p>
        <p class="hero__statement">{{ heroContent.source }}</p>
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
      </div>

      <aside class="hero__feature" :aria-label="carousel.length ? 'Featured updates' : 'INPA focus'">
        <HomeHeroSlideshow v-if="carousel.length" :items="carousel" />
        <div v-else class="hero__focus">
          <p class="eyebrow eyebrow--light">Science · community · future</p>
          <ul class="hero__focus-list">
            <li v-for="(item, index) in heroContent.focusAreas" :key="item">
              <span aria-hidden="true">0{{ index + 1 }}</span>
              {{ item }}
            </li>
          </ul>
        </div>
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
  box-shadow: 0 1.75rem 5rem rgb(0 0 0 / 24%);
  backdrop-filter: blur(10px);
}

.hero__focus {
  padding: clamp(1.35rem, 3vw, 2rem);
}

@media (min-width: 60rem) {
  .hero__content {
    padding-block: clamp(3rem, 5vw, 4.5rem);
    grid-template-columns: minmax(0, 1.05fr) minmax(25rem, 0.95fr);
    gap: clamp(2.5rem, 4vw, 4.5rem);
  }

  .hero__copy h1 {
    max-width: 16ch;
    font-size: clamp(3.25rem, 4.5vw, 4.8rem);
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
    font-size: clamp(1.65rem, 2.5vw, 2.45rem);
  }
}
</style>
