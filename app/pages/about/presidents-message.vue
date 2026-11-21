<script setup lang="ts">
import { presidentContent } from '~~/content/site/president'

useSeoMeta({
  title: presidentContent.title,
  description: presidentContent.description,
  robots: 'index, follow',
})
</script>

<template>
  <article class="presidents-letter" aria-labelledby="presidents-message-title">
    <header class="page-hero">
      <div class="container presidents-letter__container">
        <h1 id="presidents-message-title">{{ presidentContent.title }}</h1>
      </div>
    </header>

    <div class="section section--white">
      <div class="container presidents-letter__container presidents-letter__layout">
        <figure class="presidents-letter__portrait">
          <img v-bind="presidentContent.portrait" :alt="`Portrait of ${presidentContent.name}`">
          <figcaption>
            <strong>{{ presidentContent.name }}</strong>
            <span>{{ presidentContent.affiliation }}</span>
            <span>{{ presidentContent.role }}</span>
          </figcaption>
        </figure>

        <div class="presidents-letter__message">
          <p class="presidents-letter__greeting">{{ presidentContent.greeting }}</p>
          <p v-for="(paragraph, index) in presidentContent.paragraphs" :key="index">
            <template v-for="(part, partIndex) in paragraph" :key="partIndex">
              <template v-if="typeof part === 'string'">{{ part }}</template>
              <strong v-else-if="'strong' in part">{{ part.strong }}</strong>
              <em v-else>{{ part.emphasis }}</em>
            </template>
          </p>
          <p class="presidents-letter__signoff">
            <strong>{{ presidentContent.name }}</strong>
            <br>{{ presidentContent.affiliation }}
            <br>{{ presidentContent.role }}
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.presidents-letter__container {
  --content-width: 65rem;
}

.presidents-letter__layout {
  display: grid;
  align-items: start;
  gap: clamp(1.75rem, 4vw, 4rem);
}

.presidents-letter__portrait {
  display: grid;
  grid-template-columns: 5.5rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.presidents-letter__portrait img {
  width: 100%;
  height: auto;
  border-radius: var(--radius);
}

.presidents-letter__portrait figcaption {
  display: grid;
  gap: 0.2rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.45;
}

.presidents-letter__portrait strong {
  color: var(--color-navy-950);
  font-family: var(--font-display);
  font-size: 1.25rem;
  line-height: 1.2;
  text-wrap: balance;
}

.presidents-letter__message {
  max-width: 70ch;
  font-size: clamp(1rem, 0.97rem + 0.2vw, 1.125rem);
  line-height: 1.75;
}

.presidents-letter__message p {
  margin-block: 0 1.25rem;
}

.presidents-letter__greeting {
  font-weight: 650;
}

.presidents-letter__message .presidents-letter__signoff {
  margin-block: 1.75rem 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  color: var(--color-navy-950);
}

@media (min-width: 48rem) {
  .presidents-letter__layout {
    grid-template-columns: minmax(0, 1fr) minmax(12rem, 15rem);
    grid-template-areas: 'message portrait';
  }

  .presidents-letter__message {
    grid-area: message;
  }

  .presidents-letter__portrait {
    grid-area: portrait;
    grid-template-columns: minmax(0, 1fr);
  }

  .presidents-letter__portrait strong {
    font-size: 1.1875rem;
  }
}
</style>
