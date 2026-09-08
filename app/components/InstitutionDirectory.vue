<script setup lang="ts">
import type { InstitutionCategory } from '~~/content/site/institutions'
import {
  getInstitutionCategoryLabel,
  institutionCategories,
  nuclearInstitutions,
  scientificAreas,
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
const activeResearchArea = ref('all')
const selectedId = ref(nuclearInstitutions[0]?.id ?? '')

const filteredInstitutions = computed(() => nuclearInstitutions.filter((institution) => {
  const matchesType = activeFilter.value === 'all' || institution.category === activeFilter.value
  const matchesScience = activeResearchArea.value === 'all' || institution.researchAreas?.includes(activeResearchArea.value)
  return matchesType && matchesScience
}))

const selectedInstitution = computed(() => nuclearInstitutions.find(institution => institution.id === selectedId.value)
  ?? filteredInstitutions.value[0])

function selectFilter(filter: FilterId) {
  activeFilter.value = filter
  const selectionIsVisible = filteredInstitutions.value.some(institution => institution.id === selectedId.value)
  if (!selectionIsVisible) {
    selectedId.value = filteredInstitutions.value[0]?.id ?? ''
  }
}

function selectResearchArea(area: string) {
  activeResearchArea.value = area
  const selectionIsVisible = filteredInstitutions.value.some(institution => institution.id === selectedId.value)
  if (!selectionIsVisible) selectedId.value = filteredInstitutions.value[0]?.id ?? ''
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
    <div class="map-filter-group">
      <p><strong>Institution type</strong></p>
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
    </div>

    <div class="map-filter-group">
      <label for="research-area-filter"><strong>Scientific area</strong></label>
      <select id="research-area-filter" :value="activeResearchArea" @change="selectResearchArea(($event.target as HTMLSelectElement).value)">
        <option value="all">All scientific areas</option>
        <option v-for="area in scientificAreas" :key="area" :value="area">{{ area }}</option>
      </select>
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
      <p v-if="selectedInstitution.character"><strong>{{ selectedInstitution.character }}</strong></p>
      <p>{{ selectedInstitution.summary }}</p>
      <div v-if="selectedInstitution.researchAreas?.length" class="map-detail__section">
        <h4>Research areas</h4>
        <ul class="map-detail__tags"><li v-for="area in selectedInstitution.researchAreas" :key="area">{{ area }}</li></ul>
      </div>
      <div v-if="selectedInstitution.researchers?.length" class="map-detail__section">
        <h4>Researchers and groups</h4>
        <p>{{ selectedInstitution.researchers.map(researcher => researcher.name).join(' · ') }}</p>
      </div>
      <div v-if="selectedInstitution.facilities?.length" class="map-detail__section">
        <h4>Facilities</h4>
        <p>{{ selectedInstitution.facilities.map(facility => facility.name).join(' · ') }}</p>
      </div>
      <a v-if="selectedInstitution.officialUrl" class="text-link" :href="selectedInstitution.officialUrl" target="_blank" rel="noopener noreferrer">
        Visit official website <span aria-hidden="true">↗</span>
      </a>
    </article>
    <p v-else class="map-detail" role="status">No institutions match both selected filters. Choose another institution type or scientific area.</p>

    <div class="map-alternative" aria-labelledby="map-list-title">
      <div class="map-list-heading">
        <h3 id="map-list-title">Browse institutions as a list</h3>
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
      Map boundary source: <a href="https://surveyofindia.gov.in/pages/outline-maps-of-india" target="_blank" rel="noopener noreferrer">Survey of India, 1:16 million generalized vector outline</a>. Markers indicate cities for national-scale orientation and are separated where several entries share a city.
    </p>
  </div>
</template>
