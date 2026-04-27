<template>
  <section class="mx-auto max-w-5xl px-4 py-14 sm:px-6">
    <div>
      <p class="text-primary text-sm font-semibold">Writing</p>
      <h1 class="mt-3 text-4xl font-semibold">文章</h1>
      <p class="text-muted-foreground mt-4 max-w-2xl leading-7">
        技术笔记、项目复盘和前端工程实践，关注那些会影响长期维护质量的细节。
      </p>
    </div>

    <div v-if="posts.length > 0" class="mt-10 grid gap-4">
      <article
        v-for="post in posts"
        :key="post.slug"
        class="border-soft-border bg-surface rounded-lg border p-5 shadow-sm"
      >
        <div class="flex items-start gap-4">
          <div class="bg-primary-soft flex size-10 shrink-0 items-center justify-center rounded-lg">
            <BookOpen class="text-primary size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 class="text-xl font-semibold">{{ post.title }}</h2>
            <p class="text-muted-foreground mt-2 leading-7">{{ post.excerpt }}</p>
          </div>
        </div>
        <NuxtLink
          class="text-primary hover:text-primary-hover mt-5 inline-flex items-center gap-2 text-sm font-medium"
          :to="`/blog/${post.slug}`"
        >
          阅读文章
          <ArrowRight class="size-4" aria-hidden="true" />
        </NuxtLink>
      </article>
    </div>

    <div
      v-else
      class="border-soft-border bg-surface mt-8 rounded-lg border p-8 text-center shadow-sm"
    >
      <BookOpen class="text-primary mx-auto size-8" aria-hidden="true" />
      <h2 class="mt-4 text-lg font-semibold">文章内容准备中</h2>
      <p class="text-muted-foreground mt-2 text-sm">后台发布文章后，这里会展示公开文章列表。</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowRight, BookOpen } from 'lucide-vue-next'

const { data: posts } = await useFetch('/api/posts', {
  default: () => [],
})
</script>
