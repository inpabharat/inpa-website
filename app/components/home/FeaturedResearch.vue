<script setup lang="ts">
import { recurringFeatureContent, researchContent } from '~~/content/site/home'
</script>

<template>
  <section class="section research-section" aria-labelledby="research-title">
    <div class="container">
      <SectionHeading id="research-title" eyebrow="Featured research" title="The scientific heart of the homepage" intro="Curated research will be selected editorially, never generated from an unreviewed feed." />
      <div class="research-grid">
        <article class="research-spotlight">
          <p class="eyebrow eyebrow--light">{{ researchContent.eyebrow }}</p>
          <h3>{{ researchContent.title }}</h3>
          <PlaceholderNotice :message="researchContent.status" />
          <p>{{ researchContent.summary }}</p>
          <dl class="metadata-list">
            <div><dt>Authors</dt><dd>{{ researchContent.authors }}</dd></div>
            <div><dt>Institutions</dt><dd>{{ researchContent.institutions }}</dd></div>
            <div><dt>Published in</dt><dd>{{ researchContent.publication }}</dd></div>
          </dl>
          <NuxtLink class="text-link text-link--light" :to="researchContent.to">Explore research features <span aria-hidden="true">→</span></NuxtLink>
        </article>
        <article class="signature-card">
          <p class="eyebrow">{{ recurringFeatureContent.eyebrow }}</p>
          <h3>{{ recurringFeatureContent.title }}</h3>
          <p>{{ recurringFeatureContent.summary }}</p>
          <p class="signature-card__rule">{{ recurringFeatureContent.requirements }}</p>
          <PlaceholderNotice :message="recurringFeatureContent.status" />
        </article>
      </div>
    </div>
  </section>
</template>
