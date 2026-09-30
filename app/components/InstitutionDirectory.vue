<script setup lang="ts">
import type { InstitutionCategory, NuclearInstitution } from '~~/content/site/institutions'
import { administrativeBoundaryLabels, visibleAdministrativeBoundaries, type AdministrativeBoundaryLayer } from '~~/shared/utils/map-boundaries'
import { getInstitutionCategoryLabel, institutionCategories, nuclearInstitutions, scientificAreas } from '~~/content/site/institutions'
import { fitInstitutionMapView, groupInstitutionMarkers, institutionRegionCanvasHeight, mapGraticule, maximumMapZoom, nationalMapView, pointInMapView, projectInstitutionPoint, separateInstitutionMarkers, zoomInstitutionMapView, type InstitutionMarkerGroup, type MapView } from '~~/shared/utils/institution-map'

type FilterId = 'all' | InstitutionCategory
interface FocusRegion { ids: string[], view: MapView, layoutView: MapView, separated: boolean, triggerId: string }

const activeFilter = ref<FilterId>('all')
const activeResearchArea = ref('all')
const selectedId = ref(nuclearInstitutions[0]?.id ?? '')
const hoveredId = ref<string | null>(null)
const mobileView = ref<'list' | 'map'>('list')
const mapElement = ref<HTMLElement | null>(null)
const detailElement = ref<HTMLElement | null>(null)
const closeGroupButton = ref<HTMLButtonElement | null>(null)
const mapWidth = ref(700)
const mapHeight = ref(725)
const naturalMapHeight = computed(() => mapWidth.value * 725 / 700)
const canvasHeight = computed(() => focusRegion.value ? institutionRegionCanvasHeight(focusRegion.value.ids.length, mapWidth.value) : naturalMapHeight.value)
const heightRatio = computed(() => canvasHeight.value / naturalMapHeight.value)
const overviewView = ref<MapView>({ ...nationalMapView })
const focusRegions = ref<FocusRegion[]>([])
const isPanning = ref(false)
let mapResizeObserver: ResizeObserver | undefined
let dragStart: { pointerId: number, x: number, y: number, view: MapView } | null = null
let dragged = false

const filteredInstitutions = computed(() => nuclearInstitutions.filter((institution) => {
  const matchesType = activeFilter.value === 'all' || institution.category === activeFilter.value
  const matchesScience = activeResearchArea.value === 'all' || institution.researchAreas?.includes(activeResearchArea.value)
  return matchesType && matchesScience
}))
const focusRegion = computed(() => focusRegions.value.at(-1))
const mapView = computed(() => focusRegion.value?.view ?? overviewView.value)
const animatedMapView = shallowRef<MapView>({ ...nationalMapView })
let mapAnimationFrame = 0
let reduceMapMotion = false
const stateBoundaries = shallowRef<AdministrativeBoundaryLayer | null>(null)
const districtBoundaries = shallowRef<AdministrativeBoundaryLayer | null>(null)
const boundaryLoadError = ref(false)
let boundaryLoad: Promise<void> | undefined
const regionInstitutions = computed(() => filteredInstitutions.value
  .filter(institution => !focusRegion.value || focusRegion.value.ids.includes(institution.id))
  .sort((a, b) => a.city.localeCompare(b.city) || a.shortName.localeCompare(b.shortName)))
