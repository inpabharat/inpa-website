<script setup lang="ts">
import { candidateRoles, candidateStages } from '~~/shared/types/candidates'
import type { CandidateProfile } from '~~/shared/types/candidates'

defineProps<{ profile: CandidateProfile }>()
</script>

<template>
  <article class="candidate-profile">
    <div class="candidate-profile__body">
      <h3>{{ profile.name }}</h3>
      <p class="candidate-profile__stage">
        {{ candidateStages.find(stage => stage.value === profile.stage)?.label }}
        <template v-if="profile.affiliation"> · {{ profile.affiliation }}</template>
      </p>
      <p class="candidate-profile__research">{{ profile.research }}</p>
      <p class="candidate-profile__summary">{{ profile.summary }}</p>
    </div>
    <div class="candidate-profile__details">
      <dl>
        <div>
          <dt>Seeking</dt>
          <dd v-for="role in profile.roles" :key="role">{{ candidateRoles.find(item => item.value === role)?.label }}</dd>
        </div>
        <div v-if="profile.availability">
          <dt>Availability</dt>
          <dd>{{ profile.availability }}</dd>
        </div>
      </dl>
      <a
        :href="profile.cvUrl"
        class="text-link"
        target="_blank"
        rel="noopener noreferrer nofollow"
        :aria-label="`Open ${profile.name}’s CV in a new tab`"
      >View public CV <span aria-hidden="true">↗</span></a>
    </div>
  </article>
</template>

<style scoped>
.candidate-profile {
  display: grid;
  gap: 1.1rem clamp(1.25rem, 4vw, 3.5rem);
  padding-block: clamp(1.2rem, 3vw, 2rem);
  overflow-wrap: anywhere;
}

.candidate-profile h3 {
  font-size: clamp(1.35rem, 2.45vw, 1.9rem);
  margin-bottom: 0.3rem;
}

.candidate-profile__stage {
  color: var(--color-text-muted);
  font-size: 0.92rem;
  margin-bottom: 0.85rem;
}

.candidate-profile__research {
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-navy-900);
}

.candidate-profile__summary {
  margin: 0;
  max-width: 68ch;
}

.candidate-profile__details dl {
  margin: 0 0 0.75rem;
}

.candidate-profile__details dl div + div {
  margin-top: 0.6rem;
}

.candidate-profile__details dt {
  color: var(--color-navy-700);
  font-size: 0.83rem;
  font-weight: 750;
}

.candidate-profile__details dd {
  margin: 0;
  font-size: 0.94rem;
}

@media (min-width: 45rem) {
  .candidate-profile {
    grid-template-columns: minmax(0, 1fr) minmax(12rem, 0.43fr);
  }
}
</style>
