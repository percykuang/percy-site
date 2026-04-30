<template>
  <Teleport to="body">
    <div
      v-if="markdownImageViewer.isOpen && markdownImageViewer.src"
      class="fixed inset-0 z-[70] bg-[rgba(15,23,42,0.72)] px-4 py-6 backdrop-blur-[2px] sm:px-6 sm:py-8"
      role="presentation"
      @click.self="closeViewer"
    >
      <div class="flex h-full w-full items-center justify-center">
        <div class="flex min-h-0 w-full items-center justify-center">
          <figure class="m-0 flex max-h-full w-full flex-col items-center">
            <img
              :src="markdownImageViewer.src"
              :alt="markdownImageViewer.alt"
              class="h-auto max-h-[calc(100vh-6.5rem)] w-[min(94vw,1600px)] cursor-zoom-out rounded-lg object-contain"
              @click="closeViewer"
            />
          </figure>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { closeMarkdownImageViewer, markdownImageViewer } = useMarkdownImageViewer()

let previousBodyOverflow = ''

watch(
  () => markdownImageViewer.value.isOpen,
  (isOpen) => {
    if (import.meta.server) {
      return
    }

    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return
    }

    document.body.style.overflow = previousBodyOverflow
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = previousBodyOverflow
})

function closeViewer() {
  closeMarkdownImageViewer()
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && markdownImageViewer.value.isOpen) {
    closeViewer()
  }
}
</script>
