import type { Ref, ShallowRef } from 'vue'

type ScrollContainerTarget = Ref<HTMLElement | null> | ShallowRef<HTMLElement | null>

const scrollContainer = shallowRef<HTMLElement | null>(null)
const isBackTopVisible = ref(false)

const bottomOffsetThreshold = 200
const minimumScrollDistance = 240

function syncBackTopVisibility() {
  const container = scrollContainer.value

  if (!container) {
    isBackTopVisible.value = false
    return
  }

  const scrollHeight = container.scrollHeight
  const viewportHeight = container.clientHeight
  const scrollTop = container.scrollTop
  const isScrollable = scrollHeight > viewportHeight + 1
  const hasScrolledEnough = scrollTop > minimumScrollDistance
  const distanceToBottom = scrollHeight - viewportHeight - scrollTop

  isBackTopVisible.value =
    isScrollable && hasScrolledEnough && distanceToBottom <= bottomOffsetThreshold
}

function handleScroll() {
  syncBackTopVisibility()
}

function runAfterPaint(task: () => void) {
  if (import.meta.client) {
    requestAnimationFrame(task)
    return
  }

  task()
}

function attachScrollListener(container: HTMLElement | null) {
  container?.addEventListener('scroll', handleScroll, {
    passive: true,
  })
}

function detachScrollListener(container: HTMLElement | null) {
  container?.removeEventListener('scroll', handleScroll)
}

function setScrollContainer(container: HTMLElement | null) {
  if (scrollContainer.value === container) {
    runAfterPaint(syncBackTopVisibility)
    return
  }

  detachScrollListener(scrollContainer.value)
  scrollContainer.value = container
  attachScrollListener(container)
  runAfterPaint(syncBackTopVisibility)
}

function scrollToTop() {
  scrollContainer.value?.scrollTo({
    top: 0,
  })
}

function resetScrollForRouteChange(route: ReturnType<typeof useRoute>) {
  if (route.hash) {
    return
  }

  runAfterPaint(scrollToTop)
}

function registerScrollContainer(target: ScrollContainerTarget) {
  const route = useRoute()

  // `app.vue` 在这里注册公开站点壳层唯一的主滚动区域。
  watch(
    target,
    (container) => {
      setScrollContainer(container)
    },
    {
      immediate: true,
    },
  )

  watch(
    () => route.fullPath,
    () => {
      resetScrollForRouteChange(route)
    },
  )

  onScopeDispose(() => {
    setScrollContainer(null)
  })
}

export function useWebScroll() {
  return {
    scrollContainer: readonly(scrollContainer),
    isBackTopVisible: readonly(isBackTopVisible),
    registerScrollContainer,
    scrollToTop,
  }
}
