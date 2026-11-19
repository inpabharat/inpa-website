<script setup lang="ts">
import type {
  AdminApiResponse, AdminCarouselInput, AdminCarouselRecord, AdminContentSnapshot,
  AdminEventInput, AdminEventRecord, AdminNewsInput, AdminNewsRecord,
} from '../../../shared/types/admin'
import { eventStatuses, newsStatuses } from '~~/shared/types/content'
import { getCarouselVisibility } from '~~/shared/utils/carousel-visibility'
import { makeSlug } from '~~/shared/utils/content-validation'
import { localDateTimeToIso, toDateTimeLocal } from '~~/shared/utils/editor-date'

type Panel = 'overview' | 'news' | 'events' | 'carousel' | 'publications' | 'research' | 'candidates' | 'media'
type EntityKind = 'news' | 'events' | 'carousel'

const props = defineProps<{ initialSnapshot: AdminContentSnapshot, editorEmail: string }>()
const snapshot = ref<AdminContentSnapshot>(structuredClone(props.initialSnapshot))
const panel = ref<Panel>('overview')
const busy = ref(false)
const message = ref('')
const errorMessage = ref('')
const refreshError = ref('')
const refreshing = ref(false)
const activeUploads = ref(0)
const formHeading = ref<HTMLHeadingElement | null>(null)
const addButton = ref<HTMLButtonElement | null>(null)
const panelNav = ref<HTMLElement | null>(null)
const discardDialog = ref<{ confirm: () => Promise<boolean> } | null>(null)
const { entries, summaryId, clear, clearField, clearOnInput, field, show } = useAdminFormErrors()
const editingId = ref<string | null>(null)
const formOpen = ref(false)
const savedForm = ref('')
const scienceEditor = ref<{ dirty: boolean, hasPendingWork: boolean } | null>(null)
const mediaRefreshKey = ref(0)
const editorTimeZone = ref('your computer’s local timezone')
const panels: { id: Panel, label: string, description: string }[] = [
  { id: 'overview', label: 'Overview', description: '' },
  { id: 'news', label: 'News', description: 'Post an announcement on the homepage and News page.' },
  { id: 'events', label: 'Events', description: 'Publish events and Young Scientist Colloquium seminars.' },
  { id: 'publications', label: 'Nuclear Horizons', description: 'Upload an issue PDF and cover, add its editorial and publish it in the archive.' },
  { id: 'research', label: 'Featured research', description: 'Publish a research story and select it for the homepage spotlight.' },
  { id: 'candidates', label: 'Academic Candidates', description: 'Verify, review and publish candidate profiles.' },
  { id: 'carousel', label: 'Homepage slides', description: 'Add a featured image and link to the homepage banner.' },
  { id: 'media', label: 'Images & PDFs', description: 'Browse uploaded files and see which content uses them.' },
]

