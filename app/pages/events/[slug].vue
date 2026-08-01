<script setup lang="ts">
interface EventDetail {
  slug: string
  title: string
  summary: string
  body: string
  status: string
  startAt: string
  timezone: string
}

const route = useRoute()
const { data: response } = await useFetch<{ data: EventDetail | null, meta: { source: string } }>(`/api/public/events/${route.params.slug}`)
const item = computed(() => response.value?.data ?? null)

useSeoMeta({
  title: () => item.value?.title ?? 'Event unavailable',
  description: () => item.value?.summary ?? 'This event is not currently available.',
  robots: () => item.value ? 'index, follow' : 'noindex, nofollow',
})
</script>

<template>
  <article>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">{{ item?.status ?? 'Event' }}</p>
        <h1>{{ item?.title ?? 'Event unavailable' }}</h1>
        <p>{{ item?.summary ?? 'No verified published record was found for this route.' }}</p>
      </div>
    </section>
    <section class="section">
      <div class="container container--reading prose">
        <template v-if="item">
          <p><strong>Timezone:</strong> {{ item.timezone }}</p>
          <p>{{ item.body }}</p>
        </template>
        <PlaceholderNotice v-else message="This may be an unpublished item, a missing record, or a local development session without a D1 binding." />
        <NuxtLink class="text-link" to="/events">Return to events <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </article>
</template>
