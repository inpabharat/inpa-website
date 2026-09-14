<script setup lang="ts">
import type { PublicPublication } from '../../shared/types/science'

withDefaults(defineProps<{
  issue: PublicPublication
  headingLevel?: 'h2' | 'h3'
  showEditorial?: boolean
}>(), {
  headingLevel: 'h2',
  showEditorial: true,
})
</script>

<template>
  <article class="issue-card">
    <a
      :href="publicMediaUrl(issue.pdfKey) ?? undefined"
      class="issue-card__cover-link"
      :aria-label="`Open ${issue.title}, ${issue.issueLabel} PDF`"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        class="issue-card__cover"
        :src="publicMediaUrl(issue.coverImageKey) ?? undefined"
        :alt="issue.coverImageAlt"
        width="992"
        height="1403"
        loading="lazy"
      >
    </a>
    <div class="issue-card__body">
      <p class="eyebrow"><time :datetime="issue.publicationDate">{{ formatIssueMonth(issue.publicationDate) }}</time></p>
      <component :is="headingLevel">{{ issue.issueLabel }}</component>
      <p>{{ issue.summary }}</p>
      <p class="issue-card__meta">Volume {{ issue.volume }} · Issue {{ issue.issueNumber }} · {{ issue.pageCount }} pages</p>

      <div v-if="showEditorial" class="issue-card__notes">
        <div v-if="issue.editorial">
          <h3>Editorial</h3>
          <p>{{ issue.editorial }}</p>
        </div>
        <div v-if="issue.featuredReview">
          <h3>Featured review</h3>
          <p>{{ issue.featuredReview }}</p>
        </div>
      </div>

      <div class="issue-card__actions">
        <a class="button button--navy" :href="publicMediaUrl(issue.pdfKey) ?? undefined" download>Download issue</a>
        <a class="text-link" :href="publicMediaUrl(issue.pdfKey) ?? undefined" target="_blank" rel="noopener noreferrer">Read in browser <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.issue-card__meta {
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

.issue-card__notes {
  margin-block: 1.25rem;
  border-block: 1px solid var(--color-border);
}

.issue-card__notes > div {
  padding-block: 1rem;
}

.issue-card__notes > div + div {
  border-top: 1px solid var(--color-border);
}

.issue-card__notes h3 {
  margin-bottom: 0.35rem;
  color: var(--color-navy-800);
  font-family: inherit;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.issue-card__notes p {
  margin: 0;
  white-space: pre-line;
}
</style>
