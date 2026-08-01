<template>
  <section class="section section--subtle" aria-labelledby="people-title">
    <div class="container">
      <div class="section-heading-row">
        <SectionHeading id="people-title" eyebrow="Distinguished scientists" title="Pioneers and contemporary leaders" intro="The gallery will support curated editorial series without turning unverified biographies into public claims." />
        <NuxtLink class="text-link" to="/people">View people route <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <div class="placeholder-gallery" aria-label="Scientist profile placeholders">
        <article v-for="series in ['Founder of the Month', 'Pioneer Series', 'Young Investigator', 'International Collaborator']" :key="series">
          <div class="avatar-placeholder" aria-hidden="true" />
          <p class="eyebrow">{{ series }}</p>
          <h3>Verified profile required</h3>
          <p>Biography, photograph, affiliation, dates, achievements and credits are awaiting approval.</p>
        </article>
      </div>
    </div>
  </section>
</template>
