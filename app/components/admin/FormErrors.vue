<script setup lang="ts">
defineProps<{
  id: string
  entries: { id: string, fieldId?: string, message: string }[]
}>()

function focusField(id: string): void {
  const field = document.getElementById(id)
  if (!field) return
  revealAdminField(field)
  field.focus()
}
</script>

<template>
  <div v-if="entries.length" :id="id" class="admin-alert admin-alert--error" tabindex="-1" role="group" aria-label="Could not save. Check the following messages.">
    <h3>Could not save</h3>
    <ul>
      <li v-for="entry in entries" :id="entry.id" :key="entry.id">
        <a v-if="entry.fieldId" :href="`#${entry.fieldId}`" @click.prevent="focusField(entry.fieldId)">{{ entry.message }}</a>
        <template v-else>{{ entry.message }}</template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h3 { margin: 0; font-size: 1rem; }
ul { margin-block: .5rem 0; }
</style>
