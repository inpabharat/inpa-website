<script setup lang="ts">
import { candidateRoles } from '~~/shared/types/candidates'
import type { CandidateDirectory } from '~~/shared/types/candidates'
import { candidateRoleFilter } from '~~/shared/utils/candidate-validation'

const route = useRoute()
const query = computed(() => ({
  q: typeof route.query.q === 'string' ? route.query.q.slice(0, 100) : undefined,
  role: candidateRoleFilter(route.query.role),
  page: typeof route.query.page === 'string' ? Math.min(1000, Math.max(1, Number(route.query.page) || 1)) : 1,
}))
const search = ref(query.value.q ?? '')
const role = ref<string>(query.value.role ?? '')
const { data: directory, status, error, refresh } = await useFetch<CandidateDirectory>('/api/public/candidates', { query })
const filtered = computed(() => Boolean(query.value.q || query.value.role))

watch(query, value => {
  search.value = value.q ?? ''
  role.value = value.role ?? ''
})

async function filter() {
  await navigateTo({
    path: '/jobs',
    query: { q: search.value.trim() || undefined, role: role.value || undefined },
    hash: '#candidates',
  })
}

function pageLink(page: number) {
  return { path: '/jobs', query: { ...query.value, page: page > 1 ? String(page) : undefined }, hash: '#candidates' }
}

useSeoMeta({
  title: 'Academic Candidates',
  description: 'Find nuclear science researchers seeking postdoctoral, faculty and research positions.',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<template>
  <div>
    <section class="candidate-intro" aria-labelledby="academic-candidates-title">
      <div class="container candidate-intro__inner">
        <div>
          <h1 id="academic-candidates-title">Academic Candidates</h1>
          <p>Find nuclear science researchers seeking postdoctoral, faculty and research roles.</p>
        </div>
        <div class="candidate-intro__actions">
          <NuxtLink class="button button--gold" to="/jobs/submit">List your profile</NuxtLink>
          <NuxtLink class="text-link text-link--light" to="/jobs/manage">Manage your listing</NuxtLink>
        </div>
      </div>
    </section>

    <section class="section candidate-directory" aria-labelledby="candidates">
      <div class="container">
        <h2 id="candidates">Browse candidates</h2>
        <form class="candidate-search" aria-label="Find candidates" @submit.prevent="filter">
          <label>Research area, name or institution
            <input v-model="search" type="search" maxlength="100" placeholder="e.g. nuclear structure">
          </label>
          <label>Role sought
            <select v-model="role">
              <option value="">Any role</option>
              <option v-for="item in candidateRoles" :key="item.value" :value="item.value">{{ item.label }}</option>
            </select>
          </label>
          <button class="button button--navy" type="submit">Search</button>
        </form>

        <p v-if="status === 'pending'" class="candidate-state" role="status">Loading candidates…</p>
        <div v-else-if="error" class="candidate-state" role="alert">
          <p>{{ error.statusMessage || 'The directory is temporarily unavailable.' }}</p>
          <button class="button button--outline-navy" type="button" @click="refresh()">Try again</button>
        </div>
        <template v-else-if="directory?.profiles.length">
          <p class="candidate-directory__hint">Open a candidate’s CV for more details and their preferred contact information.</p>
          <ul class="candidate-results" role="list">
            <li v-for="(profile, index) in directory.profiles" :key="`${profile.name}:${index}`">
              <CandidatesProfile :profile="profile" />
            </li>
          </ul>
        </template>
        <div v-else class="candidate-state" role="status">
          <strong>{{ filtered ? 'No candidates match these filters.' : 'No profiles are listed yet.' }}</strong>
          <p v-if="!filtered">Researchers seeking an academic role can submit a profile for review.</p>
          <NuxtLink v-else class="text-link" to="/jobs#candidates">Clear filters</NuxtLink>
        </div>
        <nav v-if="query.page > 1 || directory?.hasNext" class="candidate-pagination" aria-label="Candidate pages">
          <NuxtLink v-if="query.page > 1" :to="pageLink(query.page - 1)" class="button button--outline-navy">Previous</NuxtLink>
          <span>Page {{ query.page }}</span>
          <NuxtLink v-if="directory?.hasNext && query.page < 1000" :to="pageLink(query.page + 1)" class="button button--outline-navy">Next</NuxtLink>
        </nav>
      </div>
    </section>
  </div>
</template>

<style scoped>
.candidate-intro {
  background: var(--color-navy-950);
  color: var(--color-sky-200);
  padding-block: clamp(2.75rem, 7vw, 5.75rem);
}

.candidate-intro__inner {
  display: grid;
  align-items: end;
  gap: 1.5rem clamp(2rem, 6vw, 6rem);
}

.candidate-intro h1 {
  color: white;
  font-size: clamp(2.35rem, 6vw, 4.9rem);
  margin-bottom: 0.65rem;
}

.candidate-intro p {
  max-width: 50ch;
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.25rem);
}

.candidate-intro__actions {
  display: flex;
  align-items: start;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
}

.candidate-intro__actions .text-link {
  align-self: center;
}

.candidate-directory {
  padding-top: clamp(2rem, 5vw, 4rem);
}

.candidate-directory h2 {
  font-size: clamp(1.75rem, 4vw, 2.7rem);
  margin-bottom: 1.2rem;
}

.candidate-search {
  display: grid;
  gap: 0.85rem;
  align-items: end;
  padding: clamp(1rem, 2.5vw, 1.5rem);
  background: var(--color-surface-subtle);
  border-top: 2px solid var(--color-gold-500);
}

.candidate-search label {
  display: grid;
  min-width: 0;
  gap: 0.35rem;
  font-size: 0.9rem;
  font-weight: 700;
}

.candidate-search input,
.candidate-search select {
  width: 100%;
  min-height: 2.85rem;
  padding: 0.55rem 0.65rem;
  font: inherit;
  font-weight: 400;
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
}

.candidate-state {
  margin: 1.5rem 0 0;
  padding-block: 1.35rem;
  border-block: 1px solid var(--color-border);
}

.candidate-state p {
  margin: 0.35rem 0 0.75rem;
  color: var(--color-text-muted);
}

.candidate-directory__hint {
  margin: 1.5rem 0 0.5rem;
  color: var(--color-text-muted);
}

.candidate-results {
  list-style: none;
  margin: 0;
  padding: 0;
  border-bottom: 1px solid var(--color-border);
}

.candidate-results li {
  border-top: 1px solid var(--color-border);
}

.candidate-pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.25rem;
}

@media (min-width: 45rem) {
  .candidate-intro__inner { grid-template-columns: minmax(0, 1fr) auto; }
  .candidate-search { grid-template-columns: minmax(0, 1fr) minmax(0, 0.65fr) auto; }
}
</style>
