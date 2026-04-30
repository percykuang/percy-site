<template>
  <section class="flex h-full min-h-0 flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-950">新建文章</h1>
      </div>
      <a-space>
        <a-button type="primary" html-type="submit" form="article-form">提交</a-button>
        <NuxtLink to="/articles">
          <a-button>返回</a-button>
        </NuxtLink>
      </a-space>
    </div>

    <div class="min-h-0 flex-1">
      <ArticleForm mode="create" />
    </div>
  </section>
</template>

<script setup lang="ts">
import ArticleForm from '~/components/articles/ArticleForm.vue'
</script>
