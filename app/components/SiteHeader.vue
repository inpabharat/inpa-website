<script setup lang="ts">
import type { NavigationGroup } from '~~/content/site/navigation'
import { navigationGroups, utilityNavigation } from '~~/content/site/navigation'

const route = useRoute()
const siteHeader = ref<HTMLElement | null>(null)
const mobileNavigation = ref<HTMLDialogElement | HTMLDetailsElement | null>(null)
const mobileNavigationTrigger = ref<HTMLButtonElement | null>(null)
const mobileDialogReady = ref(false)
const mobileMenuVisible = ref(false)
const mobileHeaderHeight = ref<number>()
const activeDesktopMenu = ref<string | null>(null)
const mobileGroupAnimations = new WeakMap<HTMLDetailsElement, { animation: Animation, open: boolean }>()
let desktopBreakpoint: MediaQueryList | undefined
let headerObserver: ResizeObserver | undefined
let nativeDisclosureMotion = false

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

function openMobileNavigation(): void {
  const navigation = mobileNavigation.value
  if (!(navigation instanceof HTMLDialogElement) || navigation.open || desktopBreakpoint?.matches) return

  mobileNavigationTrigger.value?.focus({ preventScroll: true })
  mobileMenuVisible.value = true
  navigation.showModal()
}

function toggleMobileGroup(event: MouseEvent): void {
  if (nativeDisclosureMotion) return

  const summary = event.currentTarget as HTMLElement
  const group = summary.parentElement
  const body = summary.nextElementSibling
  if (!(group instanceof HTMLDetailsElement) || !(body instanceof HTMLElement) || typeof body.animate !== 'function') return

  const pending = mobileGroupAnimations.get(group)
  const open = !(pending?.open ?? group.open)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion && !pending) return

  event.preventDefault()
  const startHeight = group.open ? body.getBoundingClientRect().height : 0
  pending?.animation.cancel()

  const finish = () => {
    group.open = open
    body.inert = false
    group.removeAttribute('data-collapsing')
    mobileGroupAnimations.delete(group)
  }

  if (reduceMotion) {
    finish()
    return
  }

  if (open) group.open = true
  if (!open && body.contains(document.activeElement)) summary.focus({ preventScroll: true })
  body.inert = !open
  group.toggleAttribute('data-collapsing', !open)
  const endHeight = open ? body.getBoundingClientRect().height : 0
  const animation = body.animate(
    [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
    { duration: 220, easing: 'cubic-bezier(.2, .7, .2, 1)', fill: 'both' },
  )

  mobileGroupAnimations.set(group, { animation, open })
  animation.onfinish = () => {
    if (mobileGroupAnimations.get(group)?.animation !== animation) return
    finish()
    animation.cancel()
  }
}

function dismissMobileNavigation(): void {
  mobileMenuVisible.value = false
}

function closeMobileNavigation(): void {
  dismissMobileNavigation()
  const navigation = mobileNavigation.value
  if (!navigation?.open) return

  if (navigation instanceof HTMLDetailsElement) navigation.open = false
  else navigation.close()
}

function finishMobileDismissal(): void {
  if (!mobileMenuVisible.value) closeMobileNavigation()
}

function closeMobileNavigationOnDesktop(event: MediaQueryListEvent): void {
  if (!event.matches || !mobileNavigation.value?.open) return

  closeMobileNavigation()
  siteHeader.value?.querySelector<HTMLAnchorElement>('.wordmark')?.focus({ preventScroll: true })
}

function handleOutsidePointer(event: PointerEvent): void {
  if (!(event.target instanceof Node)) return

  if (activeDesktopMenu.value && !siteHeader.value?.contains(event.target)) {
    closeDesktopNavigation()
  }
}

watch(() => route.fullPath, () => {
  closeMobileNavigation()
  closeDesktopNavigation()
})