const selectedInstitution = computed(() => filteredInstitutions.value.find(institution => institution.id === selectedId.value) ?? filteredInstitutions.value[0])
const previewInstitution = computed(() => regionInstitutions.value.find(institution => institution.id === hoveredId.value) ?? selectedInstitution.value)
const regionMarkerLayout = computed(() => focusRegion.value?.separated ? separateInstitutionMarkers(regionInstitutions.value, mapWidth.value, focusRegion.value.layoutView, canvasHeight.value) : [])
const separatedMarkers = computed(() => regionMarkerLayout.value.map(marker => {
  const anchor = pointInMapView(projectInstitutionPoint(marker.institution), mapView.value)
  anchor.y /= heightRatio.value
  return { ...marker, x: anchor.x + marker.x - marker.anchorX, y: anchor.y + marker.y - marker.anchorY, anchorX: anchor.x, anchorY: anchor.y }
}))
const markerGroups = computed(() => {
  if (focusRegion.value?.separated) return separatedMarkers.value.map(marker => ({ id: marker.institution.id, x: marker.x, y: marker.y, institutions: [marker.institution] }))
  return groupInstitutionMarkers(regionInstitutions.value, mapWidth.value, mapView.value, canvasHeight.value)
})
const visibleMarkerGroups = computed(() => markerGroups.value.map(group => ({
  ...group,
  ...screenPoint({ x: group.x / mapView.value.scale + mapView.value.x, y: group.y * heightRatio.value / mapView.value.scale + mapView.value.y }),
})).filter(group => group.x > 2 && group.x < 98 && group.y > 3 && group.y < 98))
const displacedMarkers = computed(() => separatedMarkers.value.filter(marker => Math.hypot(marker.x - marker.anchorX, marker.y - marker.anchorY) > 0.1).map(marker => {
  const position = screenPoint({ x: marker.x / mapView.value.scale + mapView.value.x, y: marker.y * heightRatio.value / mapView.value.scale + mapView.value.y })
  const anchor = screenPoint(projectInstitutionPoint(marker.institution))
  return { ...marker, ...position, anchorX: anchor.x, anchorY: anchor.y }
}))
const contextPoints = computed(() => focusRegion.value ? filteredInstitutions.value
  .filter(institution => !focusRegion.value!.ids.includes(institution.id))
  .map(institution => ({ id: institution.id, ...screenPoint(projectInstitutionPoint(institution)) }))
  .filter(point => point.x > 0 && point.x < 100 && point.y > 0 && point.y < 100) : [])
const worldStyle = computed(() => ({ height: `${naturalMapHeight.value}px`, transform: `translate(${-animatedMapView.value.x * animatedMapView.value.scale}%, ${-animatedMapView.value.y * animatedMapView.value.scale}%) scale(${animatedMapView.value.scale})` }))
const regionLabel = computed(() => {
  if (!focusRegion.value) return 'India'
  const cities = [...new Set(regionInstitutions.value.map(institution => institution.city))]
  return cities.length === 1 ? cities[0] : cities.length === 2 ? cities.join(' / ') : `${cities[0]} and nearby centres`
})
const activeMarkerId = computed(() => hoveredId.value ?? selectedId.value)
const graticule = computed(() => mapGraticule(animatedMapView.value, heightRatio.value))
const visibleStates = computed(() => animatedMapView.value.scale >= 1.5 ? visibleAdministrativeBoundaries(stateBoundaries.value, animatedMapView.value, heightRatio.value) : [])
const visibleDistricts = computed(() => animatedMapView.value.scale >= 3 ? visibleAdministrativeBoundaries(districtBoundaries.value, animatedMapView.value, heightRatio.value) : [])
const boundaryLabels = computed(() => administrativeBoundaryLabels(visibleDistricts.value.length ? visibleDistricts.value : visibleStates.value, animatedMapView.value, mapWidth.value, visibleMarkerGroups.value, canvasHeight.value))
const boundaryTransform = computed(() => `translate(${-animatedMapView.value.x * 7 * animatedMapView.value.scale} ${-animatedMapView.value.y * 7.25 * animatedMapView.value.scale}) scale(${animatedMapView.value.scale})`)

async function loadMapBoundaries(): Promise<void> {
  if (boundaryLoad) return boundaryLoad
  boundaryLoad = Promise.all([fetch('/maps/states.json'), fetch('/maps/districts.json')]).then(async ([states, districts]) => {
    if (!states!.ok || !districts!.ok) throw new Error('Map boundary request failed')
    stateBoundaries.value = await states!.json()
    districtBoundaries.value = await districts!.json()
    boundaryLoadError.value = false
  }).catch(() => { boundaryLoadError.value = true; boundaryLoad = undefined })
  return boundaryLoad
}

