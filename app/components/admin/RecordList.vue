<script setup lang="ts">
import type { AdminCarouselRecord, AdminEventRecord, AdminNewsRecord } from '../../../shared/types/admin'

type RecordItem = AdminNewsRecord | AdminEventRecord | AdminCarouselRecord
defineProps<{ items: RecordItem[], kind: 'news' | 'events' | 'carousel' }>()
defineEmits<{ edit: [item: RecordItem], remove: [id: string, title: string] }>()
</script>

<template>
  <section class="editor-records" :aria-labelledby="`${kind}-records-title`">
    <h3 :id="`${kind}-records-title`">Existing {{ kind === 'carousel' ? 'carousel items' : kind }}</h3>
    <div class="editor-table-wrap">
      <table v-if="items.length" class="editor-table">
        <thead><tr><th scope="col">Title</th><th scope="col">State</th><th scope="col">Updated</th><th scope="col">Actions</th></tr></thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <th scope="row">{{ item.title }}</th>
            <td>{{ 'status' in item ? item.status : (item.isActive ? 'active' : 'inactive') }}</td>
            <td>{{ new Date(item.updatedAt).toLocaleString('en-IN') }}</td>
            <td><div class="editor-row-actions"><button type="button" @click="$emit('edit', item)">Edit</button><button type="button" class="danger-button" @click="$emit('remove', item.id, item.title)">Delete</button></div></td>
          </tr>
        </tbody>
      </table>
      <p v-else>No records yet.</p>
    </div>
  </section>
</template>
