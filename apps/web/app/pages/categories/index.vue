<template>
  <section class="mx-auto max-w-4xl px-4 py-9 sm:px-6 md:py-12">
    <div v-if="categoryGroups.length > 0" class="space-y-12 md:space-y-14">
      <section
        v-for="group in categoryGroups"
        :key="group.category"
        class="grid gap-5 md:grid-cols-[8rem_1fr] md:gap-8"
      >
        <div class="md:pt-3">
          <h1
            v-if="group.isFirst"
            class="text-primary text-2xl leading-tight font-semibold tracking-tight"
          >
            {{ group.category }}
          </h1>
          <h2 v-else class="text-primary text-2xl leading-tight font-semibold tracking-tight">
            {{ group.category }}
          </h2>
          <p class="text-muted-foreground mt-2 text-xs">{{ group.articles.length }} 篇文章</p>
        </div>

        <div>
          <article v-for="(article, articleIndex) in group.articles" :key="article.id">
            <NuxtLink
              :to="{
                path: `/articles/${article.id}`,
                query: {
                  from: 'categories',
                },
              }"
              class="group hover:bg-surface-blue/60 block px-4 transition-colors sm:px-5"
            >
              <div
                class="border-soft-border grid grid-cols-[1fr_auto] gap-4 py-4 sm:py-5"
                :class="articleIndex === group.articles.length - 1 ? '' : 'border-b'"
              >
                <div class="min-w-0">
                  <h3
                    class="group-hover:text-primary truncate text-lg leading-7 font-semibold transition-colors sm:text-xl"
                  >
                    {{ article.title }}
                  </h3>

                  <p class="text-muted-foreground mt-1 line-clamp-1 text-sm leading-6">
                    {{ article.excerpt }}
                  </p>

                  <div class="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span>{{ article.wordCount }} 字</span>
                    <span aria-hidden="true">/</span>
                    <span>{{ article.tags.map((tag) => tag.name).join(' · ') }}</span>
                  </div>
                </div>

                <time
                  :datetime="article.publishedAt ?? undefined"
                  class="text-muted-foreground group-hover:text-primary pt-1 font-mono text-sm transition-colors sm:text-base"
                >
                  {{ formatArticleDate(article.publishedAt) }}
                </time>
              </div>
            </NuxtLink>
          </article>
        </div>
      </section>
    </div>

    <div
      v-else
      class="border-soft-border bg-surface mt-10 rounded-lg border p-8 text-center shadow-sm"
    >
      <BookOpen class="text-primary mx-auto size-8" aria-hidden="true" />
      <h1 class="mt-4 text-lg font-semibold">分类内容准备中</h1>
      <p class="text-muted-foreground mt-2 text-sm">发布文章后，这里会按分类展示内容。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ArticleListItem } from '@ps/shared/article'
import { BookOpen } from 'lucide-vue-next'

const { data: displayArticles } = await usePublishedArticles()

const categoryGroups = computed(() => {
  const groups = new Map<string, ArticleListItem[]>()

  for (const article of displayArticles.value) {
    const category = article.category || '未分类'
    const articles = groups.get(category) ?? []

    articles.push(article)
    groups.set(category, articles)
  }

  return Array.from(groups.entries())
    .map(([category, articles]) => ({
      articles,
      category,
      latestPublishedAt: getLatestPublishedAt(articles),
    }))
    .sort((a, b) => b.latestPublishedAt - a.latestPublishedAt)
    .map((group, index) => ({
      articles: group.articles,
      category: group.category,
      isFirst: index === 0,
    }))
})

function getLatestPublishedAt(articles: ArticleListItem[]) {
  return Math.max(...articles.map((article) => getArticleTime(article.publishedAt)))
}

function getArticleTime(value: string | null) {
  const date = value ? new Date(value) : null

  return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0
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
