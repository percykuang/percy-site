<template>
  <Teleport to="body">
    <div
      v-if="open && src"
      class="ps-image-lightbox"
      role="dialog"
      aria-modal="true"
      @click="close"
    >
      <div class="ps-image-lightbox__viewport">
        <div class="ps-image-lightbox__stage">
          <figure class="ps-image-lightbox__figure">
            <img :src="src" :alt="alt" class="ps-image-lightbox__image" @click.stop="close" />
          </figure>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

type Props = {
  alt?: string
  open: boolean
  src?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  src: '',
})

const emit = defineEmits<{
  close: []
}>()

let previousBodyOverflow: string | undefined

watch(
  () => props.open,
  (isOpen) => {
    if (typeof document === 'undefined') {
      return
    }

    if (isOpen) {
      previousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return
    }

    restoreBodyOverflow()
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
  restoreBodyOverflow()
})

function close() {
  emit('close')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    close()
  }
}

function restoreBodyOverflow() {
  if (previousBodyOverflow === undefined) {
    return
  }

  document.body.style.overflow = previousBodyOverflow
  previousBodyOverflow = undefined
}
</script>

<style scoped>
.ps-image-lightbox {
  position: fixed;
  inset: 0;
  z-index: 70;
  padding: 1.5rem 1rem;
  background: rgb(15 23 42 / 72%);
  backdrop-filter: blur(2px);
}

.ps-image-lightbox__viewport {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.ps-image-lightbox__stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  width: 100%;
}

.ps-image-lightbox__figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 100%;
  width: 100%;
  margin: 0;
}

.ps-image-lightbox__image {
  width: min(94vw, 1600px);
  height: auto;
  max-height: calc(100vh - 6.5rem);
  border-radius: 0.5rem;
  cursor: zoom-out;
  object-fit: contain;
}

@media (width >= 640px) {
  .ps-image-lightbox {
    padding: 2rem 1.5rem;
  }
}
</style>
