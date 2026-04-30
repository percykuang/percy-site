<template>
  <section>
    <div class="mb-6 flex items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold tracking-tight text-[#111827]">文章管理</h1>
      <NuxtLink v-slot="{ navigate }" custom to="/articles/new">
        <a-button type="primary" @click="navigate">新建文章</a-button>
      </NuxtLink>
    </div>

    <ClientOnly fallback-tag="div">
      <a-table
        bordered
        :columns="columns"
        :data-source="articles"
        :loading="pending"
        :pagination="tablePagination"
        row-key="id"
        :scroll="{ x: tableScrollX }"
        table-layout="fixed"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <NuxtLink
              class="admin-table-ellipsis max-w-70 font-medium text-[#111827]"
              :title="toArticleRecord(record).title"
              :to="`/articles/${toArticleRecord(record).id}`"
            >
              {{ toArticleRecord(record).title }}
            </NuxtLink>
          </template>

          <template v-else-if="column.key === 'excerpt'">
            <span
              class="admin-table-ellipsis max-w-90 text-slate-600"
              :title="toArticleRecord(record).excerpt"
            >
              {{ toArticleRecord(record).excerpt }}
            </span>
          </template>

          <template v-else-if="column.key === 'tags'">
            <div class="flex max-w-80 flex-wrap gap-1">
              <a-tag v-for="tag in toArticleRecord(record).tags" :key="tag.slug">
                {{ tag.name }}
              </a-tag>
              <span v-if="toArticleRecord(record).tags.length === 0" class="text-slate-400">-</span>
            </div>
          </template>

          <template v-else-if="column.key === 'category'">
            <a-tag color="blue">{{ toArticleRecord(record).category }}</a-tag>
          </template>

          <template v-else-if="column.key === 'wordCount'">
            <a-tag>{{ toArticleRecord(record).wordCount }}</a-tag>
          </template>

          <template v-else-if="column.key === 'publishedAt'">
            {{ formatDate(toArticleRecord(record).publishedAt) }}
          </template>

          <template v-else-if="column.key === 'actions'">
            <a-dropdown trigger="click">
              <a-button size="small" type="text" aria-label="更多操作">
                <template #icon>
                  <EllipsisOutlined />
                </template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="edit">
                    <NuxtLink :to="`/articles/${toArticleRecord(record).id}`">
                      <EditOutlined />
                      <span class="ml-2">编辑</span>
                    </NuxtLink>
                  </a-menu-item>
                  <a-menu-item
                    key="delete"
                    danger
                    @click="deleteCurrentArticle(toArticleRecord(record))"
                  >
                    <DeleteOutlined />
                    <span class="ml-2">删除</span>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>

      <template #fallback>
        <div class="rounded-lg border border-[#d9e2ef] bg-white p-6">
          <a-skeleton active />
        </div>
      </template>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import type { AdminArticleListItem, AdminArticlesResponse } from '@ps/shared/article'
import { Modal, message, type TableColumnType } from 'ant-design-vue'

const defaultPageSize = 10
const tableScrollX = 1160
const route = useRoute()
const currentPage = computed(() => parsePageQuery(route.query.page))
const pageSize = computed(() => parsePageSizeQuery(route.query.pageSize))

const {
  data: articlesResponse,
  pending,
  refresh,
} = await useAsyncData(
  'admin-articles',
  () =>
    adminApiFetch<AdminArticlesResponse>('/api/articles', {
      query: {
        page: currentPage.value,
        pageSize: pageSize.value,
      },
    }),
  {
    default: () => ({
      items: [],
      pagination: {
        page: 1,
        pageSize: defaultPageSize,
        total: 0,
        totalPages: 1,
      },
    }),
    watch: [currentPage, pageSize],
  },
)

const columns: TableColumnType[] = [
  {
    dataIndex: 'title',
    key: 'title',
    title: '标题',
    ellipsis: true,
    width: 220,
  },
  {
    dataIndex: 'excerpt',
    key: 'excerpt',
    title: '摘要',
    ellipsis: true,
    width: 320,
  },
  {
    dataIndex: 'category',
    key: 'category',
    title: '分类',
    width: 120,
  },
  {
    key: 'tags',
    title: '标签',
    width: 200,
  },
  {
    dataIndex: 'publishedAt',
    key: 'publishedAt',
    title: '发布日期',
    width: 140,
  },
  {
    dataIndex: 'wordCount',
    key: 'wordCount',
    title: '字数',
    width: 80,
  },
  {
    align: 'center' as const,
    key: 'actions',
    title: '操作',
    fixed: 'right',
    width: 80,
  },
]

const articles = computed(() => articlesResponse.value.items)
const pagination = computed(() => articlesResponse.value.pagination)
const tablePagination = computed(() => ({
  current: pagination.value.page,
  pageSize: pagination.value.pageSize,
  pageSizeOptions: ['10', '20', '50'],
  showSizeChanger: true,
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
  total: pagination.value.total,
  onChange: handlePaginationChange,
}))

watch(
  () => pagination.value.totalPages,
  (totalPages) => {
    if (currentPage.value > totalPages) {
      void goToPage(totalPages, pageSize.value)
    }
  },
)

function deleteCurrentArticle(article: AdminArticleListItem) {
  Modal.confirm({
    centered: true,
    title: '删除文章',
    content: `确认删除《${article.title}》吗？此操作不可恢复。`,
    okButtonProps: {
      danger: true,
    },
    okText: '删除',
    cancelText: '取消',
    async onOk() {
      await adminApiFetch(`/api/articles/${article.id}`, {
        method: 'DELETE',
      })
      message.success('文章已删除')
      await refresh()
    },
  })
}

function toArticleRecord(record: unknown) {
  return record as AdminArticleListItem
}

function handlePaginationChange(page: number, nextPageSize: number) {
  void goToPage(nextPageSize !== pageSize.value ? 1 : page, nextPageSize)
}

async function goToPage(page: number, nextPageSize: number) {
  const targetPage = Math.min(Math.max(1, page), pagination.value.totalPages)
  const query: Record<string, string> = {}

  for (const [key, value] of Object.entries(route.query)) {
    if ((key === 'page' && targetPage === 1) || key === 'pageSize' || typeof value !== 'string') {
      continue
    }

    query[key] = value
  }

  if (targetPage > 1) {
    query.page = String(targetPage)
  }

  if (nextPageSize !== defaultPageSize) {
    query.pageSize = String(nextPageSize)
  }

  await navigateTo({
    path: route.path,
    query,
  })
}

function parsePageQuery(value: unknown) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const page = Number(rawValue)

  return Number.isInteger(page) && page > 0 ? page : 1
}

function parsePageSizeQuery(value: unknown) {
  const rawValue = Array.isArray(value) ? value[0] : value
  const parsedPageSize = Number(rawValue)

  return [10, 20, 50].includes(parsedPageSize) ? parsedPageSize : defaultPageSize
}

function formatDate(value: string | null) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
</script>
