<template>
  <article class="mx-auto max-w-3xl px-4 py-14 sm:px-6">
    <NuxtLink
      to="/blog"
      class="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
    >
      <ArrowLeft class="size-4" aria-hidden="true" />
      返回文章列表
    </NuxtLink>

    <div v-if="post" class="mt-8">
      <p class="text-primary text-sm font-semibold">Article</p>
      <h1 class="mt-3 text-4xl leading-tight font-semibold">{{ post.title }}</h1>
      <p class="text-muted-foreground mt-5 text-lg leading-8">{{ post.excerpt }}</p>

      <div class="border-soft-border bg-surface mt-8 rounded-lg border p-6 shadow-sm">
        <p class="text-muted-foreground leading-8 whitespace-pre-line">{{ post.content }}</p>
      </div>
    </div>

    <div v-else class="border-soft-border bg-surface mt-8 rounded-lg border p-8 text-center">
      <h1 class="text-2xl font-semibold">文章不存在</h1>
      <p class="text-muted-foreground mt-3">这篇文章可能尚未发布或已被移除。</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

const route = useRoute()

const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)
</script>
