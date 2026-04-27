<template>
  <article class="mx-auto max-w-3xl px-4 py-16">
    <NuxtLink to="/blog" class="text-muted-foreground hover:text-foreground text-sm">
      返回文章列表
    </NuxtLink>
    <h1 class="mt-6 text-3xl font-semibold">{{ post?.title ?? '文章不存在' }}</h1>
    <p v-if="post" class="text-muted-foreground mt-4">{{ post.excerpt }}</p>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)
</script>