const blankNews = (): AdminNewsInput => ({
  slug: '', title: '', summary: '', body: '', coverImageKey: null, coverImageAlt: null,
  category: null, status: 'draft', isFeatured: false, publishAt: null, publishedAt: null,
  expiresAt: null, externalUrl: null,
})
const blankEvent = (): AdminEventInput => ({
  eventType: 'general', speaker: null, speakerAffiliation: null, seminarLabel: null, posterPdfKey: null,
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
const activeForm = computed(() => panel.value === 'news' ? newsForm : panel.value === 'events' ? eventForm : carouselForm)
const dirty = computed(() => formOpen.value && JSON.stringify(activeForm.value) !== savedForm.value)
const hasUnsavedChanges = computed(() => dirty.value || Boolean(scienceEditor.value?.dirty))
const counts = computed(() => ({
  drafts: snapshot.value.news.filter(item => item.status === 'draft').length + snapshot.value.events.filter(item => item.status === 'draft').length,
  scheduled: snapshot.value.news.filter(item => item.status === 'scheduled').length + snapshot.value.events.filter(item => item.status === 'scheduled').length,
  publishedNews: snapshot.value.news.filter(item => item.status === 'published').length,
  upcomingEvents: snapshot.value.events.filter(item => ['published', 'postponed'].includes(item.status) && Date.parse(item.startAt) >= Date.now()).length,
  liveSlides: snapshot.value.carousel.filter(item => getCarouselVisibility(item).state === 'live').length,
  scheduledSlides: snapshot.value.carousel.filter(item => getCarouselVisibility(item).state === 'scheduled').length,
}))

watch(() => props.initialSnapshot, value => snapshot.value = structuredClone(value), { deep: true })

onMounted(() => {
  editorTimeZone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || editorTimeZone.value
})

function nullable(value: string | null): string | null {
  const cleaned = value?.trim() ?? ''
  return cleaned || null
}

function resetFeedback(): void {
  message.value = ''
  errorMessage.value = ''
  clear()
}

function focusHeading(): void {
  void nextTick(() => {
    const target = formHeading.value ?? panelNav.value?.querySelector<HTMLButtonElement>('[aria-current="page"]')
    target?.focus()
  })
}

function canLeave(): boolean | Promise<boolean> {
  if (busy.value || activeUploads.value || scienceEditor.value?.hasPendingWork) return false
  return !hasUnsavedChanges.value || (discardDialog.value?.confirm() ?? false)
}

function trackUpload(uploading: boolean): void {
  activeUploads.value += uploading ? 1 : -1
}

async function selectPanel(next: Panel): Promise<void> {
  if (next === panel.value || !await canLeave()) return
  panel.value = next
  editingId.value = null
  formOpen.value = false
  resetFeedback()
  focusHeading()
}

async function startNews(item?: AdminNewsRecord): Promise<void> {
  if (!await canLeave()) return
  editingId.value = item?.id ?? null
  Object.assign(newsForm, item ? {
    ...item,
    publishAt: toDateTimeLocal(item.publishAt),
    publishedAt: toDateTimeLocal(item.publishedAt),
    expiresAt: toDateTimeLocal(item.expiresAt),
  } : blankNews())
  panel.value = 'news'
  formOpen.value = true
  savedForm.value = JSON.stringify(newsForm)
  resetFeedback()
  focusHeading()
}

async function startEvent(item?: AdminEventRecord): Promise<void> {
  if (!await canLeave()) return
  editingId.value = item?.id ?? null
  Object.assign(eventForm, item ? {
    ...item,
    startAt: toDateTimeLocal(item.startAt) ?? '',
    endAt: toDateTimeLocal(item.endAt),
    publishAt: toDateTimeLocal(item.publishAt),
  } : blankEvent())
  panel.value = 'events'
  formOpen.value = true
  savedForm.value = JSON.stringify(eventForm)
  resetFeedback()
  focusHeading()
}

async function startCarousel(item?: AdminCarouselRecord): Promise<void> {
  if (!await canLeave()) return
  editingId.value = item?.id ?? null
  Object.assign(carouselForm, item ? {
    ...item,
    startsAt: toDateTimeLocal(item.startsAt),
    endsAt: toDateTimeLocal(item.endsAt),
  } : blankCarousel())
  panel.value = 'carousel'
  formOpen.value = true
  savedForm.value = JSON.stringify(carouselForm)
  resetFeedback()
  focusHeading()
}

function fillSlug(kind: 'news' | 'events'): void {
  const form = kind === 'news' ? newsForm : eventForm
  if (!form.slug) form.slug = makeSlug(form.title)
}

function normaliseNews(): AdminNewsInput {
  return { ...newsForm, slug: makeSlug(newsForm.slug), coverImageKey: nullable(newsForm.coverImageKey), coverImageAlt: nullable(newsForm.coverImageAlt), category: nullable(newsForm.category), publishAt: localDateTimeToIso(newsForm.publishAt), publishedAt: localDateTimeToIso(newsForm.publishedAt), expiresAt: localDateTimeToIso(newsForm.expiresAt), externalUrl: nullable(newsForm.externalUrl) }
}

function normaliseEvent(): AdminEventInput {
  return { ...eventForm, slug: makeSlug(eventForm.slug), startAt: localDateTimeToIso(eventForm.startAt) as string, endAt: localDateTimeToIso(eventForm.endAt), locationName: nullable(eventForm.locationName), externalUrl: nullable(eventForm.externalUrl), coverImageKey: nullable(eventForm.coverImageKey), coverImageAlt: nullable(eventForm.coverImageAlt), publishAt: localDateTimeToIso(eventForm.publishAt) }
}

function normaliseCarousel(): AdminCarouselInput {
  return { ...carouselForm, eyebrow: nullable(carouselForm.eyebrow), summary: nullable(carouselForm.summary), ctaLabel: nullable(carouselForm.ctaLabel), ctaUrl: nullable(carouselForm.ctaUrl), linkedContentId: nullable(carouselForm.linkedContentId), startsAt: localDateTimeToIso(carouselForm.startsAt), endsAt: localDateTimeToIso(carouselForm.endsAt) }
}

const carouselPreviewVisibility = computed(() => getCarouselVisibility({
  isActive: carouselForm.isActive,
  startsAt: localDateTimeToIso(carouselForm.startsAt),
  endsAt: localDateTimeToIso(carouselForm.endsAt),
}))

async function reload(): Promise<void> {
  if (refreshing.value) return
  refreshing.value = true
  try {
    const response = await $fetch<AdminApiResponse<AdminContentSnapshot>>('/api/admin/content')
    snapshot.value = response.data
    refreshError.value = ''
  } catch {
    refreshError.value = 'The content list could not be refreshed. Your saved changes are recorded.'
  } finally {
    refreshing.value = false
  }
}

async function save(kind: EntityKind, body: AdminNewsInput | AdminEventInput | AdminCarouselInput): Promise<void> {
  if (busy.value || refreshing.value || activeUploads.value) return
  busy.value = true
  resetFeedback()
  try {
    const id = editingId.value
    const response = await $fetch<{ message: string }>(id ? `/api/admin/${kind}/${id}` : `/api/admin/${kind}`, { method: id ? 'PUT' : 'POST', body })
    message.value = response.message
    leaveForm()
    await reload()
  } catch (error) {
    void show(error)
  } finally {
    busy.value = false
  }
}

async function remove(kind: EntityKind, id: string, title: string): Promise<void> {
  if (busy.value || refreshing.value) return
  if (!window.confirm(`Permanently delete “${title}”? The audit record will be retained.`)) return
  busy.value = true
  resetFeedback()
  try {
    const response = await $fetch<{ message: string }>(`/api/admin/${kind}/${id}`, { method: 'DELETE' })
    message.value = response.message
    await reload()
  } catch (error) {
    errorMessage.value = describeAdminError(error)
  } finally {
    busy.value = false
    focusHeading()
  }
}

function leaveForm(): void {
  const id = editingId.value
  editingId.value = null
  formOpen.value = false
  clear()
  void nextTick(() => {
    const editButton = id ? document.getElementById(`admin-edit-${panel.value}-${id}`) : null
    const target = editButton ?? addButton.value ?? formHeading.value
    target?.focus()
  })
}

async function closeForm(): Promise<void> {
  if (await canLeave()) leaveForm()
}

function beforeUnload(event: BeforeUnloadEvent): void {
  event.preventDefault()
  event.returnValue = true
}
watch(hasUnsavedChanges, (unsaved) => {
  if (unsaved) window.addEventListener('beforeunload', beforeUnload)
  else window.removeEventListener('beforeunload', beforeUnload)
}, { flush: 'sync' })
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload))
onBeforeRouteLeave(canLeave)
</script>

