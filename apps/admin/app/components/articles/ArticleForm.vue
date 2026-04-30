<template>
  <div class="flex h-full min-h-0 flex-col">
    <ClientOnly fallback-tag="div">
      <a-form
        id="article-form"
        class="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_22rem] items-stretch gap-4"
        layout="vertical"
        :model="form"
        @finish="submitArticle"
      >
        <a-card class="admin-article-content-card h-full min-h-0" title="Markdown 内容">
          <a-form-item
            class="admin-article-editor-field"
            name="content"
            :rules="[{ required: true, message: '请输入 Markdown 正文' }]"
          >
            <a-textarea
              v-model:value="form.content"
              class="admin-markdown-editor"
              placeholder="在这里编写 Markdown 正文"
            />
          </a-form-item>
        </a-card>

        <a-card class="admin-article-meta-card h-full" title="文章信息">
          <a-form-item
            name="title"
            label="标题"
            :rules="[{ required: true, message: '请输入标题' }]"
          >
            <a-input v-model:value="form.title" :maxlength="140" placeholder="输入文章标题" />
          </a-form-item>

          <a-form-item
            name="excerpt"
            label="摘要"
            :rules="[{ required: true, message: '请输入摘要' }]"
          >
            <a-textarea
              v-model:value="form.excerpt"
              :maxlength="300"
              placeholder="用于列表、搜索和 SEO 的简短描述"
              :rows="4"
              show-count
            />
          </a-form-item>

          <a-form-item
            name="category"
            label="分类"
            :rules="[{ required: true, message: '请输入分类' }]"
          >
            <a-auto-complete
              v-model:value="form.category"
              allow-clear
              :options="categoryOptions"
              placeholder="搜索或输入新分类"
              :filter-option="filterOption"
            />
          </a-form-item>

          <a-form-item label="标签">
            <a-select
              v-model:value="selectedTagValues"
              allow-clear
              mode="tags"
              :options="tagOptions"
              placeholder="搜索或输入标签"
              :filter-option="filterOption"
            />
          </a-form-item>

          <a-form-item
            name="publishedAt"
            label="发布日期"
            :rules="[{ required: true, message: '请选择发布日期' }]"
          >
            <a-date-picker
              v-model:value="form.publishedAt"
              class="w-full"
              show-time
              format="YYYY-MM-DD HH:mm"
              placeholder="选择发布日期"
            />
          </a-form-item>

          <a-form-item label="字数">
            <a-input-number :value="wordCount" class="w-full" disabled />
          </a-form-item>

          <a-alert
            v-if="errorMessage"
            class="mt-4"
            type="error"
            show-icon
            :message="errorMessage"
          />
        </a-card>
      </a-form>

      <template #fallback>
        <div class="rounded-lg border border-[#d9e2ef] bg-white p-6">
          <a-skeleton active />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { countWords, type AdminArticle, type CreateArticleInput } from '@ps/shared/article'
import type { AdminCategoryOption } from '@ps/shared/category'
import type { AdminTagOption } from '@ps/shared/tag'
import { createScopedSlug } from '@ps/shared/utils'
import { message } from 'ant-design-vue'
import type { DefaultOptionType } from 'ant-design-vue/es/select'
import dayjs, { type Dayjs } from 'dayjs'

type ArticleFormMode = 'create' | 'edit'

type ArticleFormState = {
  title: string
  category: string
  excerpt: string
  content: string
  publishedAt: Dayjs | undefined
}

const props = defineProps<{
  initialArticle?: AdminArticle | null
  mode: ArticleFormMode
}>()

const pending = ref(false)
const errorMessage = ref('')
const selectedTagValues = ref(props.initialArticle?.tags.map((tag) => tag.name) ?? [])

const { data: categories } = await useAsyncData(
  'admin-categories',
  () => adminApiFetch<AdminCategoryOption[]>('/api/categories'),
  {
    default: () => [],
  },
)

const { data: tags } = await useAsyncData(
  'admin-tags',
  () => adminApiFetch<AdminTagOption[]>('/api/tags'),
  {
    default: () => [],
  },
)

const form = reactive<ArticleFormState>({
  title: props.initialArticle?.title ?? '',
  category: props.initialArticle?.category ?? '前端工程',
  excerpt: props.initialArticle?.excerpt ?? '',
  content: props.initialArticle?.content ?? '',
  publishedAt: toDayjsValue(props.initialArticle?.publishedAt ?? new Date().toISOString()),
})

const wordCount = computed(() => countWords(form.content))
const categoryOptions = computed(() =>
  categories.value.map((category) => ({
    value: category.name,
  })),
)
const tagOptions = computed(() =>
  tags.value.map((tag) => ({
    label: tag.name,
    slug: tag.slug,
    value: tag.name,
  })),
)

async function submitArticle() {
  errorMessage.value = ''
  pending.value = true

  try {
    const payload = buildPayload()

    if (props.mode === 'create') {
      await adminApiFetch<AdminArticle>('/api/articles', {
        body: payload,
        method: 'POST',
      })

      message.success('文章已创建')
      await navigateTo('/articles')
      return
    }

    if (!props.initialArticle?.id) {
      throw new Error('Article id is required')
    }

    await adminApiFetch<AdminArticle>(`/api/articles/${props.initialArticle.id}`, {
      body: payload,
      method: 'PATCH',
    })

    message.success('文章已更新')
    await navigateTo('/articles')
  } catch (error) {
    errorMessage.value = getAdminApiErrorMessage(error, '保存失败，请检查表单内容后重试。')
  } finally {
    pending.value = false
  }
}

function buildPayload(): CreateArticleInput {
  if (!form.publishedAt) {
    throw new Error('请选择发布日期')
  }

  return {
    category: form.category.trim(),
    content: form.content,
    excerpt: form.excerpt.trim(),
    publishedAt: form.publishedAt.toDate(),
    tags: selectedTagValues.value.map((tagName) => {
      const option = tagOptions.value.find((tag) => tag.value === tagName)

      return {
        name: tagName,
        slug: option?.slug ?? createScopedSlug(tagName, 'tag'),
      }
    }),
    title: form.title.trim(),
    wordCount: wordCount.value,
  }
}

function filterOption(input: string, option?: DefaultOptionType) {
  const searchValue = input.trim().toLowerCase()
  const label = typeof option?.label === 'string' ? option.label : ''
  const value = typeof option?.value === 'string' ? option.value : ''
  const optionText = `${label} ${value}`.toLowerCase()

  return optionText.includes(searchValue)
}

function toDayjsValue(value: string) {
  const date = dayjs(value)

  return date.isValid() ? date : undefined
}
</script>
