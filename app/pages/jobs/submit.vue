<script setup lang="ts">
import { candidateLimits, candidateRoles, candidateStages } from '~~/shared/types/candidates'
import type { CandidateProfile, CandidateRole } from '~~/shared/types/candidates'
import { CandidateValidationError, parseCandidateSubmission } from '~~/shared/utils/candidate-validation'

const form = reactive({
  name: '', affiliation: '', stage: '', roles: [] as CandidateRole[],
  research: '', availability: '', summary: '', cvUrl: '', email: '', website: '',
})
const preview = ref<CandidateProfile>()
const consent = ref(false)
const sent = ref(false)
const busy = ref(false)
const error = ref('')
const stageHeading = ref<HTMLElement>()

async function review() {
  error.value = ''
  try {
    preview.value = parseCandidateSubmission({ ...form, consent: true }).profile
    await nextTick()
    stageHeading.value?.focus()
  } catch (failure) {
    error.value = failure instanceof CandidateValidationError
      ? Object.values(failure.issues).join(' ') : 'Check the form and try again.'
  }
}

async function edit() {
  preview.value = undefined
  consent.value = false
  error.value = ''
  await nextTick()
  stageHeading.value?.focus()
}

async function submit() {
  if (busy.value || !preview.value || !consent.value) return
  busy.value = true
  error.value = ''
  try {
    await $fetch('/api/public/candidates', { method: 'POST', body: { ...form, consent: consent.value } })
    Object.assign(form, { name: '', affiliation: '', stage: '', roles: [], research: '', availability: '', summary: '', cvUrl: '', email: '', website: '' })
    preview.value = undefined
    consent.value = false
    sent.value = true
    await nextTick()
    stageHeading.value?.focus()
  } catch (failure) {
    error.value = candidateError(failure, 'Your profile could not be submitted. Please try again.')
  } finally {
    busy.value = false
  }
}

useSeoMeta({ title: 'List your academic profile', robots: 'noindex, nofollow, noarchive' })
</script>

<template>
  <section class="section">
    <div class="container candidate-submission">
      <NuxtLink class="text-link" to="/jobs">← Academic Candidates</NuxtLink>
      <h1>List your academic profile</h1>
      <p class="lead">For nuclear science researchers approaching PhD completion or seeking their next postdoctoral, faculty or research role.</p>

      <div v-if="sent" class="submission-notice">
        <h2 ref="stageHeading" tabindex="-1">Submission received</h2>
        <p>An INPA editor will send a private verification link to the address you supplied. Your profile becomes public after you verify your email and an editor approves the listing.</p>
        <p>If you already have a submission, use the link from INPA to manage it or contact the office for a replacement.</p>
        <NuxtLink class="text-link" to="/jobs">Return to the directory</NuxtLink>
      </div>

      <form v-else-if="preview" class="submission-review" @submit.prevent="submit">
        <h2 ref="stageHeading" tabindex="-1">Review your public listing</h2>
        <p>Anyone can see the details below once approved. Your verification email is visible to authorised INPA editors.</p>
        <div class="submission-preview"><CandidatesProfile :profile="preview" /></div>
        <label class="submission-check">
          <input v-model="consent" type="checkbox" required>
          <span>I agree that INPA can publish this profile and CV link for 90 days after approval. I understand that viewers can save or share copies, and I can withdraw my listing through my private link.</span>
        </label>
        <p class="submission-policy"><NuxtLink class="text-link" to="/privacy#academic-candidates">Academic Candidates privacy notice</NuxtLink></p>
        <p v-if="error" class="submission-error" role="alert">{{ error }}</p>
        <div class="submission-actions">
          <button class="button button--navy" type="submit" :disabled="busy">{{ busy ? 'Submitting…' : 'Submit for review' }}</button>
          <button class="button button--outline-navy" type="button" :disabled="busy" @click="edit">Edit details</button>
        </div>
      </form>

      <div v-else class="submission-grid">
        <form class="submission-form" @submit.prevent="review">
          <h2 ref="stageHeading" tabindex="-1">Your profile</h2>
          <div class="submission-row">
            <label>Display name <input v-model="form.name" type="text" autocomplete="name" :maxlength="candidateLimits.name" required></label>
            <label>Current affiliation (optional) <input v-model="form.affiliation" type="text" autocomplete="organization" :maxlength="candidateLimits.affiliation"></label>
          </div>
          <label>Career stage
            <select v-model="form.stage" required>
              <option value="" disabled>Select your stage</option>
              <option v-for="item in candidateStages" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>
          <fieldset>
            <legend>Roles sought</legend>
            <label v-for="item in candidateRoles" :key="item.value" class="submission-check">
              <input v-model="form.roles" type="checkbox" :value="item.value">
              {{ item.label }}
            </label>
          </fieldset>
          <label>Research areas <input v-model="form.research" type="text" :maxlength="candidateLimits.research" placeholder="e.g. nuclear reactions, gamma-ray spectroscopy" required></label>
          <label>Availability (optional) <input v-model="form.availability" type="text" :maxlength="candidateLimits.availability" placeholder="e.g. From July 2027"></label>
          <label>Short research summary
            <textarea v-model="form.summary" :maxlength="candidateLimits.summary" rows="4" required />
            <span class="submission-hint">Up to {{ candidateLimits.summary }} characters.</span>
          </label>
          <label>Public CV link
            <input v-model="form.cvUrl" type="url" :maxlength="candidateLimits.cvUrl" placeholder="https://…" aria-describedby="candidate-cv-privacy" required>
          </label>
          <p id="candidate-cv-privacy" class="submission-hint cv-hint">Use a public CV with a professional way to contact you. Remove home addresses, personal phone numbers and referees’ private contact details.</p>
          <label>Verification email
            <input v-model="form.email" type="email" autocomplete="email" :maxlength="candidateLimits.email" required>
            <span class="submission-hint">INPA uses this address to verify and manage your listing.</span>
          </label>
          <div class="submission-trap" inert aria-hidden="true">
            <label>Leave this field empty <input v-model="form.website" type="text" tabindex="-1" autocomplete="off"></label>
          </div>
          <p v-if="error" class="submission-error" role="alert">{{ error }}</p>
          <div class="submission-actions"><button class="button button--navy" type="submit">Preview public listing</button></div>
        </form>

        <aside class="submission-note" aria-labelledby="candidate-public-heading">
          <h2 id="candidate-public-heading">Before you submit</h2>
          <p>Your listing and CV link will be public. Leave your affiliation blank if you prefer to keep it private.</p>
          <p>Your profile appears after email verification and editorial review. It expires after 90 days unless renewed.</p>
          <NuxtLink class="text-link" to="/privacy#academic-candidates">Academic Candidates privacy notice</NuxtLink>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
