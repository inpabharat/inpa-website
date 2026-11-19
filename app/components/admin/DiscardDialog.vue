<script setup lang="ts">
const dialog = ref<HTMLDialogElement | null>(null)
const id = useId()
let resolveChoice: ((discard: boolean) => void) | undefined

function confirm(): Promise<boolean> {
  const element = dialog.value
  if (!element || element.open || resolveChoice) return Promise.resolve(false)

  element.showModal()
  return new Promise(resolve => { resolveChoice = resolve })
}

function settle(discard: boolean): void {
  const resolve = resolveChoice
  resolveChoice = undefined
  resolve?.(discard)
}

function onClose(): void {
  const element = dialog.value
  const discard = element?.returnValue === 'discard'
  if (element) element.returnValue = ''
  settle(discard)
}

onBeforeUnmount(() => settle(false))
defineExpose({ confirm })
</script>

<template>
  <dialog
    ref="dialog"
    class="discard-dialog"
    :aria-labelledby="`${id}-title`"
    :aria-describedby="`${id}-description`"
    @close="onClose"
  >
    <form method="dialog">
      <h2 :id="`${id}-title`">Discard unsaved changes?</h2>
      <p :id="`${id}-description`">Edits since your last save will be lost.</p>
      <div class="discard-dialog__actions">
        <button class="button button--navy" type="submit" value="keep" autofocus>Keep editing</button>
        <button class="button button--outline-navy danger-button" type="submit" value="discard">Discard changes</button>
      </div>
    </form>
  </dialog>
</template>

<style scoped>
.discard-dialog {
  position: fixed;
  inset: 0;
  inline-size: min(calc(100% - 2rem), 29rem);
  max-block-size: calc(100% - 2rem);
  margin: auto;
  padding: clamp(1.25rem, 5vw, 2rem);
  overflow: auto;
  border: 1px solid var(--color-border);
  border-block-start: 4px solid var(--color-gold-500);
  background: var(--color-surface);
  color: var(--color-text);
  box-shadow: 0 1rem 3rem rgb(6 26 44 / 18%);
  overscroll-behavior: contain;
}

.discard-dialog::backdrop {
  overflow: hidden;
  background: rgb(6 26 44 / 58%);
  overscroll-behavior: contain;
}

.discard-dialog h2 { margin: 0; font-size: clamp(1.45rem, 4vw, 1.85rem); }
.discard-dialog p { margin: .7rem 0 1.4rem; color: var(--color-text-muted); }
.discard-dialog__actions { display: flex; flex-wrap: wrap; gap: .65rem; }
.discard-dialog__actions .button { min-block-size: 2.75rem; padding: .65rem .85rem; }
</style>
