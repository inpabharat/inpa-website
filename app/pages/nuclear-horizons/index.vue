<script setup lang="ts">
import { bulletinSources, currentLeadership, publicContact } from '~~/content/site/bulletin-sources'
import { nuclearHorizonsContent } from '~~/content/site/home'

const latestIssue = bulletinSources.find(issue => issue.id === 'nuclear-horizons-1-2')!

useSeoMeta({
  title: 'Nuclear Horizons',
  description: 'Read and download Nuclear Horizons, the official bulletin of the Indian Nuclear Physics Association.',
  robots: 'index, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Official INPA publication</p>
        <h1>{{ nuclearHorizonsContent.title }}</h1>
        <p>{{ nuclearHorizonsContent.summary }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container publication-page-intro">
        <div>
          <p class="eyebrow">Latest issue</p>
          <h2>Ideas, research and community news</h2>
          <p class="lead">{{ nuclearHorizonsContent.descriptor }}</p>
          <dl class="publication-facts">
            <div><dt>Chief Editor</dt><dd>{{ currentLeadership.chiefEditor.name }}, {{ currentLeadership.chiefEditor.affiliation }}</dd></div>
            <div><dt>Publication contact</dt><dd><a :href="`mailto:${publicContact.email}`">{{ publicContact.email }}</a></dd></div>
          </dl>
          <NuxtLink class="text-link" to="/nuclear-horizons/archive">View all published issues <span aria-hidden="true">→</span></NuxtLink>
        </div>
        <PublicationIssueCard :issue="latestIssue" />
      </div>
    </section>
  </div>
</template>
