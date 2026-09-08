<script setup lang="ts">
useSeoMeta({
  title: 'The Nuclear Physics Landscape of India',
  description: 'A living national resource mapping nuclear-physics research and capability across India.',
  robots: 'index, follow',
})
</script>

<template>
  <main class="section map-section">
    <div class="container map-page-heading">
      <p class="eyebrow">Nuclear Physics in India</p>
      <h1>The Nuclear Physics Landscape of India</h1>
      <p class="landscape-subtitle">People · Research Groups · Institutions · Facilities</p>
      <p class="lead">A living national resource mapping nuclear-physics research and capability across India—from national laboratories and accelerator facilities to universities, IITs, NITs and colleges.</p>
    </div>
    <div class="container">
      <InstitutionDirectory />
      <div class="landscape-questions" aria-label="Questions this resource is designed to answer">
        <p><strong>Where?</strong><span>Where is nuclear physics being pursued?</span></p>
        <p><strong>What?</strong><span>What research is being carried out?</span></p>
        <p><strong>Who?</strong><span>Who are the active researchers and groups?</span></p>
        <p><strong>With what?</strong><span>What facilities and capabilities are available?</span></p>
      </div>
      <p class="map-scope-note"><strong>Coverage:</strong> The directory combines established national centres with the North India V1.0 academic dataset. Inclusion reflects current nuclear-physics research activity rather than institutional category. Other regions and detailed researcher profiles will be added progressively.</p>
    </div>
  </main>
</template>
