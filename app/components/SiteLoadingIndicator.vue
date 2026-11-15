<script setup lang="ts">
const { isLoading, progress } = useLoadingIndicator({
  throttle: 140,
  duration: 850,
  hideDelay: 160,
  resetDelay: 150,
})
</script>

<template>
  <div class="site-loading" :class="{ 'site-loading--visible': isLoading }" aria-hidden="true">
    <div class="site-loading__bar" :style="{ transform: `scaleX(${progress / 100})` }" />
  </div>
  <span class="site-loading__status" role="status">
    {{ isLoading && progress < 100 ? 'Loading page…' : '' }}
  </span>
</template>

<style scoped>
.site-loading {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1100;
  block-size: 3px;
  background: var(--color-navy-950);
  opacity: 0;
  pointer-events: none;
  transition: opacity 140ms ease-out;
}

.site-loading--visible {
  opacity: 1;
}

.site-loading__bar {
  block-size: 100%;
  background: linear-gradient(to right, var(--color-gold-500), var(--color-gold-300));
  transform-origin: left;
  transition: transform 100ms ease-out;
}

.site-loading__status {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .site-loading,
  .site-loading__bar {
    transition: none;
  }

  .site-loading__bar {
    transform: none !important;
  }
}

@media (forced-colors: active) {
  .site-loading {
    forced-color-adjust: none;
    background: Canvas;
  }

  .site-loading__bar {
    background: Highlight;
  }
}
</style>
