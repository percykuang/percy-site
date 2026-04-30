<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-2 opacity-0"
  >
    <button
      v-if="visible"
      type="button"
      class="border-soft-border bg-background/92 text-muted-foreground hover:bg-primary-soft hover:text-foreground focus-visible:ring-accent fixed right-4 bottom-[7.5rem] z-40 flex size-10 cursor-pointer items-center justify-center rounded-full border shadow-[0_6px_18px_rgba(15,23,42,0.06)] backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none md:right-6 md:bottom-[8.5rem]"
      aria-label="回到顶部"
      @click="scrollToTop"
    >
      <ArrowUp class="size-4" aria-hidden="true" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ArrowUp } from 'lucide-vue-next'

const route = useRoute()
const visible = ref(false)
const bottomOffsetThreshold = 200
const minimumScrollDistance = 240

function updateVisibility() {
  const scrollHeight = document.documentElement.scrollHeight
  const viewportHeight = window.innerHeight
  const scrollTop = window.scrollY
  const scrollBottom = scrollHeight - viewportHeight - scrollTop
  const isScrollable = scrollHeight > viewportHeight + 1
  const hasScrolledEnough = scrollTop > minimumScrollDistance

  visible.value = isScrollable && hasScrolledEnough && scrollBottom <= bottomOffsetThreshold
}

function scrollToTop() {
  window.scrollTo(0, 0)
}

onMounted(() => {
  updateVisibility()

  window.addEventListener('scroll', updateVisibility, {
    passive: true,
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateVisibility)
})

watch(
  () => route.fullPath,
  () => {
    requestAnimationFrame(updateVisibility)
  },
)
</script>
