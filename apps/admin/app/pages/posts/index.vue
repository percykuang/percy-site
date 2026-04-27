<template>
  <section>
    <h1 class="text-2xl font-semibold">文章管理</h1>
    <div class="border-border bg-background mt-6 rounded-lg border">
      <div
        v-for="post in posts"
        :key="post.slug"
        class="border-border border-b p-4 last:border-b-0"
      >
        <p class="font-medium">{{ post.title }}</p>
        <p class="text-muted-foreground mt-1 text-sm">{{ post.excerpt }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts', {
  default: () => [],
})
</script>
