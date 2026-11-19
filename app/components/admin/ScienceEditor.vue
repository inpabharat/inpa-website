<script setup lang="ts">
import type { PublicationInput, PublicationRecord, ResearchInput, ResearchRecord, ScienceStatus } from '~~/shared/types/science'
import { makeSlug } from '~~/shared/utils/content-validation'
import { localCalendarDate } from '~~/shared/utils/editor-date'

const props = defineProps<{ kind: 'publications' | 'research', canLeave: () => boolean | Promise<boolean> }>()
const records = ref<(PublicationRecord | ResearchRecord)[]>([])
const loading = ref(false)
const busy = ref(false)
const activeUploads = ref(0)
const opened = ref(false)
const editingId = ref<string | null>(null)
const errorMessage = ref('')
const loadError = ref('')
const message = ref('')
const editForm = ref<HTMLFormElement | null>(null)
const formStatus = ref<HTMLParagraphElement | null>(null)
const addButton = ref<HTMLButtonElement | null>(null)
const success = ref<HTMLParagraphElement | null>(null)
const { entries, summaryId, clear, clearField, clearOnInput, field, show } = useAdminFormErrors()
const initialValue = ref('')
const publication = reactive<PublicationInput>(blankPublication())
const research = reactive<ResearchInput>(blankResearch())
const isPublication = computed(() => props.kind === 'publications')
const current = computed(() => isPublication.value ? publication : research)
const dirty = computed(() => opened.value && JSON.stringify(current.value) !== initialValue.value)
const hasPendingWork = computed(() => busy.value || activeUploads.value > 0)
const title = computed(() => isPublication.value ? 'Nuclear Horizons' : 'Featured research')
const imageUrl = (key: string | null) => key ? (key.startsWith('/') ? key : `/media/${key}`) : ''

function blankPublication(): PublicationInput {
  return { slug: '', title: 'Nuclear Horizons', volume: 1, issueNumber: 1, issueLabel: '', publicationDate: '', summary: '', editorial: '', featuredReview: '', pdfKey: '', coverImageKey: '', coverImageAlt: '', pageCount: 1, status: 'draft' }
}
function blankResearch(): ResearchInput {
  return { slug: '', title: '', summary: '', body: '', authors: '', institutions: '', journal: '', doi: '', imageKey: null, imageAlt: null, imageCredit: null, status: 'draft', isFeatured: false, publishedAt: localCalendarDate() }
}
async function load(): Promise<void> {
  if (loading.value) return
  loading.value = true
  try {
    const response = await $fetch<{ data: (PublicationRecord | ResearchRecord)[] }>(`/api/admin/${props.kind}`)
    records.value = response.data
    loadError.value = ''
  } catch (error) { loadError.value = describeAdminError(error) }
  finally { loading.value = false }
}
function trackUpload(uploading: boolean): void {
  activeUploads.value += uploading ? 1 : -1
}
async function edit(item?: PublicationRecord | ResearchRecord): Promise<void> {
  if (!await props.canLeave()) return
  editingId.value = item?.id ?? null
  Object.assign(publication, blankPublication())
  Object.assign(research, blankResearch())
  if (item) {
    if ('volume' in item) Object.assign(publication, item)
    else Object.assign(research, { ...item, publishedAt: item.publishedAt.slice(0, 10) })
  }
  initialValue.value = JSON.stringify(current.value)
  opened.value = true
  message.value = ''
  errorMessage.value = ''
  clear()
  void nextTick(() => formStatus.value?.focus())
}
async function close(): Promise<void> {
  if (!await props.canLeave()) return
  const id = editingId.value
  opened.value = false
  clear()
  void nextTick(() => {
    const editButton = id ? document.getElementById(`admin-edit-${props.kind}-${id}`) : null
    const target = editButton ?? addButton.value
    target?.focus()
  })
}
function fillIdentity(): void {
  if (isPublication.value) {
    if (!publication.issueLabel) publication.issueLabel = `Volume ${publication.volume}, Issue ${publication.issueNumber}`
    if (!publication.slug) publication.slug = `nuclear-horizons-${publication.volume}-${publication.issueNumber}`
  } else if (!research.slug) research.slug = makeSlug(research.title)
}
function publish(): void {
  if (editForm.value?.reportValidity()) void save('published')
}
async function save(status: ScienceStatus): Promise<void> {
  if (busy.value || activeUploads.value) return
  fillIdentity()
  busy.value = true
  errorMessage.value = ''
  message.value = ''
  clear()
  try {
    const body = { ...current.value, status, ...(!isPublication.value && !research.imageKey ? { imageKey: null, imageAlt: null, imageCredit: null } : {}) }
    const response = await $fetch<{ data: PublicationRecord | ResearchRecord }>(editingId.value ? `/api/admin/${props.kind}/${editingId.value}` : `/api/admin/${props.kind}`, { method: editingId.value ? 'PUT' : 'POST', body })
    if ('volume' in response.data) Object.assign(publication, response.data)
    else Object.assign(research, { ...response.data, publishedAt: response.data.publishedAt.slice(0, 10) })
    editingId.value = response.data.id
    initialValue.value = JSON.stringify(current.value)
    message.value = status === 'published' ? 'Published. The public page will show your changes; the homepage may take up to a minute to refresh.' : status === 'archived' ? 'Removed from public view. You can edit and publish it again here.' : 'Draft saved. It is visible only to editors.'
    void nextTick(() => success.value?.focus())
    await load()
  } catch (error) { void show(error) }
  finally { busy.value = false }
}
async function remove(item: PublicationRecord | ResearchRecord): Promise<void> {
  if (busy.value) return
  if (!window.confirm(`Remove “${'issueLabel' in item ? item.issueLabel : item.title}”? It will no longer appear on the website.`)) return
  busy.value = true
  errorMessage.value = ''
  message.value = ''
  try {
    await $fetch(`/api/admin/${props.kind}/${item.id}`, { method: 'DELETE' })
    message.value = 'Item removed from the website.'
    await load()
  } catch (error) { errorMessage.value = describeAdminError(error) }
  finally {
    busy.value = false
    void nextTick(() => (success.value ?? addButton.value)?.focus())
  }
}
onMounted(load)
defineExpose({ dirty, hasPendingWork })
</script>

