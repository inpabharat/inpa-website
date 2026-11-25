<script setup lang="ts">
import { dedicatedSections } from '~~/content/site/home'

/* Line icons drawn on one 24px grid with one stroke weight, so the set reads as a family. */
const iconPaths: Record<(typeof dedicatedSections)[number]['icon'], string[]> = {
  // An accelerator ring with its beamline.
  facility: [
    'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z',
    'M19 12h3',
    'M12 2v3',
    'M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
  ],
  // A path leading up and onward.
  opportunity: [
    'M4 19h4v-4h4v-4h4V7h4',
    'M16 3h4v4',
  ],
  // A researcher and a colleague.
  expertise: [
    'M9 4.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
    'M3.5 19.5a5.5 5.5 0 0 1 11 0',
    'M16.5 6a2.5 2.5 0 1 1 0 5',
    'M17 14.2a5 5 0 0 1 3.5 5.3',
  ],
  // Three groups joined into one network.
  collaboration: [
    'M6 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
    'M18 4.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
    'M12 15a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z',
    'M8.5 7h7',
    'M7.3 9.2l3.4 6',
    'M16.7 9.2l-3.4 6',
  ],
}
</script>

<template>
  <section id="explore" class="section explore-gateway" aria-labelledby="explore-inpa-title">
    <div class="container explore-gateway__layout">
      <header>
        <h2 id="explore-inpa-title">Explore Nuclear Physics in India</h2>
        <p class="section-heading__intro">Find the scientific people, places and possibilities that can turn a question into an experiment, opportunity or collaboration.</p>
      </header>

      <nav class="explore-gateway__links" aria-label="Explore nuclear physics in India">
        <NuxtLink v-for="item in dedicatedSections" :key="item.title" :to="item.to">
          <span class="explore-gateway__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path v-for="path in iconPaths[item.icon]" :key="path" :d="path" />
            </svg>
          </span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.summary }}</small>
          </span>
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>