watch(mapView, (target) => {
  if (!import.meta.client) return
  if (target.scale > 1) void loadMapBoundaries()
  cancelAnimationFrame(mapAnimationFrame)
  if (reduceMapMotion || isPanning.value) { animatedMapView.value = { ...target }; return }
  const start = { ...animatedMapView.value }
  const startedAt = performance.now()
  const animate = (time: number) => {
    const progress = Math.min(1, (time - startedAt) / 380)
    const eased = 1 - (1 - progress) ** 3
    animatedMapView.value = { x: start.x + (target.x - start.x) * eased, y: start.y + (target.y - start.y) * eased, scale: start.scale + (target.scale - start.scale) * eased }
    if (progress < 1) mapAnimationFrame = requestAnimationFrame(animate)
  }
  mapAnimationFrame = requestAnimationFrame(animate)
}, { deep: true })

watch([mapWidth, mapHeight], () => {
  if (focusRegion.value) {
    const view = fitInstitutionMapView(regionInstitutions.value, mapWidth.value, canvasHeight.value)
    focusRegion.value.view = view
    focusRegion.value.layoutView = { ...view }
  }
})
watch(regionInstitutions, (institutions) => {
  if (focusRegion.value && !institutions.some(institution => institution.id === selectedId.value)) selectedId.value = institutions[0]?.id ?? ''
})

