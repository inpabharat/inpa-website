<script setup lang="ts">
import type { AdminCarouselRecord, AdminEventRecord, AdminNewsRecord } from '../../../shared/types/admin'
import { getCarouselVisibility } from '~~/shared/utils/carousel-visibility'

type RecordItem = AdminNewsRecord | AdminEventRecord | AdminCarouselRecord
defineProps<{ items: RecordItem[], kind: 'news' | 'events' | 'carousel' }>()
defineEmits<{ edit: [item: RecordItem], remove: [id: string, title: string] }>()

function stateFor(item: RecordItem): { label: string, detail?: string } {
  if ('status' in item) return { label: item.status }
  const visibility = getCarouselVisibility(item)
  return { label: visibility.label, detail: visibility.detail }
}

function scheduleFor(item: RecordItem): string | null {
  if ('status' in item) return null
  const start = item.startsAt ? new Date(item.startsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'immediately'
  const end = item.endsAt ? new Date(item.endsAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'no end date'
  return `Schedule: ${start} to ${end} (your local time).`
}
</script>

<template>
  <section class="editor-records" :aria-labelledby="`${kind}-records-title`">
    <h3 :id="`${kind}-records-title`">Existing {{ kind === 'carousel' ? 'carousel items' : kind }}</h3>
    <div class="editor-table-wrap">
      <table v-if="items.length" class="editor-table">
        <thead><tr><th scope="col">Title</th><th scope="col">State</th><th scope="col">Added by</th><th scope="col">Updated</th><th scope="col">Actions</th></tr></thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <th scope="row">{{ item.title }}</th>
            <td><strong>{{ stateFor(item).label }}</strong><small v-if="stateFor(item).detail" class="editor-state-detail">{{ stateFor(item).detail }}</small><small v-if="scheduleFor(item)" class="editor-state-detail">{{ scheduleFor(item) }}</small></td>
            <td>{{ item.createdBy }}</td>
            <td><span :title="`Last updated by ${item.updatedBy}`">{{ new Date(item.updatedAt).toLocaleString('en-IN') }}</span></td>
            <td><div class="editor-row-actions"><button type="button" @click="$emit('edit', item)">Edit</button><button type="button" class="danger-button" @click="$emit('remove', item.id, item.title)">Delete</button></div></td>
          </tr>
        </tbody>
      </table>
      <p v-else>No records yet.</p>
    </div>
  </section>
</template>
