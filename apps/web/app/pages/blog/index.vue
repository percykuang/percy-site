<template>
  <section class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-3xl font-semibold">文章</h1>
    <p class="text-muted-foreground mt-3 max-w-2xl">技术笔记、项目复盘和前端工程实践。</p>
    <div class="mt-10 grid gap-4">
      <article v-for="post in posts" :key="post.slug" class="border-border rounded-lg border p-5">
        <h2 class="text-lg font-medium">{{ post.title }}</h2>
        <p class="text-muted-foreground mt-2 text-sm">{{ post.excerpt }}</p>
        <NuxtLink
          class="text-primary mt-4 inline-flex text-sm font-medium"
          :to="`/blog/${post.slug}`"
        >
          阅读文章
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts', {
  default: () => [],
})
</script>
