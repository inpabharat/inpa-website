<script setup lang="ts">
import type { AdminApiResponse, AdminContentSnapshot } from '../../../shared/types/admin'

definePageMeta({ layout: 'default' })

const { data: session } = await useFetch<{ data: { email: string, source: string } }>('/api/admin/session')
const { data: content, error, refresh } = await useFetch<AdminApiResponse<AdminContentSnapshot>>('/api/admin/content')

useSeoMeta({ title: 'INPA editor', robots: 'noindex, nofollow, noarchive' })
</script>

<template>
  <div>
    <section class="page-hero admin-hero">
      <div class="container">
        <p class="eyebrow eyebrow--light">Protected content management</p>
        <h1>INPA editor</h1>
        <p v-if="session">Signed in as {{ session.data.email }}.</p>
      </div>
    </section>
    <section class="section admin-shell">
      <div class="container">
        <div v-if="error" class="admin-alert admin-alert--error" role="alert">
          <h2>Content database unavailable</h2>
          <p>Use the local Worker development mode with D1, or verify the remote D1 binding.</p>
        </div>
        <AdminEditorDashboard
          v-else-if="content && session"
          :initial-snapshot="content.data"
          :editor-email="session.data.email"
          @refresh="refresh"
        />
      </div>
    </section>
  </div>
</template>
