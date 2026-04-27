<template>
  <section>
    <h1 class="text-2xl font-semibold">Dashboard</h1>
    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <div class="border-border bg-background rounded-lg border p-5">
        <p class="text-muted-foreground text-sm">项目</p>
        <p class="mt-2 text-2xl font-semibold">{{ projects.length }}</p>
      </div>
      <div class="border-border bg-background rounded-lg border p-5">
        <p class="text-muted-foreground text-sm">文章</p>
        <p class="mt-2 text-2xl font-semibold">{{ posts.length }}</p>
      </div>
      <div class="border-border bg-background rounded-lg border p-5">
        <p class="text-muted-foreground text-sm">待处理消息</p>
        <p class="mt-2 text-2xl font-semibold">{{ messages.length }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: projects } = await useFetch('/api/projects', {
  default: () => [],
})
const { data: posts } = await useFetch('/api/posts', {
  default: () => [],
})
const { data: messages } = await useFetch('/api/messages', {
  default: () => [],
})
</script>