function institutionNumber(institution: NuclearInstitution): number {
  return regionInstitutions.value.findIndex(member => member.id === institution.id) + 1
}
function screenPoint(point: { x: number, y: number }): { x: number, y: number } {
  const projected = pointInMapView(point, animatedMapView.value)
  return { x: projected.x, y: projected.y / heightRatio.value }
}
function getMarkerLabel(group: InstitutionMarkerGroup): string {
  if (group.institutions.length === 1) return `${group.institutions[0]!.name}, ${group.institutions[0]!.city}. Select institution`
  return `${group.institutions.length} nearby institutions. Zoom in to explore`
}
function selectInstitution(id: string, revealDetails = false): void {
  if (focusRegion.value && !focusRegion.value.ids.includes(id)) resetMap(false)
  selectedId.value = id
  hoveredId.value = null
  if (revealDetails) nextTick(() => {
    detailElement.value?.focus({ preventScroll: true })
    detailElement.value?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  })
}
function selectMarker(group: InstitutionMarkerGroup): void {
  if (group.institutions.length === 1) {
    selectInstitution(group.institutions[0]!.id)
    return
  }
  const targetView = fitInstitutionMapView(group.institutions, mapWidth.value, institutionRegionCanvasHeight(group.institutions.length, mapWidth.value))
  focusRegions.value = [{
    ids: group.institutions.map(institution => institution.id),
    view: targetView,
    layoutView: { ...targetView },
    separated: true,
    triggerId: group.id,
  }]
  if (!group.institutions.some(institution => institution.id === selectedId.value)) selectedId.value = group.institutions[0]!.id
  hoveredId.value = null
  nextTick(() => closeGroupButton.value?.focus({ preventScroll: true }))
}
function restoreMarkerFocus(groupId?: string): void {
  nextTick(() => {
    const markers = mapElement.value?.querySelectorAll<HTMLButtonElement>('[data-group-id]')
    const trigger = Array.from(markers ?? []).find(marker => marker.dataset.groupId === groupId)
    if (trigger) trigger.focus({ preventScroll: true })
    else mapElement.value?.focus({ preventScroll: true })
  })
}
function resetMap(restoreFocus = true): void {
  const triggerId = focusRegions.value[0]?.triggerId
  focusRegions.value = []
  overviewView.value = { ...nationalMapView }
  hoveredId.value = null
  if (restoreFocus) restoreMarkerFocus(triggerId)
}
function setMapView(view: MapView, keepSeparated = false): void {
  if (focusRegion.value) {
    focusRegion.value.view = view
    if (!keepSeparated) focusRegion.value.separated = false
  } else overviewView.value = view
}
function changeZoom(factor: number): void {
  const view = zoomInstitutionMapView(mapView.value, factor, heightRatio.value)
  setMapView(view, true)
  if (focusRegion.value) focusRegion.value.layoutView = { ...view }
}
function handleDirectoryKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && (focusRegion.value || mapView.value.scale > 1)) {
    event.preventDefault()
    resetMap()
  }
}
function handleMapClick(event: MouseEvent): void {
  if (dragged) { dragged = false; return }
  if (event.target instanceof Element && event.target.closest('button')) return
  if (focusRegion.value || mapView.value.scale > 1) resetMap()
}
function startPan(event: PointerEvent): void {
  if (mapView.value.scale <= 1 || (event.target instanceof Element && event.target.closest('button'))) return
  dragStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, view: { ...mapView.value } }
  dragged = false
  mapElement.value?.setPointerCapture(event.pointerId)
}
function movePan(event: PointerEvent): void {
  if (!dragStart || event.pointerId !== dragStart.pointerId) return
  const dx = event.clientX - dragStart.x
  const dy = event.clientY - dragStart.y
  if (Math.hypot(dx, dy) < 5 && !dragged) return
  dragged = true
  isPanning.value = true
  const view = dragStart.view
  setMapView({ ...view, x: view.x - dx / mapWidth.value * 100 / view.scale, y: view.y - dy / (mapWidth.value * 725 / 700) * 100 / view.scale }, true)
}
function endPan(event: PointerEvent): void {
  if (dragStart?.pointerId !== event.pointerId) return
  if (mapElement.value?.hasPointerCapture(event.pointerId)) mapElement.value.releasePointerCapture(event.pointerId)
  dragStart = null
  isPanning.value = false
  // Ignore the click generated by a drag, then accept the next deliberate click.
  if (dragged) window.setTimeout(() => { dragged = false }, 0)
}
function panWithKeyboard(event: KeyboardEvent): void {
  if (mapView.value.scale <= 1 || event.target !== mapElement.value) return
  const direction: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
  const delta = direction[event.key]
  if (!delta) return
  event.preventDefault()
  setMapView({ ...mapView.value, x: mapView.value.x + delta[0] * 8 / mapView.value.scale, y: mapView.value.y + delta[1] * 8 / mapView.value.scale }, true)
}
function selectFilter(filter: FilterId): void {
  resetMap(false)
  activeFilter.value = filter
  if (!filteredInstitutions.value.some(institution => institution.id === selectedId.value)) selectedId.value = filteredInstitutions.value[0]?.id ?? ''
}
function selectResearchArea(area: string): void {
  resetMap(false)
  activeResearchArea.value = area
  if (!filteredInstitutions.value.some(institution => institution.id === selectedId.value)) selectedId.value = filteredInstitutions.value[0]?.id ?? ''
}
onMounted(() => {
  reduceMapMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!mapElement.value) return
  mapResizeObserver = new ResizeObserver(([entry]) => {
    if (entry && entry.contentRect.width > 0) { mapWidth.value = entry.contentRect.width; mapHeight.value = entry.contentRect.height }
  })
  mapResizeObserver.observe(mapElement.value)
})
onBeforeUnmount(() => {
  mapResizeObserver?.disconnect()
  cancelAnimationFrame(mapAnimationFrame)
})
</script>

