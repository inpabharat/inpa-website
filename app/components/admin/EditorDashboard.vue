<script setup lang="ts">
import type {
  AdminApiResponse, AdminCarouselInput, AdminCarouselRecord, AdminContentSnapshot,
  AdminEventInput, AdminEventRecord, AdminNewsInput, AdminNewsRecord,
} from '../../../shared/types/admin'
import { eventStatuses, newsStatuses } from '~~/shared/types/content'
import { makeSlug } from '~~/shared/utils/content-validation'

type Panel = 'overview' | 'news' | 'events' | 'carousel' | 'media'
type EntityKind = 'news' | 'events' | 'carousel'

const props = defineProps<{ initialSnapshot: AdminContentSnapshot, editorEmail: string }>()
const emit = defineEmits<{ refresh: [] }>()
const snapshot = ref<AdminContentSnapshot>(structuredClone(props.initialSnapshot))
const panel = ref<Panel>('overview')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')
const editingId = ref<string | null>(null)
const uploaded = ref<{ key: string, url: string, alt: string } | null>(null)
const mediaRefreshKey = ref(0)

const blankNews = (): AdminNewsInput => ({
  slug: '', title: '', summary: '', body: '', coverImageKey: null, coverImageAlt: null,
  category: null, status: 'draft', isFeatured: false, publishAt: null, publishedAt: null,
  expiresAt: null, externalUrl: null,
})
const blankEvent = (): AdminEventInput => ({
  slug: '', title: '', summary: '', body: '', startAt: '', endAt: null, timezone: 'Asia/Kolkata',
  locationName: null, isOnline: false, externalUrl: null, coverImageKey: null, coverImageAlt: null,
  status: 'draft', isFeatured: false, publishAt: null,
})
const blankCarousel = (): AdminCarouselInput => ({
  eyebrow: null, title: '', summary: null, imageKey: '', imageAlt: '', ctaLabel: null, ctaUrl: null,
  linkedContentType: null, linkedContentId: null, sortOrder: 0, isActive: false, startsAt: null, endsAt: null,
})

const newsForm = reactive(blankNews())
const eventForm = reactive(blankEvent())
const carouselForm = reactive(blankCarousel())
const counts = computed(() => ({
  drafts: snapshot.value.news.filter(item => item.status === 'draft').length + snapshot.value.events.filter(item => item.status === 'draft').length,
  scheduled: snapshot.value.news.filter(item => item.status === 'scheduled').length + snapshot.value.events.filter(item => item.status === 'scheduled').length,
  publishedNews: snapshot.value.news.filter(item => item.status === 'published').length,
  upcomingEvents: snapshot.value.events.filter(item => ['published', 'postponed'].includes(item.status) && Date.parse(item.startAt) >= Date.now()).length,
  activeSlides: snapshot.value.carousel.filter(item => item.isActive).length,
}))

watch(() => props.initialSnapshot, value => snapshot.value = structuredClone(value), { deep: true })

function nullable(value: string | null): string | null {
  const cleaned = value?.trim() ?? ''
  return cleaned || null
}

function resetFeedback(): void {
  message.value = ''
  errorMessage.value = ''
}

