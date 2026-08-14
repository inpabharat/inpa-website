<script setup lang="ts">
import type { NavigationGroup } from '~~/content/site/navigation'
import { navigationGroups, utilityNavigation } from '~~/content/site/navigation'

const route = useRoute()
const siteHeader = ref<HTMLElement | null>(null)
const mobileNavigation = ref<HTMLDetailsElement | null>(null)
const mobileNavigationSummary = ref<HTMLElement | null>(null)
const activeDesktopMenu = ref<string | null>(null)

function groupIsActive(group: NavigationGroup): boolean {
  return group.links.some(link => route.path === link.to || route.path.startsWith(`${link.to}/`))
}

function linkIsCurrent(path: string): boolean {
  return route.path === path
}

function desktopPanelId(groupId: string): string {
  return `desktop-menu-${groupId}`
}

function closeDesktopNavigation(restoreFocus = false): void {
  const openMenu = activeDesktopMenu.value
  activeDesktopMenu.value = null

  if (restoreFocus && openMenu) {
    nextTick(() => siteHeader.value?.querySelector<HTMLButtonElement>(`[data-menu-trigger="${openMenu}"]`)?.focus())
  }
}

function toggleDesktopMenu(groupId: string): void {
  activeDesktopMenu.value = activeDesktopMenu.value === groupId ? null : groupId
}

function openDesktopMenu(groupId: string, focusFirstLink = false): void {
  activeDesktopMenu.value = groupId

  if (focusFirstLink) {
    nextTick(() => siteHeader.value?.querySelector<HTMLAnchorElement>(`#${desktopPanelId(groupId)} a`)?.focus())
  }
}

function handleDesktopTriggerKeydown(event: KeyboardEvent, groupId: string): void {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    openDesktopMenu(groupId, true)
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeDesktopNavigation(true)
  }
}

function handleDesktopPanelKeydown(event: KeyboardEvent, groupId: string): void {
  if (event.key === 'Escape') {
    event.preventDefault()
    closeDesktopNavigation(true)
    return
  }

  if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return

  const links = Array.from(siteHeader.value?.querySelectorAll<HTMLAnchorElement>(`#${desktopPanelId(groupId)} a`) ?? [])
  const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement)
  if (!links.length || currentIndex < 0) return

  event.preventDefault()
  if (event.key === 'Home') links[0]?.focus()
  else if (event.key === 'End') links.at(-1)?.focus()
  else {
    const offset = event.key === 'ArrowDown' ? 1 : -1
    links[(currentIndex + offset + links.length) % links.length]?.focus()
  }
}

function closeMobileNavigation(restoreFocus = false): void {
  const navigation = mobileNavigation.value
  if (!navigation?.open) return

  navigation.open = false
  if (restoreFocus) mobileNavigationSummary.value?.focus()
}

function handleOutsidePointer(event: PointerEvent): void {
  if (!(event.target instanceof Node)) return

  if (mobileNavigation.value?.open && !mobileNavigation.value.contains(event.target)) {
    closeMobileNavigation()
  }

  if (activeDesktopMenu.value && !siteHeader.value?.contains(event.target)) {
    closeDesktopNavigation()
  }
}

function handleHeaderKeydown(event: KeyboardEvent): void {
  const navigation = mobileNavigation.value
  if (event.key === 'Escape' && navigation?.open) {
    event.preventDefault()
    closeMobileNavigation(true)
    return
  }

  if (event.key !== 'Tab' || !navigation?.open) return

  const focusableElements = Array.from(
    navigation.querySelectorAll<HTMLElement>('summary, a[href], button:not([disabled])'),
  ).filter(element => element.offsetParent !== null && element.getAttribute('tabindex') !== '-1')
  const firstElement = focusableElements[0]
  const lastElement = focusableElements.at(-1)

  if (!firstElement || !lastElement) return
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement.focus()
  }
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement.focus()
  }
}

watch(() => route.fullPath, () => {
  closeMobileNavigation()
  closeDesktopNavigation()
})

onMounted(() => document.addEventListener('pointerdown', handleOutsidePointer))
onBeforeUnmount(() => document.removeEventListener('pointerdown', handleOutsidePointer))
</script>

<template>
  <header ref="siteHeader" class="site-header" @keydown="handleHeaderKeydown">
    <div class="container site-header__inner">
      <NuxtLink class="wordmark" to="/" aria-label="Indian Nuclear Physics Association home">
        <img class="wordmark__logo" src="/images/inpa-logo.jpg" alt="" width="256" height="256">
        <span class="wordmark__text">Indian Nuclear Physics Association</span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <div v-for="group in navigationGroups" :key="group.id" class="desktop-nav__group">
          <button
            type="button"
            class="desktop-nav__trigger"
            :class="{ 'desktop-nav__trigger--active': groupIsActive(group) }"
            :data-menu-trigger="group.id"
            :aria-expanded="activeDesktopMenu === group.id"
            :aria-controls="desktopPanelId(group.id)"
            @click="toggleDesktopMenu(group.id)"
            @keydown="handleDesktopTriggerKeydown($event, group.id)"
          >
            {{ group.label }} <span aria-hidden="true">⌄</span>
          </button>
          <div
            v-show="activeDesktopMenu === group.id"
            :id="desktopPanelId(group.id)"
            class="desktop-nav__panel"
            @keydown="handleDesktopPanelKeydown($event, group.id)"
          >
            <div class="desktop-nav__introduction">
              <p class="eyebrow">Explore {{ group.label }}</p>
              <p>{{ group.description }}</p>
            </div>
            <div class="desktop-nav__links">
              <NuxtLink
                v-for="link in group.links"
                :key="link.to"
                :to="link.to"
                :aria-current="linkIsCurrent(link.to) ? 'page' : undefined"
              >
                <span>
                  <strong>{{ link.label }}</strong>
                  <small v-if="link.description">{{ link.description }}</small>
                </span>
                <em v-if="link.status">{{ link.status }}</em>
                <span v-else aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <NuxtLink class="desktop-nav__membership" to="/membership">Join INPA</NuxtLink>
      </nav>

      <details ref="mobileNavigation" class="mobile-nav">
        <summary ref="mobileNavigationSummary">Menu</summary>
        <button
          type="button"
          class="mobile-nav__backdrop"
          tabindex="-1"
          aria-label="Close navigation"
          @click="closeMobileNavigation()"
        />
        <div class="mobile-nav__panel">
          <nav aria-label="Mobile navigation">
            <NuxtLink class="mobile-nav__home" to="/">Home</NuxtLink>
            <details v-for="group in navigationGroups" :key="group.id" class="mobile-nav__group">
              <summary :class="{ 'mobile-nav__group--active': groupIsActive(group) }">
                {{ group.label }} <span aria-hidden="true">+</span>
              </summary>
              <div>
                <NuxtLink
                  v-for="link in group.links"
                  :key="link.to"
                  :to="link.to"
                  :aria-current="linkIsCurrent(link.to) ? 'page' : undefined"
                >
                  <span>{{ link.label }}</span>
                  <small v-if="link.status">{{ link.status }}</small>
                </NuxtLink>
              </div>
            </details>
          </nav>
          <NuxtLink class="button button--gold mobile-nav__membership" to="/membership">Join INPA</NuxtLink>
          <nav class="mobile-nav__utility" aria-label="Utility navigation">
            <NuxtLink v-for="link in utilityNavigation" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
          </nav>
        </div>
      </details>
    </div>
  </header>
</template>
