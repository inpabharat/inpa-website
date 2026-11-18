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
const fieldErrors = ref<Partial<Record<string, string>>>({})
const stageHeading = ref<HTMLElement>()
const candidateForm = ref<HTMLFormElement>()

function fieldAttributes(field: string, description?: string) {
  const invalid = Boolean(fieldErrors.value[field])
  const descriptions = [description, invalid ? `candidate-${field}-error` : undefined]
  return {
    name: field,
    'aria-invalid': invalid || undefined,
    'aria-describedby': descriptions.filter(Boolean).join(' ') || undefined,
  }
}

function clearFieldError(event: Event) {
  const control = event.target
  if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return

  // Vue updates checkboxes and selects on change, after the browser fires input.
  if (event.type === 'input' && (control instanceof HTMLSelectElement || control.type === 'checkbox')) return
  if (fieldErrors.value[control.name]) fieldErrors.value[control.name] = undefined
}

async function showFieldErrors(issues: Record<string, string>) {
  if (Object.keys(issues).some(field => field !== 'consent')) {
    preview.value = undefined
    consent.value = false
  }

  fieldErrors.value = issues
  await nextTick()
  candidateForm.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
}

async function review() {
  error.value = ''
  fieldErrors.value = {}
  try {
    preview.value = parseCandidateSubmission({ ...form, consent: true }).profile
    await nextTick()
    stageHeading.value?.focus()
  } catch (failure) {
    if (failure instanceof CandidateValidationError) {
      await showFieldErrors(failure.issues)
    } else {
      error.value = 'Check the form and try again.'
    }
  }
}

async function edit() {
  preview.value = undefined
  consent.value = false
  error.value = ''
  fieldErrors.value = {}
  await nextTick()
  stageHeading.value?.focus()
}

