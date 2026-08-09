<script setup lang="ts">
import type { InstitutionCategory } from '~~/content/site/institutions'
import {
  getInstitutionCategoryLabel,
  institutionCategories,
  nuclearInstitutions,
} from '~~/content/site/institutions'

type FilterId = 'all' | InstitutionCategory

const mapBounds = {
  minLongitude: 68.179,
  maxLongitude: 97.413,
  minLatitude: 6.755,
  maxLatitude: 37.087,
  horizontalMargin: 1.714,
  verticalMargin: 1.655,
  drawableWidth: 96.572,
  drawableHeight: 96.69,
} as const

const activeFilter = ref<FilterId>('all')
const selectedId = ref(nuclearInstitutions[0]?.id ?? '')

const filteredInstitutions = computed(() => activeFilter.value === 'all'
  ? nuclearInstitutions
  : nuclearInstitutions.filter(institution => institution.category === activeFilter.value))

const selectedInstitution = computed(() => nuclearInstitutions.find(institution => institution.id === selectedId.value)
  ?? filteredInstitutions.value[0])

function selectFilter(filter: FilterId) {
  activeFilter.value = filter
  const selectionIsVisible = filteredInstitutions.value.some(institution => institution.id === selectedId.value)
  if (!selectionIsVisible) {
    selectedId.value = filteredInstitutions.value[0]?.id ?? ''
  }
}

function getMarkerStyle(institution: typeof nuclearInstitutions[number]) {
  const longitudeFraction = (institution.coordinates.longitude - mapBounds.minLongitude)
    / (mapBounds.maxLongitude - mapBounds.minLongitude)
  const latitudeFraction = (mapBounds.maxLatitude - institution.coordinates.latitude)
    / (mapBounds.maxLatitude - mapBounds.minLatitude)

  return {
    left: `${mapBounds.horizontalMargin + longitudeFraction * mapBounds.drawableWidth + (institution.markerOffset?.x ?? 0)}%`,
    top: `${mapBounds.verticalMargin + latitudeFraction * mapBounds.drawableHeight + (institution.markerOffset?.y ?? 0)}%`,
  }
}
</script>

<template>
  <div class="institution-directory">
    <div class="map-filters" aria-label="Filter institutions by type">
      <button
        v-for="category in institutionCategories"
        :key="category.id"
        class="map-filter"
        :class="{ 'map-filter--active': activeFilter === category.id }"
        type="button"
        :aria-pressed="activeFilter === category.id"
        @click="selectFilter(category.id)"
      >
        {{ category.label }}
      </button>
    </div>

    <div class="nuclear-map" aria-label="Interactive geographic overview of major nuclear-science centres on an official outline map of India">
      <img class="nuclear-map__outline" src="/images/india-outline.svg" alt="Outline map of India from Survey of India" width="700" height="725">
      <button
        v-for="(institution, index) in filteredInstitutions"
        :key="institution.id"
        class="map-marker"
        :class="[`map-marker--${institution.category}`, { 'map-marker--selected': selectedId === institution.id }]"
        type="button"
        :style="getMarkerStyle(institution)"
        :data-label="institution.shortName"
        :aria-label="`${institution.name}, ${institution.city}`"
        :aria-pressed="selectedId === institution.id"
        @click="selectedId = institution.id"
        @focus="selectedId = institution.id"
      >
        <span aria-hidden="true">{{ index + 1 }}</span>
      </button>
    </div>

    <article v-if="selectedInstitution" class="map-detail" aria-live="polite">
      <p class="map-detail__type">{{ getInstitutionCategoryLabel(selectedInstitution.category) }}</p>
      <h3>{{ selectedInstitution.name }}</h3>
      <p class="map-detail__location">{{ selectedInstitution.city }}, {{ selectedInstitution.state }}</p>
      <p>{{ selectedInstitution.summary }}</p>
      <a class="text-link" :href="selectedInstitution.officialUrl" target="_blank" rel="noopener noreferrer">
        Visit official website <span aria-hidden="true">↗</span>
      </a>
    </article>

    <div class="map-alternative" aria-labelledby="map-list-title">
      <div class="map-list-heading">
        <h3 id="map-list-title">Keyboard-accessible centre list</h3>
        <span>{{ filteredInstitutions.length }} shown</span>
      </div>
      <ul class="institution-list">
        <li v-for="(institution, index) in filteredInstitutions" :key="institution.id">
          <button type="button" @click="selectedId = institution.id">
            <strong>{{ index + 1 }}. {{ institution.shortName }}</strong>
            <span>{{ institution.city }}, {{ institution.state }}</span>
          </button>
        </li>
      </ul>
    </div>

    <p class="map-attribution">
      Map boundary source: <a href="https://surveyofindia.gov.in/pages/outline-maps-of-india" target="_blank" rel="noopener noreferrer">Survey of India, 1:16 million generalized vector outline</a>. Coordinates are for national-scale orientation; markers sharing a city are slightly separated for readability.
    </p>
  </div>
</template>