.candidate-submission { max-width: 68rem; }
.candidate-submission h1 {
  font-size: clamp(2.2rem, 5vw, 4.1rem);
  margin: 0.85rem 0 0.8rem;
}
.candidate-submission .lead { max-width: 62ch; }
.submission-grid { display: grid; align-items: start; gap: 2rem; }
.submission-form { display: grid; gap: 1rem; min-width: 0; }
.submission-form h2,
.submission-review h2,
.submission-notice h2 { font-size: clamp(1.55rem, 3vw, 2.3rem); margin-bottom: 0.15rem; }
.submission-form label { display: grid; gap: 0.35rem; font-weight: 700; min-width: 0; }
.submission-form input:not([type=checkbox]),
.submission-form select,
.submission-form textarea {
  padding: 0.6rem 0.75rem;
  min-height: 2.8rem;
  width: 100%;
  border: 1px solid #97acb9;
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  font: inherit;
  font-weight: 400;
}
.submission-form textarea { resize: vertical; }
.submission-form fieldset { border: 1px solid var(--color-border); min-width: 0; margin: 0; padding: 0.65rem 1rem; }
.submission-form legend { font-weight: 700; padding-inline: 0.35rem; }
.submission-row { display: grid; gap: 0.85rem; }
.submission-form .submission-check,
.submission-check { display: flex; align-items: start; gap: 0.6rem; font-weight: 450; padding-block: 0.35rem; }
.submission-check input { margin: 0.38rem 0 0; flex: 0 0 auto; accent-color: var(--color-navy-700); }
.submission-review .submission-check { max-width: 70ch; }
.submission-note,
.submission-notice {
  padding: clamp(1rem, 3vw, 1.65rem);
  background: var(--color-surface-subtle);
  border-top: 2px solid var(--color-gold-500);
}
.submission-note h2 { font-size: 1.45rem; margin-bottom: 0.65rem; }
.submission-notice p { margin-top: 0.75rem; }
.submission-preview { border-block: 1px solid var(--color-border); margin-block: 1.25rem; }
.submission-actions { display: flex; flex-wrap: wrap; gap: 0.65rem; }
.submission-hint,
.submission-policy { color: var(--color-text-muted); font-size: 0.9rem; font-weight: 400; }
.cv-hint { margin: -0.65rem 0 0; }
.submission-error { color: #8a2225; margin: 0.3rem 0; }
.submission-trap { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (min-width: 40rem) {
  .submission-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 58rem) {
  .submission-grid { grid-template-columns: minmax(0, 1fr) minmax(13rem, 0.46fr); }
}
</style>