async function submit() {
  if (busy.value || !preview.value || !consent.value) return
  busy.value = true
  error.value = ''
  fieldErrors.value = {}
  try {
    await $fetch('/api/public/candidates', { method: 'POST', body: { ...form, consent: consent.value } })
    Object.assign(form, { name: '', affiliation: '', stage: '', roles: [], research: '', availability: '', summary: '', cvUrl: '', email: '', website: '' })
    preview.value = undefined
    consent.value = false
    sent.value = true
    await nextTick()
    stageHeading.value?.focus()
  } catch (failure) {
    const issues = candidateFieldIssues(failure)
    if (issues) {
      await showFieldErrors(issues)
    } else {
      error.value = candidateError(failure, 'Your profile could not be submitted. Please try again.')
    }
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

      <form v-else-if="preview" ref="candidateForm" class="submission-review" @submit.prevent="submit" @input="clearFieldError" @change="clearFieldError">
        <h2 ref="stageHeading" tabindex="-1">Review your public listing</h2>
        <p>Anyone can see the details below once approved. Your verification email is visible to authorised INPA editors.</p>
        <div class="submission-preview"><CandidatesProfile :profile="preview" /></div>
        <label class="submission-check">
          <input v-model="consent" type="checkbox" v-bind="fieldAttributes('consent')" required>
          <span>I agree that INPA can publish this profile and CV link for 90 days after approval. I understand that viewers can save or share copies, and I can withdraw my listing through my private link.</span>
        </label>
        <p v-if="fieldErrors.consent" id="candidate-consent-error" class="submission-error">{{ fieldErrors.consent }}</p>
        <p class="submission-policy"><NuxtLink class="text-link" to="/privacy#academic-candidates">Academic Candidates privacy notice</NuxtLink></p>
        <p v-if="error" class="submission-error" role="alert">{{ error }}</p>
        <div class="submission-actions">
          <button class="button button--navy" type="submit" :disabled="busy">{{ busy ? 'Submitting…' : 'Submit for review' }}</button>
          <button class="button button--outline-navy" type="button" :disabled="busy" @click="edit">Edit details</button>
        </div>
      </form>

      <div v-else class="submission-grid">
        <form ref="candidateForm" class="submission-form" @submit.prevent="review" @input="clearFieldError" @change="clearFieldError">
          <h2 ref="stageHeading" tabindex="-1">Your profile</h2>
          <div class="submission-row">
            <div class="submission-field">
              <label for="candidate-name">Display name</label>
              <input id="candidate-name" v-model="form.name" type="text" autocomplete="name" :maxlength="candidateLimits.name" v-bind="fieldAttributes('name')" required>
              <p v-if="fieldErrors.name" id="candidate-name-error" class="submission-error">{{ fieldErrors.name }}</p>
            </div>
            <div class="submission-field">
              <label for="candidate-affiliation">Current affiliation (optional)</label>
              <input id="candidate-affiliation" v-model="form.affiliation" type="text" autocomplete="organization" :maxlength="candidateLimits.affiliation" v-bind="fieldAttributes('affiliation')">
              <p v-if="fieldErrors.affiliation" id="candidate-affiliation-error" class="submission-error">{{ fieldErrors.affiliation }}</p>
            </div>
          </div>
          <div class="submission-field">
            <label for="candidate-stage">Career stage</label>
            <select id="candidate-stage" v-model="form.stage" v-bind="fieldAttributes('stage')" required>
              <option value="" disabled>Select your stage</option>
              <option v-for="item in candidateStages" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
            <p v-if="fieldErrors.stage" id="candidate-stage-error" class="submission-error">{{ fieldErrors.stage }}</p>
          </div>
          <fieldset>
            <legend>Roles sought</legend>
            <label v-for="item in candidateRoles" :key="item.value" class="submission-check">
              <input v-model="form.roles" type="checkbox" :value="item.value" v-bind="fieldAttributes('roles')">
              {{ item.label }}
            </label>
            <p v-if="fieldErrors.roles" id="candidate-roles-error" class="submission-error">{{ fieldErrors.roles }}</p>
          </fieldset>
          <div class="submission-field">
            <label for="candidate-research">Research areas</label>
            <input id="candidate-research" v-model="form.research" type="text" :maxlength="candidateLimits.research" placeholder="e.g. nuclear reactions, gamma-ray spectroscopy" v-bind="fieldAttributes('research')" required>
            <p v-if="fieldErrors.research" id="candidate-research-error" class="submission-error">{{ fieldErrors.research }}</p>
          </div>
          <div class="submission-field">
            <label for="candidate-availability">Availability (optional)</label>
            <input id="candidate-availability" v-model="form.availability" type="text" :maxlength="candidateLimits.availability" placeholder="e.g. From July 2027" v-bind="fieldAttributes('availability')">
            <p v-if="fieldErrors.availability" id="candidate-availability-error" class="submission-error">{{ fieldErrors.availability }}</p>
          </div>
          <div class="submission-field">
            <label for="candidate-summary">Short research summary</label>
            <textarea id="candidate-summary" v-model="form.summary" :maxlength="candidateLimits.summary" rows="4" v-bind="fieldAttributes('summary', 'candidate-summary-hint')" required />
            <p id="candidate-summary-hint" class="submission-hint">Up to {{ candidateLimits.summary }} characters.</p>
            <p v-if="fieldErrors.summary" id="candidate-summary-error" class="submission-error">{{ fieldErrors.summary }}</p>
          </div>
          <div class="submission-field">
            <label for="candidate-cv">Public CV link</label>
            <input id="candidate-cv" v-model="form.cvUrl" type="url" :maxlength="candidateLimits.cvUrl" placeholder="https://…" v-bind="fieldAttributes('cvUrl', 'candidate-cv-privacy')" required>
            <p id="candidate-cv-privacy" class="submission-hint">Use a public CV with a professional way to contact you. Remove home addresses, personal phone numbers and referees’ private contact details.</p>
            <p v-if="fieldErrors.cvUrl" id="candidate-cvUrl-error" class="submission-error">{{ fieldErrors.cvUrl }}</p>
          </div>
          <div class="submission-field">
            <label for="candidate-email">Verification email</label>
            <input id="candidate-email" v-model="form.email" type="email" autocomplete="email" :maxlength="candidateLimits.email" v-bind="fieldAttributes('email', 'candidate-email-hint')" required>
            <p id="candidate-email-hint" class="submission-hint">INPA uses this address to verify and manage your listing.</p>
            <p v-if="fieldErrors.email" id="candidate-email-error" class="submission-error">{{ fieldErrors.email }}</p>
          </div>
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
.submission-field { display: grid; align-content: start; gap: 0.35rem; min-width: 0; }
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
.submission-form :is(input, select, textarea)[aria-invalid="true"] { border-color: #8a2225; }
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
.submission-error { color: #8a2225; margin: 0.3rem 0; }
.submission-trap { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
@media (min-width: 40rem) {
  .submission-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 58rem) {
  .submission-grid { grid-template-columns: minmax(0, 1fr) minmax(13rem, 0.46fr); }
}
</style>