<template>
  <div class="institution-directory" :data-mobile-view="mobileView" @keydown="handleDirectoryKeydown">
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

    <p id="map-guidance" class="map-instruction">Select a numbered group to see all its institutions in one regional view. Short lines connect overlapping markers to their locations. Drag to move; click clear map space or press Escape to return to India.</p>

    <div class="map-stage">
      <div ref="mapElement" class="nuclear-map" :style="focusRegion ? { height: `${canvasHeight}px` } : undefined" :class="{ 'nuclear-map--zoomed': mapView.scale > 1, 'nuclear-map--focused': focusRegion, 'nuclear-map--panning': isPanning }" tabindex="0" role="group" aria-label="Institution map of India" aria-describedby="map-guidance" @click="handleMapClick" @pointerdown="startPan" @pointermove="movePan" @pointerup="endPan" @pointercancel="endPan" @keydown="panWithKeyboard">
        <div class="map-world" :style="worldStyle">
          <img class="nuclear-map__outline" src="/images/india-outline.svg" alt="Outline map of India from Survey of India" width="700" height="725" draggable="false">
        </div>
        <svg class="map-graticule" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line v-for="line in graticule.longitude" :key="line.label" :x1="line.position" :x2="line.position" y1="0" y2="100" />
          <line v-for="line in graticule.latitude" :key="line.label" :y1="line.position" :y2="line.position" x1="0" x2="100" />
        </svg>
        <svg v-if="stateBoundaries" class="map-administrative" :style="{ height: `${naturalMapHeight}px` }" viewBox="0 0 700 725" aria-hidden="true" focusable="false">
          <defs><clipPath id="map-india-boundary-clip"><path :d="stateBoundaries.outline" /></clipPath></defs>
          <g :transform="boundaryTransform"><g clip-path="url(#map-india-boundary-clip)">
            <path v-for="boundary in visibleDistricts" :key="boundary.id" :d="boundary.path" class="map-administrative__district" />
            <path v-for="boundary in visibleStates" :key="boundary.id" :d="boundary.path" class="map-administrative__state" />
          </g></g>
        </svg>
        <span v-for="label in boundaryLabels" :key="label.id" class="map-boundary-label" :class="{ 'map-boundary-label--district': visibleDistricts.length }" :style="{ left: `${label.x}%`, top: `${label.y}%` }" aria-hidden="true">{{ label.name }}</span>
        <span v-for="line in graticule.longitude" :key="line.label" class="map-coordinate map-coordinate--longitude" :style="{ left: `${line.position}%` }" aria-hidden="true">{{ line.label }}</span>
        <span v-for="line in graticule.latitude" :key="line.label" class="map-coordinate map-coordinate--latitude" :style="{ top: `${line.position}%` }" aria-hidden="true">{{ line.label }}</span>
        <svg class="map-leader-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <circle v-for="point in contextPoints" :key="point.id" :cx="point.x" :cy="point.y" r="0.35" class="map-context-point" />
          <g v-for="marker in displacedMarkers" :key="marker.institution.id">
            <line :x1="marker.anchorX" :y1="marker.anchorY" :x2="marker.x" :y2="marker.y" :class="{ 'map-leader-lines__selected': marker.institution.id === activeMarkerId }" />
            <circle :cx="marker.anchorX" :cy="marker.anchorY" r="0.5" :class="{ 'map-leader-lines__selected': marker.institution.id === activeMarkerId }" />
          </g>
        </svg>
        <div class="map-region-heading">
          <button v-if="focusRegion" ref="closeGroupButton" class="map-return" type="button" @click="resetMap()"><span aria-hidden="true">←</span> All locations</button>
          <div><strong>{{ regionLabel }}</strong><span role="status">{{ regionInstitutions.length }} institutions</span></div>
        </div>
        <TransitionGroup name="map-point" tag="div" class="map-marker-layer">
          <button
