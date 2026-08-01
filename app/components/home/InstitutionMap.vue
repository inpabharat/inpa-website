<template>
  <section class="section map-section" aria-labelledby="map-title">
    <div class="container map-layout">
      <div>
        <p class="eyebrow">India’s nuclear physics map</p>
        <h2 id="map-title">A national resource, built on verified data</h2>
        <p class="lead">The map surface and its equivalent keyboard-accessible list are ready to receive an approved institution dataset.</p>
        <PlaceholderNotice message="No institutions, facilities, profiles or coordinates are shown until they are verified." />
        <NuxtLink class="button button--navy" to="/map">Open the map framework</NuxtLink>
      </div>
      <div class="map-placeholder" role="img" aria-label="Development placeholder for an accessible map of verified Indian nuclear physics institutions">
        <span class="map-placeholder__outline" aria-hidden="true" />
        <p>Verified map data required</p>
      </div>
    </div>
    <div class="container map-alternative" aria-labelledby="map-list-title">
      <h3 id="map-list-title">Institution list alternative</h3>
      <p>No verified institution entries have been added.</p>
    </div>
  </section>
</template>