onMounted(() => {
  const wasOpen = mobileNavigation.value?.open
  nativeDisclosureMotion = CSS.supports('selector(::details-content)')
    && CSS.supports('interpolate-size: allow-keywords')
    && CSS.supports('transition-behavior: allow-discrete')
  mobileDialogReady.value = typeof HTMLDialogElement !== 'undefined'
    && typeof HTMLDialogElement.prototype.showModal === 'function'
  const header = siteHeader.value
  if (header && mobileDialogReady.value) {
    mobileHeaderHeight.value = header.offsetHeight
    headerObserver = new ResizeObserver(() => { mobileHeaderHeight.value = header.offsetHeight })
    headerObserver.observe(header)
  }
  desktopBreakpoint = window.matchMedia('(min-width: 72rem)')
  desktopBreakpoint.addEventListener('change', closeMobileNavigationOnDesktop)
  document.addEventListener('pointerdown', handleOutsidePointer)

  if (wasOpen && mobileDialogReady.value && !desktopBreakpoint.matches) {
    nextTick(openMobileNavigation)
  }
})

onBeforeUnmount(() => {
  headerObserver?.disconnect()
  desktopBreakpoint?.removeEventListener('change', closeMobileNavigationOnDesktop)
  document.removeEventListener('pointerdown', handleOutsidePointer)
})
</script>

<template>
  <header ref="siteHeader" class="site-header">
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
            {{ group.label }}
            <span class="navigation-chevron" aria-hidden="true" />
          </button>
          <Transition name="navigation-panel">
          <div
            v-show="activeDesktopMenu === group.id"
            :id="desktopPanelId(group.id)"
            :inert="activeDesktopMenu !== group.id"
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
                  <small>{{ link.description }}</small>
                </span>
                <em v-if="link.status">{{ link.status }}</em>
                <span v-else aria-hidden="true">→</span>
              </NuxtLink>
            </div>
          </div>
          </Transition>
        </div>
        <NuxtLink class="desktop-nav__membership" to="/membership">Join INPA</NuxtLink>
      </nav>

      <div class="mobile-nav">
        <button
          v-if="mobileDialogReady"
          ref="mobileNavigationTrigger"
          type="button"
          class="mobile-nav__trigger"
          aria-haspopup="dialog"
          aria-controls="mobile-navigation"
          @click="openMobileNavigation"
        >Menu</button>
        <component
          :is="mobileDialogReady ? 'dialog' : 'details'"
          id="mobile-navigation"
          ref="mobileNavigation"
          :class="mobileDialogReady ? 'mobile-nav__dialog' : 'mobile-nav__disclosure'"
          :aria-label="mobileDialogReady ? 'Site menu' : undefined"
          :style="mobileHeaderHeight ? { '--mobile-nav-offset': `${mobileHeaderHeight}px` } : undefined"
          @cancel.prevent="dismissMobileNavigation"
        >
          <summary v-if="!mobileDialogReady" class="mobile-nav__trigger">Menu</summary>
          <div v-else class="container mobile-nav__bar">
            <button
              type="button"
              class="mobile-nav__close"
              aria-label="Close menu"
              autofocus
              @click="dismissMobileNavigation"
            >Close</button>
          </div>
          <Transition name="mobile-menu" @after-leave="finishMobileDismissal">
            <div v-show="!mobileDialogReady || mobileMenuVisible" class="mobile-nav__surface">
              <div v-if="mobileDialogReady" class="mobile-nav__scrim" aria-hidden="true" @click="dismissMobileNavigation" />
              <div class="mobile-nav__panel">
                <nav aria-label="Primary navigation">
                  <NuxtLink class="mobile-nav__home" to="/">Home</NuxtLink>
                  <details v-for="group in navigationGroups" :key="group.id" class="mobile-nav__group">
                    <summary :class="{ 'mobile-nav__group--active': groupIsActive(group) }" @click="toggleMobileGroup">
                      {{ group.label }}
                      <span class="navigation-chevron" aria-hidden="true" />
                    </summary>
                    <div class="mobile-nav__group-body">
                      <div class="mobile-nav__group-links">
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
                    </div>
                  </details>
                </nav>
                <NuxtLink class="button button--gold mobile-nav__membership" to="/membership">Join INPA</NuxtLink>
                <nav class="mobile-nav__utility" aria-label="Utility navigation">
                  <NuxtLink v-for="link in utilityNavigation" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
                </nav>
              </div>
            </div>
          </Transition>
        </component>
      </div>
    </div>
  </header>
</template>
