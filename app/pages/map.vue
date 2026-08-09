<script setup lang="ts">
useSeoMeta({
  title: 'India’s nuclear physics map',
  description: 'An accessible interactive overview of major nuclear-science centres and national research facilities in India.',
  robots: 'index, follow',
})
</script>

<template>
  <main class="section map-section">
    <div class="container map-page-heading">
      <p class="eyebrow">National scientific resource</p>
      <h1>India’s nuclear physics map</h1>
      <p class="lead">Select a marker or use the centre list to explore major Indian nuclear-science institutions and reach their official websites.</p>
      <p class="source-note">This curated overview is based on current Department of Atomic Energy, University Grants Commission and institution sources. The boundary uses Survey of India vector data and markers use campus-area coordinates; the official institutional website remains authoritative.</p>
    </div>
    <div class="container">
      <InstitutionDirectory />
      <p class="map-scope-note"><strong>Scope:</strong> DAE research centres, selected DAE-supported institutes with direct nuclear, accelerator or plasma-science relevance, and national university user facilities. It excludes power stations and is not a complete list of university departments or laboratories.</p>
    </div>
  </main>
</template>