<template>
  <section :aria-label="title">
    <div class="editor-heading">
      <div><p class="eyebrow">{{ isPublication ? 'Publication' : 'Science' }}</p><h2>{{ title }}</h2></div>
      <button v-if="!opened" ref="addButton" class="button button--navy" type="button" @click="edit()">{{ isPublication ? 'Add an issue' : 'Add research' }}</button>
      <button v-else class="text-button" type="button" :disabled="busy" @click="close()">Back to all {{ isPublication ? 'issues' : 'research' }}</button>
    </div>
    <p class="science-editor-help">{{ isPublication ? 'Publish an issue with its PDF, cover and editorial details. The newest published issue appears on the homepage and Nuclear Horizons page; every published issue remains in the archive.' : 'Add a research story with its authors, institutions and paper reference. Published stories appear on the Research page. Select “Feature on the homepage” to place a story in the homepage spotlight.' }}</p>
    <p v-if="message" ref="success" class="admin-alert admin-alert--success" tabindex="-1" role="status">{{ message }}</p>
    <p v-if="errorMessage" class="admin-alert admin-alert--error" role="alert">{{ errorMessage }}</p>
    <div v-if="loadError" class="admin-alert admin-alert--error">
      <p role="status">{{ loadError }}</p>
      <button class="text-button" type="button" :aria-disabled="loading" @click="load()">Retry list refresh</button>
    </div>
    <div v-if="opened" class="editor-workspace">
      <form ref="editForm" class="editor-form" @submit.prevent @invalid.capture="revealInvalidAdminField" @input="clearOnInput">
        <p ref="formStatus" class="meta" tabindex="-1">{{ editingId ? 'Editing saved content' : 'New item' }} · {{ current.status }}<span v-if="dirty"> · Unsaved changes</span></p>
        <AdminFormErrors :id="summaryId" :entries="entries" />
        <fieldset class="editor-form__fields" :disabled="busy">
          <template v-if="isPublication">
            <fieldset><legend>1. Issue details</legend>
              <label>Publication title <input v-model="publication.title" v-bind="field('title')" required maxlength="180"></label>
              <div class="editor-form__row"><label>Volume <input v-model.number="publication.volume" v-bind="field('volume')" type="number" min="1" max="1000" required></label><label>Issue number <input v-model.number="publication.issueNumber" v-bind="field('issueNumber')" type="number" min="1" max="1000" required></label></div>
              <label>Issue heading <input v-model="publication.issueLabel" v-bind="field('issueLabel')" maxlength="180" placeholder="Volume 1, Issue 3" @focus="fillIdentity()"></label>
              <div class="editor-form__row"><label>Publication date <input v-model="publication.publicationDate" v-bind="field('publicationDate')" type="date" required></label><label>Number of pages <input v-model.number="publication.pageCount" v-bind="field('pageCount')" type="number" min="1" max="10000" required></label></div>
              <label>Short introduction <textarea v-model="publication.summary" v-bind="field('summary')" rows="3" maxlength="1000" /></label>
            </fieldset>
            <fieldset><legend>2. Issue PDF and cover</legend>
              <AdminMediaField v-model="publication.pdfKey" :field="field('pdfKey')" label="Issue PDF" accept="pdf" @update:model-value="clearField('pdfKey')" @uploading="trackUpload" />
              <AdminMediaField v-model="publication.coverImageKey" v-model:alt="publication.coverImageAlt" :field="field('coverImageKey')" :alt-field="field('coverImageAlt')" label="Issue cover" accept="image" @update:model-value="clearField('coverImageKey', 'coverImageAlt')" @uploading="trackUpload" />
            </fieldset>
            <fieldset><legend>3. Inside this issue</legend>
              <label>Editorial (optional) <textarea v-model="publication.editorial" v-bind="field('editorial')" rows="7" maxlength="50000" placeholder="Editorial title, author and text or excerpt" /></label>
              <label>Featured review (optional) <textarea v-model="publication.featuredReview" v-bind="field('featuredReview')" rows="5" maxlength="10000" placeholder="Review title, authors, page numbers and a short introduction" /></label>
            </fieldset>
          </template>
          <template v-else>
            <fieldset><legend>1. Research story</legend>
              <label>Research title <input v-model="research.title" v-bind="field('title')" required maxlength="180" @blur="fillIdentity()"></label>
              <label>Short summary for the homepage <textarea v-model="research.summary" v-bind="field('summary')" required rows="3" maxlength="500" /></label>
              <label>Full story <textarea v-model="research.body" v-bind="field('body')" required rows="10" maxlength="50000" /></label>
              <p class="meta">Use plain text and paragraph breaks. The preview shows how your story will read.</p>
            </fieldset>
            <fieldset><legend>2. Paper and authors</legend>
              <label>Authors <textarea v-model="research.authors" v-bind="field('authors')" required rows="2" maxlength="2000" /></label>
              <label>Institutions <textarea v-model="research.institutions" v-bind="field('institutions')" required rows="2" maxlength="2000" /></label>
              <label>Journal <input v-model="research.journal" v-bind="field('journal')" required maxlength="300"></label>
              <label>DOI or DOI link <input v-model="research.doi" v-bind="field('doi')" required maxlength="500" placeholder="10.… or https://doi.org/…"></label>
              <label>Story publication date <input v-model="research.publishedAt" v-bind="field('publishedAt')" type="date" required></label>
            </fieldset>
            <fieldset><legend>3. Research image (optional)</legend>
              <AdminMediaField v-model="research.imageKey" v-model:alt="research.imageAlt" :field="field('imageKey')" :alt-field="field('imageAlt')" label="Research figure or photograph" accept="image" @update:model-value="clearField('imageKey', 'imageAlt')" @uploading="trackUpload" />
              <label>Figure caption / credit <textarea v-model="research.imageCredit" v-bind="field('imageCredit')" rows="2" maxlength="500" /></label>
            </fieldset>
            <label class="editor-check"><input v-model="research.isFeatured" v-bind="field('isFeatured')" type="checkbox"> Feature on the homepage</label>
            <p class="meta">If several stories are featured, the most recently dated one appears first.</p>
          </template>
          <details><summary>Page address</summary><label>Address ending <input v-model="current.slug" v-bind="field('slug')" maxlength="120" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" @focus="fillIdentity()"></label><p class="meta">Generated automatically. Keep it unchanged when updating an existing story so shared links continue to work.</p></details>
          <div class="editor-actions science-save-actions">
            <button class="button button--navy" type="button" :disabled="busy || activeUploads > 0" @click="save('draft')">{{ busy ? 'Saving…' : 'Save draft' }}</button>
            <button class="button button--gold" type="button" :disabled="busy || activeUploads > 0" @click="publish">{{ current.status === 'published' ? 'Publish changes' : 'Publish on website' }}</button>
            <button v-if="editingId && current.status === 'published'" class="text-button" type="button" :disabled="busy || activeUploads > 0" @click="save('archived')">Remove from public view</button>
          </div>
        </fieldset>
      </form>
      <aside class="editor-preview science-preview" aria-label="Content preview">
        <p class="eyebrow">Preview · {{ current.status }}</p>
        <template v-if="isPublication">
          <img v-if="publication.coverImageKey" class="science-cover" :src="imageUrl(publication.coverImageKey)" :alt="publication.coverImageAlt">
          <h3>{{ publication.issueLabel || 'New Nuclear Horizons issue' }}</h3><p>{{ publication.publicationDate }} · {{ publication.pageCount }} pages</p><p>{{ publication.summary }}</p>
          <a v-if="publication.pdfKey" :href="imageUrl(publication.pdfKey)" target="_blank" rel="noopener noreferrer">Open selected PDF ↗</a>
          <template v-if="publication.editorial"><h4>Editorial</h4><p class="editor-preview__body">{{ publication.editorial }}</p></template>
          <template v-if="publication.featuredReview"><h4>Featured review</h4><p class="editor-preview__body">{{ publication.featuredReview }}</p></template>
        </template>
        <template v-else>
          <img v-if="research.imageKey" :src="imageUrl(research.imageKey)" :alt="research.imageAlt || ''">
          <p v-if="research.imageCredit" class="meta">{{ research.imageCredit }}</p>
          <h3>{{ research.title || 'Your research title' }}</h3><p>{{ research.summary }}</p>
          <dl><dt>Authors</dt><dd>{{ research.authors }}</dd><dt>Institutions</dt><dd>{{ research.institutions }}</dd><dt>Journal</dt><dd>{{ research.journal }}</dd><dt>DOI</dt><dd>{{ research.doi }}</dd></dl>
          <div class="editor-preview__body">{{ research.body }}</div>
        </template>
      </aside>
    </div>
    <template v-else>
      <p v-if="loading" role="status">Loading {{ isPublication ? 'issues' : 'research' }}…</p>
      <div v-else-if="records.length" class="science-record-grid">
        <article v-for="item in records" :key="item.id" class="science-record">
          <p class="status-chip">{{ item.status }}</p><h3>{{ 'issueLabel' in item ? item.issueLabel : item.title }}</h3>
          <p v-if="'isFeatured' in item && item.isFeatured" class="meta">Selected for homepage spotlight</p>
          <p class="meta">{{ 'publicationDate' in item ? item.publicationDate : item.publishedAt.slice(0, 10) }} · Added by {{ item.createdBy }}</p>
          <p>{{ item.summary }}</p><div class="editor-row-actions"><button :id="`admin-edit-${kind}-${item.id}`" type="button" @click="edit(item)">Edit {{ isPublication ? 'issue' : 'research' }}</button><button class="danger-button" type="button" :disabled="busy" @click="remove(item)">Remove</button></div>
        </article>
      </div>
      <p v-else-if="!loadError">No {{ isPublication ? 'issues' : 'research stories' }} yet. Use the button above to add the first one.</p>
    </template>
  </section>
</template>

<style scoped>
.science-editor-help { max-width: 75ch; margin-bottom: 2rem; }
fieldset { border: 1px solid var(--color-border, #d6e0e9); padding: 1.2rem; display: grid; gap: 1rem; min-width: 0; }
legend { font-weight: 700; padding: 0 .4rem; }
.science-record-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr)); gap: 1rem; }
.science-record { border: 1px solid #d6e0e9; padding: 1.4rem; }
.science-preview { align-self: start; overflow-wrap: anywhere; }
.science-preview img { width: 100%; max-height: 320px; object-fit: contain; }
.science-preview img.science-cover { max-height: 280px; }
.science-preview dd { margin: 0 0 1rem; }
.science-preview dt { font-weight: 700; }
.science-preview h4 { margin-top: 1.5rem; }
.science-save-actions { flex-wrap: wrap; }
</style>
