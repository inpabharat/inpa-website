<script setup lang="ts">
import type { InstitutionCategory } from '~~/content/site/institutions'
import {
  getInstitutionCategoryLabel,
  institutionCategories,
  nuclearInstitutions,
  scientificAreas,
} from '~~/content/site/institutions'
import { groupInstitutionMarkers, type InstitutionMarkerGroup } from '~~/shared/utils/institution-map'

type FilterId = 'all' | InstitutionCategory

const activeFilter = ref<FilterId>('all')
const activeResearchArea = ref('all')
const selectedId = ref(nuclearInstitutions[0]?.id ?? '')
const mobileView = ref<'list' | 'map'>('list')
const mapElement = ref<HTMLElement | null>(null)
const detailElement = ref<HTMLElement | null>(null)
const mapWidth = ref(700)
const selectedGroupId = ref<string | null>(null)
let mapResizeObserver: ResizeObserver | undefined

const filteredInstitutions = computed(() => nuclearInstitutions.filter((institution) => {
  const matchesType = activeFilter.value === 'all' || institution.category === activeFilter.value
  const matchesScience = activeResearchArea.value === 'all' || institution.researchAreas?.includes(activeResearchArea.value)
  return matchesType && matchesScience
}))

const selectedInstitution = computed(() => filteredInstitutions.value.find(institution => institution.id === selectedId.value)
  ?? filteredInstitutions.value[0])
const markerGroups = computed(() => groupInstitutionMarkers(filteredInstitutions.value, mapWidth.value))
const selectedGroup = computed(() => markerGroups.value.find(group => group.id === selectedGroupId.value))

function getMarkerLabel(group: InstitutionMarkerGroup): string {
  if (group.institutions.length === 1) {
    const institution = group.institutions[0]!
    return `${institution.name}, ${institution.city}`
  }
  const cities = [...new Set(group.institutions.map(institution => institution.city))].join(', ')
  return `${group.institutions.length} nearby institutions in ${cities}. Show institutions in this group`
}

function selectInstitution(id: string, revealDetails = false): void {
  selectedId.value = id
  if (revealDetails) {
    nextTick(() => {
      detailElement.value?.focus({ preventScroll: true })
      detailElement.value?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
    })
  }
}

function selectMarker(group: InstitutionMarkerGroup): void {
  if (group.institutions.length === 1) {
    selectedGroupId.value = null
    selectInstitution(group.institutions[0]!.id)
  } else {
    selectedGroupId.value = selectedGroupId.value === group.id ? null : group.id
  }
}

function selectFilter(filter: FilterId) {
  activeFilter.value = filter
  selectedGroupId.value = null
  const selectionIsVisible = filteredInstitutions.value.some(institution => institution.id === selectedId.value)
  if (!selectionIsVisible) {
    selectedId.value = filteredInstitutions.value[0]?.id ?? ''
  }
}

function selectResearchArea(area: string) {
  activeResearchArea.value = area
  selectedGroupId.value = null
  const selectionIsVisible = filteredInstitutions.value.some(institution => institution.id === selectedId.value)
  if (!selectionIsVisible) selectedId.value = filteredInstitutions.value[0]?.id ?? ''
}

onMounted(() => {
  if (!mapElement.value) return
  mapResizeObserver = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.width > 0) mapWidth.value = entry.contentRect.width
  })
  mapResizeObserver.observe(mapElement.value)
})
onBeforeUnmount(() => mapResizeObserver?.disconnect())
</script>

