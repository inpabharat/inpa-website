<script setup lang="ts">
import type { BulletinSource } from '~~/content/site/bulletin-sources'

defineProps<{ issue: BulletinSource }>()
</script>

<template>
  <article class="issue-card">
    <a :href="issue.downloadPath" class="issue-card__cover-link" :aria-label="`Open ${issue.issueLabel} PDF`">
      <img
        class="issue-card__cover"
        :src="issue.coverImage"
        :alt="`Cover of Nuclear Horizons, ${issue.issueLabel}`"
        width="992"
        height="1403"
        loading="lazy"
      >
    </a>
    <div class="issue-card__body">
      <p class="eyebrow">{{ issue.publicationDate }}</p>
      <h2>{{ issue.issueLabel }}</h2>
      <p>{{ issue.pageCount }} pages · PDF · {{ issue.fileSize }}</p>
      <div class="issue-card__actions">
        <a class="button button--navy" :href="issue.downloadPath" download>Download PDF</a>
        <a class="text-link" :href="issue.downloadPath" target="_blank" rel="noopener noreferrer">Read online <span aria-hidden="true">↗</span></a>
      </div>
    </div>
  </article>
</template>
