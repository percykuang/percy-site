<template>
  <button
    ref="triggerRef"
    class="text-muted-foreground hover:bg-primary-soft hover:text-foreground focus-visible:ring-accent flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
    :class="isOpen ? 'bg-primary-soft text-foreground' : ''"
    type="button"
    aria-label="搜索文章"
    :aria-expanded="isOpen"
    aria-controls="site-search-dialog"
    @click="openSearch"
  >
    <Search class="size-4" aria-hidden="true" />
  </button>

  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-60 bg-white/70 px-4 pt-24 backdrop-blur-sm sm:pt-28"
      role="presentation"
      @click.self="closeSearch"
    >
      <section
        id="site-search-dialog"
        class="border-soft-border bg-background mx-auto w-full max-w-xl overflow-hidden rounded-xl border shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
        role="dialog"
        aria-modal="true"
        aria-label="搜索文章"
      >
        <div class="border-soft-border relative border-b">
          <Search
            class="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <label class="sr-only" for="site-search-input">搜索文章</label>
          <input
            id="site-search-input"
            ref="inputRef"
            v-model="searchQuery"
            class="text-foreground placeholder:text-muted-foreground/70 h-12 w-full bg-transparent pr-11 pl-11 text-sm outline-none"
            type="search"
            placeholder="搜索文章标题、摘要、分类或标签"
            autocomplete="off"
            @keydown.esc="closeSearch"
            @keydown.enter.prevent="openFirstResult"
          />
          <button
            v-if="hasSearchQuery"
            class="text-muted-foreground hover:bg-primary-soft hover:text-primary absolute top-1/2 right-3 flex size-7 -translate-y-1/2 items-center justify-center rounded-md transition-colors"
            type="button"
            aria-label="清空搜索"
            @click="clearSearch"
          >
            <X class="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <div class="max-h-[min(26rem,calc(100vh-12rem))] overflow-y-auto p-2">
          <div v-if="visibleArticles.length > 0">
            <NuxtLink
              v-for="article in visibleArticles"
              :key="article.id"
              class="group hover:bg-surface-blue/70 grid grid-cols-[1fr_auto] gap-4 rounded-lg px-3 py-3 transition-colors"
              :to="`/articles/${article.id}`"
              @click="closeSearch"
            >
              <div class="min-w-0">
                <div class="flex min-w-0 items-center gap-2">
                  <h2
                    class="group-hover:text-primary truncate text-sm font-semibold transition-colors"
                  >
                    {{ article.title }}
                  </h2>
                  <span
                    class="bg-primary-soft text-primary hidden shrink-0 rounded-full px-2 py-0.5 text-[11px] leading-4 sm:inline-flex"
                  >
                    {{ article.category }}
                  </span>
                </div>
                <p class="text-muted-foreground mt-1 line-clamp-1 text-xs leading-5">
                  {{ article.excerpt }}
                </p>
              </div>

              <time
                :datetime="article.publishedAt ?? undefined"
                class="text-muted-foreground group-hover:text-primary pt-0.5 font-mono text-xs transition-colors"
              >
                {{ formatArticleDate(article.publishedAt) }}
              </time>
            </NuxtLink>
          </div>

          <div v-else class="px-4 py-10 text-center">
            <Search class="text-primary mx-auto size-7" aria-hidden="true" />
            <p class="mt-3 text-sm font-medium">没有找到相关文章</p>
            <p class="text-muted-foreground mt-1 text-xs">换一个关键词再试试。</p>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

const { data: articles } = await usePublishedArticles()

const isOpen = ref(false)
const searchQuery = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const normalizedSearchQuery = computed(() => normalizeSearchText(searchQuery.value))
const hasSearchQuery = computed(() => normalizedSearchQuery.value.length > 0)

const filteredArticles = computed(() => {
  if (!hasSearchQuery.value) {
    return articles.value
  }

  return articles.value.filter((article) => {
    const searchableText = normalizeSearchText(
      [
        article.title,
        article.excerpt,
        article.category,
        article.id,
        ...article.tags.flatMap((tag) => [tag.name, tag.slug]),
      ].join(' '),
    )

    return searchableText.includes(normalizedSearchQuery.value)
  })
})

const visibleArticles = computed(() => filteredArticles.value.slice(0, 8))

watch(isOpen, async (value) => {
  if (!value) {
    return
  }

  await nextTick()
  inputRef.value?.focus()
})

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

function openSearch() {
  isOpen.value = true
}

function closeSearch() {
  isOpen.value = false
  searchQuery.value = ''
  triggerRef.value?.focus()
}

function clearSearch() {
  searchQuery.value = ''
  inputRef.value?.focus()
}

function openFirstResult() {
  const [firstArticle] = visibleArticles.value

  if (!firstArticle) {
    return
  }

  closeSearch()
  navigateTo(`/articles/${firstArticle.id}`)
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    closeSearch()
    return
  }

  const isSearchShortcut = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)

  if (!isSearchShortcut) {
    return
  }

  event.preventDefault()
  openSearch()
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase()
}

function formatArticleDate(value: string | null) {
  const date = value ? new Date(value) : null

  if (!date || Number.isNaN(date.getTime())) {
    return '--.--'
  }

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${month}.${day}`
}
</script>
