<template>
  <section class="section map-section" aria-labelledby="map-title">
    <div class="container map-introduction">
      <div>
        <p class="eyebrow">India’s nuclear physics map</p>
        <h2 id="map-title">Major national centres and research facilities</h2>
      </div>
      <div>
        <p class="lead">Explore a curated directory of major Indian institutions supporting nuclear science, accelerator research, atomic-mineral research and plasma science.</p>
        <p class="source-note">Institution identities and classifications were checked against current DAE, UGC and official institution sources. The boundary is the Survey of India’s official generalized vector outline; markers use campus-area coordinates for national-scale orientation.</p>
      </div>
    </div>
    <div class="container">
      <InstitutionDirectory />
      <div class="map-scope-note">
        <strong>Selection boundary:</strong> this is a major-centres overview, not an exhaustive directory of every university laboratory, hospital, industrial unit, regulatory office, mine or nuclear power station.
        <NuxtLink class="text-link" to="/map">Open the full map page <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
