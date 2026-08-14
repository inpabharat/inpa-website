<script setup lang="ts">
import { primaryNavigation } from '~~/content/site/navigation'

const route = useRoute()
const mobileNavigation = ref<HTMLDetailsElement | null>(null)
const mobileNavigationSummary = ref<HTMLElement | null>(null)

function closeMobileNavigation(restoreFocus = false): void {
  const navigation = mobileNavigation.value
  if (!navigation?.open) return

  navigation.open = false
  if (restoreFocus) mobileNavigationSummary.value?.focus()
}

function handleOutsidePointer(event: PointerEvent): void {
  const navigation = mobileNavigation.value
  if (!navigation?.open || !(event.target instanceof Node)) return
  if (!navigation.contains(event.target)) closeMobileNavigation()
}

function handleMobileNavigationKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Escape') return
  event.preventDefault()
  closeMobileNavigation(true)
}

watch(() => route.fullPath, () => closeMobileNavigation())

onMounted(() => document.addEventListener('pointerdown', handleOutsidePointer))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutsidePointer))
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink class="wordmark" to="/" aria-label="Indian Nuclear Physics Association home">
        <img class="wordmark__logo" src="/images/inpa-logo.jpg" alt="" width="256" height="256">
        <span class="wordmark__text">Indian Nuclear Physics Association</span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <NuxtLink v-for="item in primaryNavigation" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <details ref="mobileNavigation" class="mobile-nav" @keydown="handleMobileNavigationKeydown">
        <summary ref="mobileNavigationSummary">Menu</summary>
        <nav aria-label="Mobile navigation">
          <NuxtLink v-for="item in primaryNavigation" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </nav>
      </details>
    </div>
  </header>
</template>
