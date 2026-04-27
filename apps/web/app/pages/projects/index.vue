<template>
  <section class="mx-auto max-w-6xl px-4 py-16">
    <h1 class="text-3xl font-semibold">项目</h1>
    <p class="text-muted-foreground mt-3 max-w-2xl">精选作品、开源项目和前端实验。</p>
    <div class="mt-10 grid gap-4 md:grid-cols-2">
      <article
        v-for="project in projects"
        :key="project.slug"
        class="border-border rounded-lg border p-5"
      >
        <h2 class="text-lg font-medium">{{ project.title }}</h2>
        <p class="text-muted-foreground mt-2 text-sm">{{ project.summary }}</p>
        <NuxtLink
          class="text-primary mt-4 inline-flex text-sm font-medium"
          :to="`/projects/${project.slug}`"
        >
          查看详情
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: projects } = await useFetch('/api/projects', {
  default: () => [],
})
</script>
