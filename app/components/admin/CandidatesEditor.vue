<script setup lang="ts">
import type { CandidateReview, CandidateStatus } from '~~/shared/types/candidates'

const page = ref(1)
const records = ref<CandidateReview[]>([])
const hasNext = ref(false)
const loading = ref(true)
const busy = ref(false)
const reviewed = ref<Record<string, boolean>>({})
const feedback = ref('')
const error = ref('')
const draft = ref<{ id: string, email: string, subject: string, body: string }>()
const labels: Record<CandidateStatus, string> = {
  unverified: 'Email verification needed',
  review: 'Ready for review',
  published: 'Published',
  expired: 'Expired',
}

async function load(destination = page.value) {
  loading.value = true
  error.value = ''
  try {
    const result = await $fetch<{ profiles: CandidateReview[], hasNext: boolean }>('/api/admin/candidates', { query: { page: destination } })
    records.value = result.profiles
    hasNext.value = result.hasNext
    page.value = destination
    reviewed.value = {}
  } catch (failure) {
    error.value = candidateError(failure, 'The candidate queue could not be loaded.')
  } finally {
    loading.value = false
  }
}

function navigate(destination: number) {
  draft.value = undefined
  feedback.value = ''
  return load(destination)
}

async function issueLink(record: CandidateReview) {
  busy.value = true
  error.value = ''
  feedback.value = ''
  draft.value = undefined
  try {
    const result = await $fetch<{ email: string, link: string, verified: boolean }>(`/api/admin/candidates/${record.id}`, {
      method: 'POST', body: { action: 'link' },
    })
    const instruction = result.verified
      ? 'Use this private link to manage your Academic Candidates listing.'
      : 'If you submitted a profile to the INPA Academic Candidates directory, open the private link below within three days. Review the profile and confirm your email. An INPA editor will review it after verification.'
    draft.value = {
      id: record.id, email: result.email,
      subject: result.verified ? 'Manage your INPA academic listing' : 'Verify your INPA academic listing',
      body: `${instruction}\n\n${result.link}\n\nKeep this link private. If the listing is unfamiliar, you can ignore this message.\n\nINPA`,
    }
    await load()
  } catch (failure) {
    error.value = candidateError(failure, 'The email draft could not be prepared.')
  } finally {
    busy.value = false
  }
}

async function change(record: CandidateReview, action: 'publish' | 'remove') {
  if (action === 'remove' && !window.confirm(`Permanently remove the listing for ${record.profile.name}?`)) return
  busy.value = true
  feedback.value = ''
  error.value = ''
  try {
    const result = await $fetch<{ message: string }>(`/api/admin/candidates/${record.id}`, {
      method: 'POST', body: { action, reviewed: Boolean(reviewed.value[record.id]) },
    })
    feedback.value = result.message
    if (action === 'remove' && draft.value?.id === record.id) draft.value = undefined
    await load(action === 'remove' && records.value.length === 1 ? Math.max(1, page.value - 1) : page.value)
  } catch (failure) {
    error.value = candidateError(failure, 'The listing could not be updated.')
  } finally {
    busy.value = false
  }
}

const mailto = computed(() => draft.value
  ? `mailto:${encodeURIComponent(draft.value.email)}?subject=${encodeURIComponent(draft.value.subject)}&body=${encodeURIComponent(draft.value.body)}`
  : '')

onMounted(() => load())
</script>

<template>
  <section aria-labelledby="candidate-editor-title">
    <div class="editor-heading">
      <h2 id="candidate-editor-title">Academic Candidates</h2>
      <button class="button button--outline-navy" type="button" :disabled="busy || loading" @click="load()">Refresh queue</button>
    </div>
    <p>Send the verification link from INPA’s mailbox, then review the exact profile and CV before publishing.</p>
    <p v-if="feedback" role="status">{{ feedback }}</p>
    <p v-if="error" class="editor-error" role="alert">{{ error }}</p>
    <p v-if="loading" role="status">Loading submissions…</p>
    <PlaceholderNotice v-else-if="!records.length && !error" message="There are no candidate submissions on this page." />
    <ul v-else class="candidate-review-list" role="list">
      <li v-for="record in records" :key="record.id">
        <div class="review-status">
          <strong>{{ record.renewalRequested ? 'Renewal requested' : labels[record.status] }}</strong>
          <span v-if="record.expiresAt">Expiry {{ formatIndiaDate(record.expiresAt) }}</span>
          <span v-else>Received {{ formatIndiaDate(record.createdAt) }}</span>
        </div>
        <CandidatesProfile :profile="record.profile" />
        <p class="review-private"><strong>Private verification email</strong><br>{{ record.email }}</p>
        <div v-if="record.status === 'review' || record.renewalRequested" class="review-confirmation">
          <label>
            <input v-model="reviewed[record.id]" type="checkbox">
            I checked the profile and confirmed the CV opens without signing in and is suitable for public sharing.
          </label>
          <button class="button button--navy" type="button" :disabled="busy || !reviewed[record.id]" @click="change(record, 'publish')">
            {{ record.renewalRequested ? 'Approve renewal' : 'Publish for 90 days' }}
          </button>
        </div>
        <div class="review-actions">
          <button class="button button--outline-navy" type="button" :disabled="busy" @click="issueLink(record)">
            {{ record.linkIssued ? 'Prepare replacement link' : 'Prepare verification email' }}
          </button>
          <button class="text-button" type="button" :disabled="busy" @click="change(record, 'remove')">Remove submission</button>
        </div>
        <div v-if="draft?.id === record.id" class="review-draft">
          <p>Send this message to <strong>{{ draft.email }}</strong> from the INPA mailbox. The previous link expires when a replacement is prepared.</p>
          <a class="button button--navy" :href="mailto">Open email draft</a>
          <details><summary>View email text</summary><textarea :value="draft.body" rows="6" readonly aria-label="Verification email text" /></details>
        </div>
      </li>
    </ul>
    <div v-if="page > 1 || hasNext" class="review-actions review-pagination">
      <button v-if="page > 1" class="button button--outline-navy" :disabled="busy || loading" type="button" @click="navigate(page - 1)">Previous</button>
      <span>Page {{ page }}</span>
      <button v-if="hasNext && page < 1000" class="button button--outline-navy" :disabled="busy || loading" type="button" @click="navigate(page + 1)">Next</button>
    </div>
  </section>
</template>

<style scoped>
.candidate-review-list { list-style: none; padding: 0; margin: 1.5rem 0 0; }
.candidate-review-list li { border-block-start: 1px solid var(--color-border); padding: 1.25rem 0; }
.review-status,
.review-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 0.65rem 1rem; }
.review-status { font-size: 0.9rem; color: var(--color-navy-700); }
.review-private { font-size: 0.9rem; overflow-wrap: anywhere; }
.review-confirmation { display: flex; gap: 0.85rem 1.2rem; flex-wrap: wrap; align-items: center; margin-bottom: 0.85rem; }
.review-confirmation label { display: flex; align-items: start; gap: 0.5rem; }
.review-confirmation input { margin-top: 0.4rem; }
.review-draft { margin-top: 1rem; padding: 1rem; background: var(--color-surface-subtle); overflow-wrap: anywhere; }
.review-draft details { margin-top: 0.85rem; }
.review-draft textarea { width: 100%; }
</style>