<template>
  <div class="institution-directory" :data-mobile-view="mobileView">
    <div class="map-filter-group map-filter-group--type">
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

    <div class="map-filter-group map-filter-group--science">
      <label for="research-area-filter"><strong>Scientific area</strong></label>
      <select id="research-area-filter" :value="activeResearchArea" @change="selectResearchArea(($event.target as HTMLSelectElement).value)">
        <option value="all">All scientific areas</option>
        <option v-for="area in scientificAreas" :key="area" :value="area">{{ area }}</option>
      </select>
    </div>

    <div class="map-view-switch" role="group" aria-label="Institution directory view">
      <button type="button" :aria-pressed="mobileView === 'list'" @click="mobileView = 'list'">List view</button>
      <button type="button" :aria-pressed="mobileView === 'map'" @click="mobileView = 'map'">Map view</button>
    </div>

    <div ref="mapElement" class="nuclear-map" aria-label="Interactive geographic overview of major nuclear-science centres on an official outline map of India">
      <img class="nuclear-map__outline" src="/images/india-outline.svg" alt="Outline map of India from Survey of India" width="700" height="725">
      <button
        v-for="group in markerGroups"
        :key="group.id"
        class="map-marker"
        :class="[
          group.institutions.length === 1 ? `map-marker--${group.institutions[0]!.category}` : 'map-marker--group',
          { 'map-marker--selected': group.institutions.some(institution => institution.id === selectedId) || selectedGroupId === group.id },
        ]"
        type="button"
        :style="{ left: `${group.x}%`, top: `${group.y}%` }"
        :data-label="group.institutions.length === 1 ? group.institutions[0]!.shortName : `${group.institutions.length} institutions`"
        :aria-label="getMarkerLabel(group)"
        :aria-pressed="group.institutions.length === 1 ? selectedId === group.institutions[0]!.id : undefined"
        :aria-expanded="group.institutions.length > 1 ? selectedGroupId === group.id : undefined"
        :aria-controls="group.institutions.length > 1 ? 'map-group-panel' : undefined"
        @click="selectMarker(group)"
      >
        <span aria-hidden="true">{{ group.institutions.length > 1 ? group.institutions.length : '•' }}</span>
      </button>
    </div>

    <div class="map-information">
      <section v-show="selectedGroup" id="map-group-panel" class="map-group-panel" aria-labelledby="map-group-title">
        <h2 id="map-group-title">Institutions in this area</h2>
        <ul>
          <li v-for="institution in selectedGroup?.institutions ?? []" :key="institution.id">
            <button type="button" :aria-pressed="selectedId === institution.id" @click="selectInstitution(institution.id, true)">
              <strong>{{ institution.shortName }}</strong>
              <span>{{ institution.city }}</span>
            </button>
          </li>
        </ul>
      </section>
      <article v-if="selectedInstitution" ref="detailElement" class="map-detail" tabindex="-1" aria-labelledby="map-detail-title" aria-live="polite">
        <p class="map-detail__type">{{ getInstitutionCategoryLabel(selectedInstitution.category) }}</p>
        <h2 id="map-detail-title">{{ selectedInstitution.name }}</h2>
        <p class="map-detail__location">{{ selectedInstitution.city }}, {{ selectedInstitution.state }}</p>
        <p v-if="selectedInstitution.character"><strong>{{ selectedInstitution.character }}</strong></p>
        <p>{{ selectedInstitution.summary }}</p>
        <div v-if="selectedInstitution.researchAreas?.length" class="map-detail__section">
          <h3>Research areas</h3>
          <ul class="map-detail__tags"><li v-for="area in selectedInstitution.researchAreas" :key="area">{{ area }}</li></ul>
        </div>
        <div v-if="selectedInstitution.researchers?.length" class="map-detail__section">
          <h3>Researchers and groups</h3>
          <p>{{ selectedInstitution.researchers.map(researcher => researcher.name).join(' · ') }}</p>
        </div>
        <div v-if="selectedInstitution.facilities?.length" class="map-detail__section">
          <h3>Facilities</h3>
          <p>{{ selectedInstitution.facilities.map(facility => facility.name).join(' · ') }}</p>
        </div>
        <a v-if="selectedInstitution.officialUrl" class="text-link" :href="selectedInstitution.officialUrl" target="_blank" rel="noopener noreferrer">
          Visit official website <span aria-hidden="true">↗</span>
        </a>
      </article>
      <p v-else class="map-detail" role="status">No institutions match both selected filters. Choose another institution type or scientific area.</p>
    </div>

    <div class="map-alternative" aria-labelledby="map-list-title">
      <div class="map-list-heading">
        <h2 id="map-list-title">Browse institutions as a list</h2>
        <span role="status">{{ filteredInstitutions.length }} shown</span>
      </div>
      <ul class="institution-list">
        <li v-for="institution in filteredInstitutions" :key="institution.id">
          <button type="button" :aria-pressed="selectedId === institution.id" @click="selectInstitution(institution.id, true)">
            <strong>{{ institution.shortName }}</strong>
            <span>{{ institution.city }}, {{ institution.state }}</span>
          </button>
        </li>
      </ul>
    </div>

    <p class="map-attribution">
      Map boundary source: <a href="https://surveyofindia.gov.in/pages/outline-maps-of-india" target="_blank" rel="noopener noreferrer">Survey of India, 1:16 million generalized vector outline</a>. Markers show approximate locations. Nearby institutions are grouped; select a group to browse its institutions.
    </p>
  </div>
</template>
