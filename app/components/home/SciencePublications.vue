<script setup lang="ts">
import { nuclearHorizonsContent, researchContent } from '~~/content/site/home'
</script>

<template>
  <section class="section science-publications" aria-labelledby="science-publications-title">
    <div class="container">
      <SectionHeading
        id="science-publications-title"
        eyebrow="Science and publications"
        title="Research at the centre of INPA"
        intro="A selected research feature sits alongside verified information from INPA’s official bulletin."
      />

      <div class="science-publications__grid">
        <article class="science-publications__research">
          <p class="eyebrow eyebrow--light">{{ researchContent.eyebrow }}</p>
          <h3>{{ researchContent.title }}</h3>
          <p>{{ researchContent.summary }}</p>
          <dl class="science-publications__metadata">
            <div><dt>Authors</dt><dd>{{ researchContent.authors }}</dd></div>
            <div><dt>Publication</dt><dd>{{ researchContent.publication }}</dd></div>
          </dl>
          <NuxtLink class="text-link text-link--light" :to="researchContent.to">Explore the research feature <span aria-hidden="true">→</span></NuxtLink>
        </article>

        <article class="science-publications__bulletin">
          <p class="eyebrow">Official INPA bulletin</p>
          <h3>{{ nuclearHorizonsContent.title }}</h3>
          <p>{{ nuclearHorizonsContent.summary }}</p>
          <p><strong>Latest verified issue:</strong> {{ nuclearHorizonsContent.issues[0].label }} · {{ nuclearHorizonsContent.issues[0].date }}</p>
          <div class="science-publications__actions">
            <a class="text-link" :href="nuclearHorizonsContent.issues[0].downloadPath" download>Download latest issue <span aria-hidden="true">↓</span></a>
            <NuxtLink class="text-link" to="/nuclear-horizons">Explore Nuclear Horizons <span aria-hidden="true">→</span></NuxtLink>
            <NuxtLink class="text-link" :to="nuclearHorizonsContent.archiveTo">Issue archive <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
