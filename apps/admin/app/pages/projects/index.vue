<template>
  <section>
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">项目管理</h1>
        <p class="text-muted-foreground mt-2 text-sm">管理作品集项目和发布状态。</p>
      </div>
    </div>
    <div class="border-border bg-background mt-6 rounded-lg border">
      <div
        v-for="project in projects"
        :key="project.slug"
        class="border-border border-b p-4 last:border-b-0"
      >
        <p class="font-medium">{{ project.title }}</p>
        <p class="text-muted-foreground mt-1 text-sm">{{ project.summary }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: projects } = await useFetch('/api/projects', {
  default: () => [],
})
</script>
