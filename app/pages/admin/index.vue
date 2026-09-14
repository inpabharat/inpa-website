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
        <div class="admin-hero__header">
          <div>
            <p class="eyebrow eyebrow--light">Website editor</p>
            <h1>Manage the INPA website</h1>
            <p v-if="session">Signed in as {{ session.data.email }}.</p>
          </div>
          <a class="button button--outline-light" href="/cdn-cgi/access/logout">Sign out</a>
        </div>
      </div>
    </section>
    <section class="section admin-shell">
      <div class="container">
        <div v-if="error" class="admin-alert admin-alert--error" role="alert">
          <h2>We could not load your content</h2>
          <p>Please try again. If the problem continues, contact the website administrator.</p>
          <button class="button button--navy" type="button" @click="refresh()">Try again</button>
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