<template>
  <div class="editor-dashboard">
    <AdminDiscardDialog ref="discardDialog" />
    <nav ref="panelNav" class="editor-tabs" aria-label="Editor sections">
      <button v-for="item in panels" :key="item.id" type="button" :disabled="busy" :aria-current="panel === item.id ? 'page' : undefined" @click="selectPanel(item.id)">
        {{ item.label }}
      </button>
    </nav>
    <p v-if="message" class="admin-alert admin-alert--success" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>
    <div v-if="refreshError" class="admin-alert admin-alert--error">
      <p role="status">{{ refreshError }}</p>
      <button class="text-button" type="button" :aria-disabled="refreshing" @click="reload()">Retry list refresh</button>
    </div>

    <section v-if="panel === 'overview'" aria-labelledby="editor-overview-title">
      <div class="editor-heading"><div><p class="eyebrow">Dashboard</p><h2 id="editor-overview-title">Publishing overview</h2></div><p>Administrative actions are recorded under {{ editorEmail }}.</p></div>
      <dl class="editor-stats">
        <div><dt>Drafts</dt><dd>{{ counts.drafts }}</dd></div><div><dt>Scheduled content</dt><dd>{{ counts.scheduled }}</dd></div><div><dt>Published news</dt><dd>{{ counts.publishedNews }}</dd></div><div><dt>Upcoming events</dt><dd>{{ counts.upcomingEvents }}</dd></div><div><dt>Slides live now</dt><dd>{{ counts.liveSlides }}</dd></div><div><dt>Slides waiting</dt><dd>{{ counts.scheduledSlides }}</dd></div>
      </dl>
      <h3>What would you like to update?</h3>
      <div class="editor-task-grid"><button v-for="item in panels.filter(item => item.id !== 'overview')" :key="item.id" type="button" @click="selectPanel(item.id)"><strong>{{ item.label }}</strong><span>{{ item.description }}</span><span class="text-link">Manage →</span></button></div>
      <div class="editor-guide"><h3>From draft to website</h3><ol><li>Choose a section and add or edit an item.</li><li>Choose images or a PDF in that item's form. Uploads are saved in Images & PDFs for reuse.</li><li>Check the preview, then publish. Saving a draft does not publish it.</li></ol><p>Files uploaded here belong to this website environment. A file uploaded to preview does not automatically appear in production.</p></div>
    </section>

    <section v-else-if="panel === 'news'" aria-labelledby="news-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">News</p><h2 id="news-editor-title" ref="formHeading" tabindex="-1">{{ formOpen ? (editingId ? 'Edit news item' : 'Create news item') : 'News items' }}</h2></div><button v-if="!formOpen" ref="addButton" type="button" class="button button--navy" @click="startNews()">Add news</button><button v-else type="button" class="text-button" @click="closeForm()">Back to all news</button></div>
      <p>Published news appears on the News page and in homepage updates. Save a draft to finish it later.</p>
      <div v-if="formOpen" class="editor-workspace">
        <form class="editor-form" @submit.prevent="save('news', normaliseNews())" @invalid.capture="revealInvalidAdminField" @input="clearOnInput">
          <AdminFormErrors :id="summaryId" :entries="entries" />
          <fieldset class="editor-form__fields" :disabled="busy || refreshing">
            <label>Title <input v-model="newsForm.title" v-bind="field('title')" required maxlength="180" @blur="fillSlug('news')"></label>
            <details><summary>Page address (generated from the title)</summary><label>Address ending <input v-model="newsForm.slug" v-bind="field('slug')" required maxlength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></label></details>
            <label>Summary <textarea v-model="newsForm.summary" v-bind="field('summary')" required maxlength="500" rows="3" /></label>
            <label>Full article <textarea v-model="newsForm.body" v-bind="field('body')" required maxlength="50000" rows="10" /></label>
            <div class="editor-form__row"><label>Category <input v-model="newsForm.category" v-bind="field('category')" maxlength="80"></label><label>Status <select v-model="newsForm.status" v-bind="field('status')" @change="clearField('publishAt', 'expiresAt')"><option v-for="status in newsStatuses" :key="status" :value="status">{{ status }}</option></select></label></div>
            <p class="meta">Enter dates and times in your computer’s timezone ({{ editorTimeZone }}).</p>
            <AdminDateTimeField
              v-if="newsForm.status === 'scheduled'" v-model="newsForm.publishAt" :field="field('publishAt')" label="Scheduled go-live"
              description="Sets when the item first appears on the website."
              required @update:model-value="clearField('publishAt')"
            />
            <div class="editor-form__row">
              <AdminDateTimeField
                v-model="newsForm.publishedAt" :field="field('publishedAt')" label="Date shown to readers"
                description="Sets the date shown in news listings. Leave blank to use the publication date. A future date also delays when an item marked Published goes live."
                @update:model-value="clearField('publishedAt')"
              />
              <AdminDateTimeField
                v-model="newsForm.expiresAt" :field="field('expiresAt')" label="Take offline on"
                description="Removes the item from the homepage and News, including its detail page. Leave blank to keep it available."
                :after="newsForm.status === 'scheduled' ? newsForm.publishAt : newsForm.publishedAt" @update:model-value="clearField('expiresAt')"
              />
            </div>
            <label>External URL <input v-model="newsForm.externalUrl" v-bind="field('externalUrl')" maxlength="500" placeholder="https://… or /route"></label>
            <AdminMediaField v-model="newsForm.coverImageKey" v-model:alt="newsForm.coverImageAlt" :field="field('coverImageKey')" :alt-field="field('coverImageAlt')" label="News cover image" accept="image" @update:model-value="clearField('coverImageKey', 'coverImageAlt')" @uploading="trackUpload" />
            <label class="editor-check"><input v-model="newsForm.isFeatured" v-bind="field('isFeatured')" type="checkbox"> Feature this item</label>
            <button class="button button--gold" type="submit" :disabled="busy || activeUploads > 0">{{ busy ? 'Saving…' : newsForm.status === 'published' ? 'Publish news' : newsForm.status === 'scheduled' ? 'Schedule news' : 'Save ' + newsForm.status }}</button>
          </fieldset>
        </form>
        <aside class="editor-preview" aria-label="News preview"><p class="eyebrow">Preview</p><p class="meta">{{ newsForm.category || 'INPA news' }} · {{ newsForm.status }}</p><h3>{{ newsForm.title || 'Untitled news item' }}</h3><p>{{ newsForm.summary || 'A summary will appear here.' }}</p><div class="editor-preview__body">{{ newsForm.body || 'The article body will appear here.' }}</div></aside>
      </div>
      <AdminRecordList v-if="!formOpen" :items="snapshot.news" kind="news" @edit="item => startNews(item as AdminNewsRecord)" @remove="(id, title) => remove('news', id, title)" />
    </section>

    <section v-else-if="panel === 'events'" aria-labelledby="event-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">Events</p><h2 id="event-editor-title" ref="formHeading" tabindex="-1">{{ formOpen ? (editingId ? 'Edit event' : 'Create event') : 'Events' }}</h2></div><button v-if="!formOpen" ref="addButton" type="button" class="button button--navy" @click="startEvent()">Add event</button><button v-else type="button" class="text-button" @click="closeForm()">Back to all events</button></div>
      <p>Published upcoming events appear on the homepage. Past events remain available in the event archive. Dates and times use your computer’s local timezone (<strong>{{ editorTimeZone }}</strong>). The event timezone controls how the published time appears to visitors.</p>
      <div v-if="formOpen" class="editor-workspace">
        <form class="editor-form" @submit.prevent="save('events', normaliseEvent())" @invalid.capture="revealInvalidAdminField" @input="clearOnInput">
          <AdminFormErrors :id="summaryId" :entries="entries" />
          <fieldset class="editor-form__fields" :disabled="busy || refreshing">
            <label>Event type
              <select v-model="eventForm.eventType" v-bind="field('eventType')" :disabled="activeUploads > 0">
                <option value="general">General event</option>
                <option value="colloquium">Young Scientist Colloquium</option>
              </select>
            </label>
            <p v-if="eventForm.eventType === 'colloquium'" class="meta">Published seminars also appear on the Young Scientist Colloquium page and move to its archive after the end time. If you leave the end time blank, the start time is used.</p>
            <label>Title <input v-model="eventForm.title" v-bind="field('title')" required maxlength="180" @blur="fillSlug('events')"></label>
            <details><summary>Page address (generated from the title)</summary><label>Address ending <input v-model="eventForm.slug" v-bind="field('slug')" required maxlength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*"></label></details>
            <template v-if="eventForm.eventType === 'colloquium'">
              <div class="editor-form__row">
                <label>Speaker <input v-model="eventForm.speaker" v-bind="field('speaker')" maxlength="180"></label>
                <label>Speaker affiliation <input v-model="eventForm.speakerAffiliation" v-bind="field('speakerAffiliation')" maxlength="200"></label>
              </div>
              <label>Seminar label (optional) <input v-model="eventForm.seminarLabel" v-bind="field('seminarLabel')" maxlength="80" placeholder="Third seminar"></label>
            </template>
            <label>Summary <textarea v-model="eventForm.summary" v-bind="field('summary')" required maxlength="500" rows="3" /></label>
            <label>Body <textarea v-model="eventForm.body" v-bind="field('body')" required maxlength="50000" rows="8" /></label>
            <div class="editor-form__row">
              <AdminDateTimeField :model-value="eventForm.startAt" :field="field('startAt')" label="Starts" required @update:model-value="eventForm.startAt = $event ?? ''; clearField('startAt')" />
              <AdminDateTimeField v-model="eventForm.endAt" :field="field('endAt')" label="Ends" :after="eventForm.startAt" @update:model-value="clearField('endAt')" />
            </div>
            <div class="editor-form__row"><label>Event timezone (IANA) <input v-model="eventForm.timezone" v-bind="field('timezone')" required maxlength="80" placeholder="Asia/Kolkata or Europe/Brussels"></label><label>Status <select v-model="eventForm.status" v-bind="field('status')" @change="clearField('publishAt')"><option v-for="status in eventStatuses" :key="status" :value="status">{{ status }}</option></select></label></div>
            <AdminDateTimeField v-if="eventForm.status === 'scheduled'" v-model="eventForm.publishAt" :field="field('publishAt')" label="Publication schedule" required @update:model-value="clearField('publishAt')" />
            <label>Location <input v-model="eventForm.locationName" v-bind="field('locationName')" maxlength="180"></label>
            <label>External URL <input v-model="eventForm.externalUrl" v-bind="field('externalUrl')" maxlength="500" placeholder="https://… or /route"></label>
            <AdminMediaField v-model="eventForm.coverImageKey" v-model:alt="eventForm.coverImageAlt" :field="field('coverImageKey')" :alt-field="field('coverImageAlt')" label="Event image or poster" accept="image" @update:model-value="clearField('coverImageKey', 'coverImageAlt')" @uploading="trackUpload" />
            <AdminMediaField v-if="eventForm.eventType === 'colloquium'" v-model="eventForm.posterPdfKey" :field="field('posterPdfKey')" label="Seminar PDF (optional)" accept="pdf" @update:model-value="clearField('posterPdfKey')" @uploading="trackUpload" />
            <div class="editor-check-row"><label class="editor-check"><input v-model="eventForm.isOnline" v-bind="field('isOnline')" type="checkbox"> Online event</label><label class="editor-check"><input v-model="eventForm.isFeatured" v-bind="field('isFeatured')" type="checkbox"> Feature this event</label></div>
            <button class="button button--gold" type="submit" :disabled="busy || activeUploads > 0">{{ busy ? 'Saving…' : eventForm.status === 'published' ? 'Publish event' : eventForm.status === 'scheduled' ? 'Schedule event' : 'Save ' + eventForm.status }}</button>
          </fieldset>
        </form>
        <aside class="editor-preview" aria-label="Event preview"><p class="eyebrow">Preview</p><p class="status-chip">{{ eventForm.status }}</p><h3>{{ eventForm.title || 'Untitled event' }}</h3><p>{{ eventForm.summary || 'An event summary will appear here.' }}</p><p class="meta">{{ eventForm.startAt || 'Start date required' }} · {{ eventForm.timezone }}</p><div class="editor-preview__body">{{ eventForm.body || 'Event details will appear here.' }}</div></aside>
      </div>
      <AdminRecordList v-if="!formOpen" :items="snapshot.events" kind="events" @edit="item => startEvent(item as AdminEventRecord)" @remove="(id, title) => remove('events', id, title)" />
    </section>

    <section v-else-if="panel === 'carousel'" aria-labelledby="carousel-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">Homepage</p><h2 id="carousel-editor-title" ref="formHeading" tabindex="-1">{{ formOpen ? (editingId ? 'Edit homepage slide' : 'Create homepage slide') : 'Homepage slides' }}</h2></div><button v-if="!formOpen" ref="addButton" type="button" class="button button--navy" @click="startCarousel()">Add slide</button><button v-else type="button" class="text-button" @click="closeForm()">Back to all slides</button></div>
      <p>Enable a slide to show it on the homepage. Leave both schedule fields blank for immediate, continuous display; use them only when the slide should appear or disappear at a particular time. Times use your computer’s local timezone (<strong>{{ editorTimeZone }}</strong>). A lower position number appears first.</p>
      <div v-if="formOpen" class="editor-workspace">
        <form class="editor-form" @submit.prevent="save('carousel', normaliseCarousel())" @invalid.capture="revealInvalidAdminField" @input="clearOnInput">
          <AdminFormErrors :id="summaryId" :entries="entries" />
          <fieldset class="editor-form__fields" :disabled="busy || refreshing">
            <label>Small heading above title <input v-model="carouselForm.eyebrow" v-bind="field('eyebrow')" maxlength="80"></label><label>Title <input v-model="carouselForm.title" v-bind="field('title')" required maxlength="180"></label><label>Summary <textarea v-model="carouselForm.summary" v-bind="field('summary')" maxlength="500" rows="3" /></label>
            <AdminMediaField v-model="carouselForm.imageKey" v-model:alt="carouselForm.imageAlt" :field="field('imageKey')" :alt-field="field('imageAlt')" label="Homepage slide image" accept="image" @update:model-value="clearField('imageKey', 'imageAlt')" @uploading="trackUpload" />
            <div class="editor-form__row"><label>Action label <input v-model="carouselForm.ctaLabel" v-bind="field('ctaLabel')" maxlength="80"></label><label>Action URL <input v-model="carouselForm.ctaUrl" v-bind="field('ctaUrl')" maxlength="500"></label></div>
            <div class="editor-form__row">
              <AdminDateTimeField v-model="carouselForm.startsAt" :field="field('startsAt')" label="Show from" @update:model-value="clearField('startsAt')" />
              <AdminDateTimeField v-model="carouselForm.endsAt" :field="field('endsAt')" label="Hide after" :after="carouselForm.startsAt" @update:model-value="clearField('endsAt')" />
            </div>
            <label>Sort order <input v-model.number="carouselForm.sortOrder" v-bind="field('sortOrder')" type="number" min="0" max="10000" step="1" required></label><label class="editor-check"><input v-model="carouselForm.isActive" v-bind="field('isActive')" type="checkbox"> Show on homepage</label>
            <button class="button button--gold" type="submit" :disabled="busy || activeUploads > 0">{{ busy ? 'Saving…' : (editingId ? 'Save changes' : 'Create item') }}</button>
          </fieldset>
        </form>
        <aside class="editor-preview editor-preview--dark" aria-label="Carousel preview"><p class="eyebrow eyebrow--light">{{ carouselForm.eyebrow || 'Featured update' }}</p><h3>{{ carouselForm.title || 'Untitled carousel item' }}</h3><p>{{ carouselForm.summary || 'Optional summary text will appear here.' }}</p><p class="meta meta--light"><strong>{{ carouselPreviewVisibility.label }}</strong> — {{ carouselPreviewVisibility.detail }} Position {{ carouselForm.sortOrder }}.</p></aside>
      </div>
      <AdminRecordList v-if="!formOpen" :items="snapshot.carousel" kind="carousel" @edit="item => startCarousel(item as AdminCarouselRecord)" @remove="(id, title) => remove('carousel', id, title)" />
    </section>

    <AdminScienceEditor v-else-if="panel === 'publications' || panel === 'research'" :key="panel" ref="scienceEditor" :kind="panel" :can-leave="canLeave" />
    <AdminCandidatesEditor v-else-if="panel === 'candidates'" />
    <section v-else aria-labelledby="media-editor-title">
      <div class="editor-heading"><div><p class="eyebrow">Reusable files</p><h2 id="media-editor-title">Images & PDFs</h2></div></div>
      <p>Uploads are saved in this library. To put a file on the website, open a news item, event, homepage slide, research story or Nuclear Horizons issue and choose the file there. Uploading alone does not add it to a page.</p>
      <details class="editor-guide"><summary>Upload an image for later use</summary><AdminMediaUploader @uploaded="mediaRefreshKey++" /></details>
      <details class="editor-guide"><summary>Upload a PDF for later use</summary><AdminMediaUploader accept="pdf" @uploaded="mediaRefreshKey++" /></details>
      <AdminMediaLibrary :refresh-key="mediaRefreshKey" :selectable="false" />
    </section>
  </div>
</template>

<style scoped>
.editor-task-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 1rem; margin: 1.5rem 0; }
.editor-task-grid button { padding: 1.4rem; border: 1px solid #cedbe5; text-align: left; background: white; color: var(--color-text); display: grid; gap: .8rem; cursor: pointer; }
.editor-task-grid strong { font-size: 1.2rem; color: var(--color-navy-950); }
.editor-task-grid button:hover { background: #f1f6fa; }
.editor-guide { padding: 1.4rem; background: #f1f6fa; margin: 1.5rem 0; }
.editor-guide li { margin: .6rem 0; }
</style>