function toDateTimeLocal(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return null
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

function selectPanel(next: Panel): void {
  panel.value = next
  editingId.value = null
  resetFeedback()
}

function startNews(item?: AdminNewsRecord): void {
  editingId.value = item?.id ?? null
  Object.assign(newsForm, item ? {
    ...item,
    publishAt: toDateTimeLocal(item.publishAt),
    publishedAt: toDateTimeLocal(item.publishedAt),
    expiresAt: toDateTimeLocal(item.expiresAt),
  } : blankNews())
  panel.value = 'news'
  resetFeedback()
}

function startEvent(item?: AdminEventRecord): void {
  editingId.value = item?.id ?? null
  Object.assign(eventForm, item ? {
    ...item,
    startAt: toDateTimeLocal(item.startAt) ?? '',
    endAt: toDateTimeLocal(item.endAt),
    publishAt: toDateTimeLocal(item.publishAt),
  } : blankEvent())
  panel.value = 'events'
  resetFeedback()
}

function startCarousel(item?: AdminCarouselRecord): void {
  editingId.value = item?.id ?? null
  Object.assign(carouselForm, item ? {
    ...item,
    startsAt: toDateTimeLocal(item.startsAt),
    endsAt: toDateTimeLocal(item.endsAt),
  } : blankCarousel())
  panel.value = 'carousel'
  resetFeedback()
}

function fillSlug(kind: 'news' | 'events'): void {
  const form = kind === 'news' ? newsForm : eventForm
  if (!form.slug) form.slug = makeSlug(form.title)
}

function normaliseNews(): AdminNewsInput {
  return { ...newsForm, slug: makeSlug(newsForm.slug), coverImageKey: nullable(newsForm.coverImageKey), coverImageAlt: nullable(newsForm.coverImageAlt), category: nullable(newsForm.category), publishAt: nullable(newsForm.publishAt), publishedAt: nullable(newsForm.publishedAt), expiresAt: nullable(newsForm.expiresAt), externalUrl: nullable(newsForm.externalUrl) }
}

function normaliseEvent(): AdminEventInput {
  return { ...eventForm, slug: makeSlug(eventForm.slug), endAt: nullable(eventForm.endAt), locationName: nullable(eventForm.locationName), externalUrl: nullable(eventForm.externalUrl), coverImageKey: nullable(eventForm.coverImageKey), coverImageAlt: nullable(eventForm.coverImageAlt), publishAt: nullable(eventForm.publishAt) }
}

function normaliseCarousel(): AdminCarouselInput {
  return { ...carouselForm, eyebrow: nullable(carouselForm.eyebrow), summary: nullable(carouselForm.summary), ctaLabel: nullable(carouselForm.ctaLabel), ctaUrl: nullable(carouselForm.ctaUrl), linkedContentId: nullable(carouselForm.linkedContentId), startsAt: nullable(carouselForm.startsAt), endsAt: nullable(carouselForm.endsAt) }
}

function describeError(error: unknown): string {
  if (!error || typeof error !== 'object') return 'The request could not be completed.'
  const candidate = error as { data?: { statusMessage?: string, data?: { issues?: string[] } }, message?: string }
  return candidate.data?.data?.issues?.join(' ') ?? candidate.data?.statusMessage ?? candidate.message ?? 'The request could not be completed.'
}

async function reload(): Promise<void> {
  const response = await $fetch<AdminApiResponse<AdminContentSnapshot>>('/api/admin/content')
  snapshot.value = response.data
  emit('refresh')
}

async function save(kind: EntityKind, body: AdminNewsInput | AdminEventInput | AdminCarouselInput): Promise<void> {
  busy.value = true
  resetFeedback()
  try {
    const id = editingId.value
    const response = await $fetch<{ message: string }>(id ? `/api/admin/${kind}/${id}` : `/api/admin/${kind}`, { method: id ? 'PUT' : 'POST', body })
    message.value = response.message
    await reload()
    editingId.value = null
    if (kind === 'news') Object.assign(newsForm, blankNews())
    if (kind === 'events') Object.assign(eventForm, blankEvent())
    if (kind === 'carousel') Object.assign(carouselForm, blankCarousel())
  } catch (error) {
    errorMessage.value = describeError(error)
  } finally {
    busy.value = false
  }
}

async function remove(kind: EntityKind, id: string, title: string): Promise<void> {
  if (!window.confirm(`Permanently delete “${title}”? The audit record will be retained.`)) return
  busy.value = true
  resetFeedback()
  try {
    const response = await $fetch<{ message: string }>(`/api/admin/${kind}/${id}`, { method: 'DELETE' })
    message.value = response.message
    await reload()
  } catch (error) {
    errorMessage.value = describeError(error)
  } finally {
    busy.value = false
  }
}

function useUploadedMedia(target: 'news' | 'event' | 'carousel'): void {
  if (!uploaded.value) return
  if (target === 'news') {
    startNews()
    newsForm.coverImageKey = uploaded.value.key
    newsForm.coverImageAlt = uploaded.value.alt
  } else if (target === 'event') {
    startEvent()
    eventForm.coverImageKey = uploaded.value.key
    eventForm.coverImageAlt = uploaded.value.alt
  } else {
    startCarousel()
    carouselForm.imageKey = uploaded.value.key
    carouselForm.imageAlt = uploaded.value.alt
  }
}
</script>

<template>
  <div class="editor-dashboard">
    <nav class="editor-tabs" aria-label="Editor sections">
      <button v-for="item in (['overview', 'news', 'events', 'carousel', 'media'] as Panel[])" :key="item" type="button" :aria-current="panel === item ? 'page' : undefined" @click="selectPanel(item)">
        {{ item === 'carousel' ? 'Homepage carousel' : item }}
      </button>
    </nav>
    <p v-if="message" class="admin-alert admin-alert--success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>

    <section v-if="panel === 'overview'" aria-labelledby="editor-overview-title">
      <div class="editor-heading"><div><p class="eyebrow">Dashboard</p><h2 id="editor-overview-title">Publishing overview</h2></div><p>Administrative actions are recorded under {{ editorEmail }}.</p></div>
      <dl class="editor-stats">
        <div><dt>Drafts</dt><dd>{{ counts.drafts }}</dd></div><div><dt>Scheduled</dt><dd>{{ counts.scheduled }}</dd></div><div><dt>Published news</dt><dd>{{ counts.publishedNews }}</dd></div><div><dt>Upcoming events</dt><dd>{{ counts.upcomingEvents }}</dd></div><div><dt>Active slides</dt><dd>{{ counts.activeSlides }}</dd></div>
      </dl>
      <div class="editor-actions"><button class="button button--navy" type="button" @click="startNews()">Create news</button><button class="button button--navy" type="button" @click="startEvent()">Create event</button><button class="button button--navy" type="button" @click="startCarousel()">Create carousel item</button></div>
    </section>

    <section v-else-if="panel === 'news'" aria-labelledby="news-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">News</p><h2 id="news-editor-title">{{ editingId ? 'Edit news item' : 'Create news item' }}</h2></div><button type="button" class="text-button" @click="startNews()">New blank item</button></div>
      <div class="editor-workspace">
        <form class="editor-form" @submit.prevent="save('news', normaliseNews())">
          <label>Title <input v-model="newsForm.title" required maxlength="180" @blur="fillSlug('news')"></label>
          <label>Slug <input v-model="newsForm.slug" required maxlength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></label>
          <label>Summary <textarea v-model="newsForm.summary" required maxlength="500" rows="3" /></label>
          <label>Body <textarea v-model="newsForm.body" required maxlength="50000" rows="10" /></label>
          <div class="editor-form__row"><label>Category <input v-model="newsForm.category" maxlength="80"></label><label>Status <select v-model="newsForm.status"><option v-for="status in newsStatuses" :key="status" :value="status">{{ status }}</option></select></label></div>
          <div class="editor-form__row"><label>Publish/schedule time <input v-model="newsForm.publishAt" type="datetime-local"></label><label>Published date <input v-model="newsForm.publishedAt" type="datetime-local"></label></div>
          <label>Expiry time <input v-model="newsForm.expiresAt" type="datetime-local"></label>
          <label>External URL <input v-model="newsForm.externalUrl" maxlength="500" placeholder="https://… or /route"></label>
          <div class="editor-form__row"><label>Cover image key <input v-model="newsForm.coverImageKey" maxlength="500"></label><label>Image alternative text <input v-model="newsForm.coverImageAlt" maxlength="300"></label></div>
          <label class="editor-check"><input v-model="newsForm.isFeatured" type="checkbox"> Feature this item</label>
          <button class="button button--gold" type="submit" :disabled="busy">{{ busy ? 'Saving…' : (editingId ? 'Save changes' : 'Create draft') }}</button>
        </form>
        <aside class="editor-preview" aria-label="News preview"><p class="eyebrow">Preview</p><p class="meta">{{ newsForm.category || 'INPA news' }} · {{ newsForm.status }}</p><h3>{{ newsForm.title || 'Untitled news item' }}</h3><p>{{ newsForm.summary || 'A summary will appear here.' }}</p><div class="editor-preview__body">{{ newsForm.body || 'The article body will appear here.' }}</div></aside>
      </div>
      <AdminRecordList :items="snapshot.news" kind="news" @edit="item => startNews(item as AdminNewsRecord)" @remove="(id, title) => remove('news', id, title)" />
    </section>

    <section v-else-if="panel === 'events'" aria-labelledby="event-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">Events</p><h2 id="event-editor-title">{{ editingId ? 'Edit event' : 'Create event' }}</h2></div><button type="button" class="text-button" @click="startEvent()">New blank event</button></div>
      <div class="editor-workspace">
        <form class="editor-form" @submit.prevent="save('events', normaliseEvent())">
          <label>Title <input v-model="eventForm.title" required maxlength="180" @blur="fillSlug('events')"></label>
          <label>Slug <input v-model="eventForm.slug" required maxlength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></label>
          <label>Summary <textarea v-model="eventForm.summary" required maxlength="500" rows="3" /></label>
          <label>Body <textarea v-model="eventForm.body" required maxlength="50000" rows="8" /></label>
          <div class="editor-form__row"><label>Starts <input v-model="eventForm.startAt" type="datetime-local" required></label><label>Ends <input v-model="eventForm.endAt" type="datetime-local"></label></div>
          <div class="editor-form__row"><label>Timezone <input v-model="eventForm.timezone" required maxlength="80"></label><label>Status <select v-model="eventForm.status"><option v-for="status in eventStatuses" :key="status" :value="status">{{ status }}</option></select></label></div>
          <label>Publication schedule <input v-model="eventForm.publishAt" type="datetime-local"></label>
          <label>Location <input v-model="eventForm.locationName" maxlength="180"></label>
          <label>External URL <input v-model="eventForm.externalUrl" maxlength="500" placeholder="https://… or /route"></label>
          <div class="editor-form__row"><label>Cover image key <input v-model="eventForm.coverImageKey" maxlength="500"></label><label>Image alternative text <input v-model="eventForm.coverImageAlt" maxlength="300"></label></div>
          <div class="editor-check-row"><label class="editor-check"><input v-model="eventForm.isOnline" type="checkbox"> Online event</label><label class="editor-check"><input v-model="eventForm.isFeatured" type="checkbox"> Feature this event</label></div>
          <button class="button button--gold" type="submit" :disabled="busy">{{ busy ? 'Saving…' : (editingId ? 'Save changes' : 'Create draft') }}</button>
        </form>
        <aside class="editor-preview" aria-label="Event preview"><p class="eyebrow">Preview</p><p class="status-chip">{{ eventForm.status }}</p><h3>{{ eventForm.title || 'Untitled event' }}</h3><p>{{ eventForm.summary || 'An event summary will appear here.' }}</p><p class="meta">{{ eventForm.startAt || 'Start date required' }} · {{ eventForm.timezone }}</p><div class="editor-preview__body">{{ eventForm.body || 'Event details will appear here.' }}</div></aside>
      </div>
      <AdminRecordList :items="snapshot.events" kind="events" @edit="item => startEvent(item as AdminEventRecord)" @remove="(id, title) => remove('events', id, title)" />
    </section>

    <section v-else-if="panel === 'carousel'" aria-labelledby="carousel-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">Homepage</p><h2 id="carousel-editor-title">{{ editingId ? 'Edit carousel item' : 'Create carousel item' }}</h2></div><button type="button" class="text-button" @click="startCarousel()">New blank item</button></div>
      <div class="editor-workspace">
        <form class="editor-form" @submit.prevent="save('carousel', normaliseCarousel())">
          <label>Eyebrow <input v-model="carouselForm.eyebrow" maxlength="80"></label><label>Title <input v-model="carouselForm.title" required maxlength="180"></label><label>Summary <textarea v-model="carouselForm.summary" maxlength="500" rows="3" /></label>
          <div class="editor-form__row"><label>Image key <input v-model="carouselForm.imageKey" required maxlength="500"></label><label>Image alternative text <input v-model="carouselForm.imageAlt" required maxlength="300"></label></div>
          <div class="editor-form__row"><label>Action label <input v-model="carouselForm.ctaLabel" maxlength="80"></label><label>Action URL <input v-model="carouselForm.ctaUrl" maxlength="500"></label></div>
          <div class="editor-form__row"><label>Linked type <select v-model="carouselForm.linkedContentType"><option :value="null">None</option><option value="news">News</option><option value="event">Event</option><option value="custom">Custom</option></select></label><label>Linked content ID <input v-model="carouselForm.linkedContentId" maxlength="120"></label></div>
          <div class="editor-form__row"><label>Starts <input v-model="carouselForm.startsAt" type="datetime-local"></label><label>Ends <input v-model="carouselForm.endsAt" type="datetime-local"></label></div>
          <label>Sort order <input v-model.number="carouselForm.sortOrder" type="number" min="0" max="10000" step="1" required></label><label class="editor-check"><input v-model="carouselForm.isActive" type="checkbox"> Active on the homepage</label>
          <button class="button button--gold" type="submit" :disabled="busy">{{ busy ? 'Saving…' : (editingId ? 'Save changes' : 'Create item') }}</button>
        </form>
        <aside class="editor-preview editor-preview--dark" aria-label="Carousel preview"><p class="eyebrow eyebrow--light">{{ carouselForm.eyebrow || 'Featured update' }}</p><h3>{{ carouselForm.title || 'Untitled carousel item' }}</h3><p>{{ carouselForm.summary || 'Optional summary text will appear here.' }}</p><p class="meta meta--light">{{ carouselForm.isActive ? 'Active' : 'Inactive' }} · position {{ carouselForm.sortOrder }}</p></aside>
      </div>
      <AdminRecordList :items="snapshot.carousel" kind="carousel" @edit="item => startCarousel(item as AdminCarouselRecord)" @remove="(id, title) => remove('carousel', id, title)" />
    </section>

    <section v-else aria-labelledby="media-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">Media library</p><h2 id="media-editor-title">Upload approved media</h2></div></div>
      <AdminMediaUploader @uploaded="value => { uploaded = value; mediaRefreshKey++ }" />
      <AdminMediaLibrary :refresh-key="mediaRefreshKey" @selected="value => uploaded = value" />
      <div v-if="uploaded" class="admin-alert admin-alert--success"><p><strong>Uploaded key:</strong> <code>{{ uploaded.key }}</code></p><div class="editor-actions"><button type="button" @click="useUploadedMedia('news')">Use for new news item</button><button type="button" @click="useUploadedMedia('event')">Use for new event</button><button type="button" @click="useUploadedMedia('carousel')">Use for new carousel item</button></div></div>
    </section>
  </div>
</template>
