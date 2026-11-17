<script setup lang="ts">
import { publicContact } from '~~/content/site/bulletin-sources'
import type { CandidateState } from '~~/shared/types/candidates'

const state = ref<CandidateState | null>(null)
const token = ref('')
const busy = ref(false)
const removed = ref(false)
const error = ref('')
const feedback = ref('')
const loading = ref(true)

async function perform(action: 'view' | 'verify' | 'renew' | 'withdraw') {
  if (busy.value || !token.value) return
  busy.value = true
  error.value = ''
  feedback.value = ''
  try {
    const response = await $fetch<CandidateState | { removed: true }>('/api/public/candidates/manage', {
      method: 'POST', body: { token: token.value, action },
    })
    if ('removed' in response) {
      removed.value = true
      token.value = ''
      state.value = null
    } else {
      state.value = response
      if (action === 'verify') feedback.value = 'Email verified. An INPA editor can now review your listing.'
      if (action === 'renew' && response.renewalRequested) feedback.value = 'Renewal requested. An INPA editor will review it.'
    }
  } catch (failure) {
    error.value = candidateError(failure, 'The listing could not be updated. Please try again.')
  } finally {
    busy.value = false
  }
}

onMounted(async () => {
  const fragment = window.location.hash.slice(1)
  if (/^[a-f0-9]{64}$/.test(fragment)) {
    token.value = fragment
    window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search)
    await perform('view')
  }
  loading.value = false
})

useSeoMeta({ title: 'Manage your academic listing', robots: 'noindex, nofollow, noarchive' })
</script>

<template>
  <section class="section">
    <div class="container candidate-manage">
      <NuxtLink class="text-link" to="/jobs">← Academic Candidates</NuxtLink>
      <h1>Manage your listing</h1>

      <p v-if="loading" role="status">Checking your private link…</p>
      <div v-else-if="removed" class="manage-note" role="status">
        <strong>Listing withdrawn</strong>
        <p>INPA has removed the submission from the directory. Previously saved copies may still exist.</p>
      </div>
      <template v-else-if="state">
        <div class="manage-note">
          <h2 v-if="state.status === 'unverified'">Verify your email</h2>
          <h2 v-else-if="state.status === 'review'">Awaiting editorial review</h2>
          <h2 v-else-if="state.status === 'published'">Your listing is published</h2>
          <h2 v-else>Your listing has expired</h2>
          <p v-if="state.status === 'unverified'">Check these details before verifying. Verify only if you submitted this profile.</p>
          <p v-else-if="state.status === 'published' && state.expiresAt">Visible until {{ formatIndiaDate(state.expiresAt) }}.</p>
          <p v-if="state.renewalRequested">Your renewal request is awaiting editorial review.</p>
          <p v-if="feedback" role="status">{{ feedback }}</p>
        </div>
        <div class="manage-preview"><CandidatesProfile :profile="state.profile" /></div>
        <p v-if="error" role="alert">{{ error }}</p>
        <div class="manage-actions">
          <button v-if="state.status === 'unverified'" class="button button--navy" type="button" :disabled="busy" @click="perform('verify')">Verify my email</button>
          <button v-if="state.canRequestRenewal" class="button button--navy" type="button" :disabled="busy" @click="perform('renew')">Request another 90 days</button>
          <details class="manage-withdraw">
            <summary>Withdraw listing</summary>
            <p>This removes your profile and submission from the INPA directory.</p>
            <button class="button button--outline-navy" type="button" :disabled="busy" @click="perform('withdraw')">Confirm withdrawal</button>
          </details>
        </div>
      </template>
      <div v-else class="manage-note">
        <p v-if="error" role="alert">{{ error }}</p>
        <p>Open the private link sent to your verification email to view, renew or withdraw your listing.</p>
        <button v-if="error && token" class="button button--outline-navy" type="button" :disabled="busy" @click="perform('view')">Try again</button>
      </div>

      <p v-if="!removed" class="manage-contact">For a replacement link or a correction, <a class="text-link" :href="`mailto:${publicContact.email}?subject=Academic%20Candidates`">email INPA</a> from your verification address.</p>
    </div>
  </section>
</template>

<style scoped>
.candidate-manage { max-width: 56rem; }
.candidate-manage h1 { font-size: clamp(2.2rem, 5vw, 4.1rem); margin: 0.85rem 0 1.2rem; }
.manage-note { padding: clamp(1rem, 3vw, 1.6rem); border-top: 2px solid var(--color-gold-500); background: var(--color-surface-subtle); }
.manage-note h2 { font-size: clamp(1.4rem, 3.5vw, 2rem); margin-bottom: 0.5rem; }
.manage-note p { margin: 0.25rem 0; max-width: 65ch; }
.manage-note button { margin-top: 0.75rem; }
.manage-preview { border-bottom: 1px solid var(--color-border); margin-bottom: 1.5rem; }
.manage-actions { display: grid; justify-items: start; gap: 0.85rem; }
.manage-withdraw summary { font-weight: 700; cursor: pointer; padding-block: 0.35rem; }
.manage-withdraw p { margin: 0.4rem 0 0.7rem; }
.manage-contact { margin-top: 1.5rem; max-width: 65ch; color: var(--color-text-muted); }
</style>