v-for="group in visibleMarkerGroups" :key="group.id" class="map-marker" :class="[group.institutions.length === 1 ? `map-marker--${group.institutions[0]!.category}` : 'map-marker--group', { 'map-marker--selected': group.institutions.length === 1 && group.institutions[0]!.id === selectedId, 'map-marker--hovered': group.institutions.length === 1 && group.institutions[0]!.id === hoveredId }]" type="button"
            :style="{ left: `${group.x}%`, top: `${group.y}%` }" :data-group-id="group.institutions.length > 1 ? group.id : undefined" :aria-label="getMarkerLabel(group)"
            :aria-pressed="group.institutions.length === 1 ? selectedId === group.institutions[0]!.id : undefined" :aria-controls="group.institutions.length > 1 ? 'map-group-panel' : 'map-detail-title'"
            @click="selectMarker(group)" @mouseenter="hoveredId = group.institutions.length === 1 ? group.institutions[0]!.id : null" @mouseleave="hoveredId = null" @focus="hoveredId = group.institutions.length === 1 ? group.institutions[0]!.id : null" @blur="hoveredId = null">
            <span aria-hidden="true">{{ group.institutions.length > 1 ? group.institutions.length : focusRegion ? institutionNumber(group.institutions[0]!) : '•' }}</span>
          </button>
        </TransitionGroup>
        <div class="map-zoom-controls" role="group" aria-label="Map zoom">
          <button type="button" aria-label="Zoom in" :disabled="mapView.scale >= maximumMapZoom" @click="changeZoom(1.5)">+</button>
          <button type="button" aria-label="Zoom out" :disabled="mapView.scale <= 1" @click="changeZoom(1 / 1.5)">−</button>
          <button type="button" class="map-zoom-reset" aria-label="Reset map to all locations" :disabled="mapView.scale <= 1 && !focusRegion" @click="resetMap()">India</button>
        </div>
        <div v-if="mapView.scale > 1" class="map-overview" aria-hidden="true">
          <img src="/images/india-outline.svg" alt="" width="700" height="725" draggable="false">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none"><rect :x="animatedMapView.x" :y="animatedMapView.y" :width="100 / animatedMapView.scale" :height="100 * heightRatio / animatedMapView.scale" /></svg>
          <span>Regional view</span>
        </div>
        <span v-else class="map-scale-note">National view</span>
      </div>
      <div v-if="previewInstitution" class="map-selection-preview">
        <span class="map-selection-preview__number" aria-hidden="true">{{ focusRegion ? institutionNumber(previewInstitution) : '•' }}</span>
        <div><strong>{{ previewInstitution.shortName }}</strong><span>{{ previewInstitution.city }}, {{ previewInstitution.state }}</span></div>
        <button type="button" class="text-link" @click="selectInstitution(previewInstitution.id, true)">View profile <span aria-hidden="true">→</span></button>
      </div>
      <p v-if="boundaryLoadError" class="map-layer-status" role="status">Boundary layers could not load. Institution locations remain available; zoom again to retry.</p>
      <div v-if="focusRegion && stateBoundaries" class="map-layer-key" aria-label="Map boundary layers">
        <span><i aria-hidden="true" /> State / UT</span><span v-if="mapView.scale >= 3"><i class="map-layer-key__district" aria-hidden="true" /> District</span>
      </div>
    </div>

    <div class="map-information">
      <section v-show="focusRegion" id="map-group-panel" class="map-group-panel" aria-labelledby="map-group-title">
        <div class="map-group-panel__heading"><h2 id="map-group-title">In this region</h2><span>{{ regionInstitutions.length }}</span></div>
        <ul>
          <li v-for="institution in regionInstitutions" :key="institution.id">
            <button type="button" :aria-pressed="selectedId === institution.id" :class="{ 'map-group-panel__hovered': hoveredId === institution.id }" @click="selectInstitution(institution.id)" @mouseenter="hoveredId = institution.id" @mouseleave="hoveredId = null" @focus="hoveredId = institution.id" @blur="hoveredId = null">
              <span class="map-group-panel__number">{{ institutionNumber(institution) }}</span>
              <span class="map-group-panel__name"><strong>{{ institution.shortName }}</strong><span>{{ institution.city }}</span></span>
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
      Map boundary source: <a href="https://surveyofindia.gov.in/pages/outline-maps-of-india" target="_blank" rel="noopener noreferrer">Survey of India, 1:16 million generalized vector outline</a>. Markers show approximate locations. Short connector lines identify markers separated to avoid overlap. Regional layers: <a href="/maps/attribution.txt" target="_blank" rel="noopener noreferrer">geoBoundaries sources and licences</a> (state metadata: 2011; districts: 2021). Generalized reference boundaries may differ from current administrative divisions.
    </p>
  </div>
</template>
