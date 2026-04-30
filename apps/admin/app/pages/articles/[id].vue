<template>
  <section class="flex h-full min-h-0 flex-col gap-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-slate-950">编辑文章</h1>
      </div>
      <a-space>
        <a-button
          v-if="article && !pending && !error"
          type="primary"
          html-type="submit"
          form="article-form"
        >
          提交
        </a-button>
        <NuxtLink to="/articles">
          <a-button>返回</a-button>
        </NuxtLink>
      </a-space>
    </div>

    <a-card v-if="pending">
      <a-skeleton active />
    </a-card>
    <a-alert v-else-if="error" type="error" show-icon message="文章不存在或加载失败。" />
    <div v-else-if="article" class="min-h-0 flex-1">
      <ArticleForm :initial-article="article" mode="edit" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AdminArticle } from '@ps/shared/article'
import ArticleForm from '~/components/articles/ArticleForm.vue'

const route = useRoute()
const articleId = computed(() => String(route.params.id))

const {
  data: article,
  error,
  pending,
} = await useAsyncData(
  'admin-article-detail',
  () => adminApiFetch<AdminArticle>(`/api/articles/${articleId.value}`),
  {
    default: () => null,
    watch: [articleId],
  },
)
</script>
