<template>
  <article class="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:py-10">
    <div v-if="article">
      <div class="min-w-0">
        <header class="border-soft-border border-b pb-6">
          <div class="leading-tight">
            <h1 class="inline text-3xl leading-tight font-semibold text-pretty md:text-4xl">
              {{ article.title }}
            </h1>
            <span
              class="bg-primary-soft text-primary relative top-2 ml-3 inline-flex rounded-full px-2 py-0.5 align-top text-[11px] leading-4 font-medium"
            >
              {{ article.category }}
            </span>
          </div>

          <div
            class="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm"
          >
            <time :datetime="article.publishedAt ?? undefined">
              {{ formatArticleDate(article.publishedAt) }}
            </time>
            <span aria-hidden="true">/</span>
            <span>{{ article.wordCount }} 字</span>
          </div>

          <p class="text-muted-foreground mt-4 text-base leading-7">{{ article.excerpt }}</p>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag.slug"
              class="bg-surface-blue text-muted-foreground rounded-full px-2.5 py-1 text-xs"
            >
              {{ tag.name }}
            </span>
          </div>
        </header>

        <div class="pt-6">
          <div class="markdown-body" v-html="article.contentHtml" />
        </div>
      </div>
    </div>

    <div v-else class="border-soft-border bg-surface mt-8 rounded-lg border p-8 text-center">
      <h1 class="text-2xl font-semibold">文章不存在</h1>
      <p class="text-muted-foreground mt-3">这篇文章可能尚未发布或已被移除。</p>
      <NuxtLink
        to="/articles"
        class="text-primary hover:text-primary-hover mt-6 inline-flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        返回文章列表
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PublicArticleDetail } from '@ps/shared/article'
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()
const articleId = computed(() => {
  const value = route.params.id

  return Array.isArray(value) ? (value[0] ?? '') : String(value ?? '')
})

const { data: article } = await useAsyncData(
  () => `web-article-detail:${articleId.value}`,
  () => webApiFetch<PublicArticleDetail>(`/api/articles/${articleId.value}`),
  {
    default: () => null,
    watch: [articleId],
  },
)

function formatArticleDate(value: string | null) {
  const date = value ? new Date(value) : null

  if (!date || Number.isNaN(date.getTime())) {
    return '--.--'
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}.${month}.${day}`
}
</script>
