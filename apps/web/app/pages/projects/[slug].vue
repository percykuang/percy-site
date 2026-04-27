<template>
  <section class="mx-auto max-w-3xl px-4 py-16">
    <NuxtLink to="/projects" class="text-muted-foreground hover:text-foreground text-sm">
      返回项目列表
    </NuxtLink>
    <h1 class="mt-6 text-3xl font-semibold">{{ project?.title ?? '项目不存在' }}</h1>
    <p v-if="project" class="text-muted-foreground mt-4">{{ project.summary }}</p>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: project } = await useFetch(`/api/projects/${route.params.slug}`)
</script>
