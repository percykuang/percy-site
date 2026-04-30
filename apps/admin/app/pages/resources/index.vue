<template>
  <section class="flex min-h-0 flex-col">
    <div class="mb-5 flex items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold tracking-tight text-[#111827]">资源管理</h1>
      <a-upload
        accept="image/*,audio/*,video/*,.pdf,.txt,.md,.zip"
        :custom-request="uploadResource"
        :disabled="uploading"
        :multiple="false"
        :show-upload-list="false"
      >
        <a-button type="primary" :loading="uploading">上传资源</a-button>
      </a-upload>
    </div>

    <a-card class="admin-resource-panel" :body-style="{ padding: 0 }">
      <div class="flex items-center justify-between gap-4 border-b border-[#edf1f7] px-5 py-4">
        <div class="flex min-w-0 items-center gap-2">
          <span class="text-sm font-medium text-slate-950">全部资源</span>
          <a-tag>{{ pagination.total }} 条</a-tag>
        </div>

        <div class="flex items-center justify-end gap-3">
          <a-select
            v-model:value="selectedType"
            allow-clear
            class="w-34"
            :options="resourceTypeOptions"
            placeholder="资源类型"
            @change="applyFilters"
          />
          <a-input-search
            v-model:value="searchKeyword"
            allow-clear
            class="w-80"
            placeholder="搜索资源"
            @search="applyFilters"
          />
        </div>
      </div>

      <ResourceTable
        :loading="pending"
        :pagination="tablePagination"
        :resources="resources"
        @preview="openImagePreview"
        @copy-url="copyResourceUrl"
        @copy-markdown="copyResourceMarkdown"
        @edit="openMetadataModal"
        @delete="deleteCurrentResource"
      />
    </a-card>

    <ImageLightbox
      :alt="imagePreview.alt"
      :open="imagePreview.open"
      :src="imagePreview.src"
      @close="closeImagePreview"
    />

    <ResourceMetadataModal
      v-model:open="metadataModalOpen"
      :confirm-loading="metadataPending"
      :resource="activeResource"
      @save="saveMetadata"
    />
  </section>
</template>

<script setup lang="ts">
import type {
  AdminResourceItem,
  AdminResourcesResponse,
  ResourceType,
  UpdateResourceInput,
} from '@ps/shared/resource'
import { ImageLightbox } from '@ps/ui'
import { Modal, message, type TablePaginationConfig } from 'ant-design-vue'
import type { UploadRequestOption } from 'ant-design-vue/es/vc-upload/interface'
import ResourceMetadataModal from '../../components/resources/ResourceMetadataModal.vue'
import ResourceTable from '../../components/resources/ResourceTable.vue'
import { getResourceDisplayName } from '../../utils/resource-display'

const defaultPageSize = 10
const route = useRoute()
const uploading = ref(false)
const metadataModalOpen = ref(false)
const metadataPending = ref(false)
const activeResource = ref<AdminResourceItem | null>(null)
const imagePreview = reactive({
  alt: '',
  open: false,
  src: '',
})
const searchKeyword = ref(getStringQueryValue(route.query.keyword))
const selectedType = ref<ResourceType | undefined>(toResourceType(route.query.type))

const currentPage = computed(() => parsePageQuery(route.query.page))
const pageSize = computed(() => parsePageSizeQuery(route.query.pageSize))
const keywordQuery = computed(() => getStringQueryValue(route.query.keyword))
const typeQuery = computed(() => toResourceType(route.query.type))

const {
  data: resourcesResponse,
  pending,
  refresh,
} = await useAsyncData(
  'admin-resources',
  () =>
    adminApiFetch<AdminResourcesResponse>('/api/resources', {
      query: {
        keyword: keywordQuery.value || undefined,
        page: currentPage.value,
        pageSize: pageSize.value,
        type: typeQuery.value,
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
    watch: [currentPage, pageSize, keywordQuery, typeQuery],
  },
)

const resourceTypeOptions = [
  {
    label: '图片',
    value: 'IMAGE',
  },
  {
    label: '音频',
    value: 'AUDIO',
  },
  {
    label: '视频',
    value: 'VIDEO',
  },
  {
    label: '文件',
    value: 'FILE',
  },
]

const resources = computed(() => resourcesResponse.value.items)
const pagination = computed(() => resourcesResponse.value.pagination)
const tablePagination = computed<TablePaginationConfig>(() => ({
  current: pagination.value.page,
  onChange: handlePaginationChange,
  pageSize: pagination.value.pageSize,
  pageSizeOptions: ['10', '20', '50'],
  position: ['bottomRight'],
  showSizeChanger: true,
  showTotal: (total: number, range: [number, number]) =>
    `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
  total: pagination.value.total,
}))

watch(
  () => route.query,
  () => {
    searchKeyword.value = getStringQueryValue(route.query.keyword)
    selectedType.value = toResourceType(route.query.type)
  },
)

watch(
  () => pagination.value.totalPages,
  (totalPages) => {
    if (currentPage.value > totalPages) {
      void goToPage(totalPages, pageSize.value)
    }
  },
)

async function uploadResource(options: UploadRequestOption) {
  const file = options.file instanceof File ? options.file : null

  if (!file) {
    message.error('请选择要上传的文件')
    return
  }

  uploading.value = true
  const formData = new FormData()
  formData.append('file', file)

  try {
    const resource = await adminApiFetch<AdminResourceItem>('/api/resources', {
      body: formData,
      method: 'POST',
    })

    options.onSuccess?.(resource)
    message.success('资源已上传')
    await refresh()
  } catch (error) {
    const errorMessage = getAdminApiErrorMessage(error, '上传失败，请检查文件后重试。')
    options.onError?.(new Error(errorMessage))
    message.error(errorMessage)
  } finally {
    uploading.value = false
  }
}

function openMetadataModal(resource: AdminResourceItem) {
  activeResource.value = resource
  metadataModalOpen.value = true
}

function openImagePreview(resource: AdminResourceItem) {
  if (resource.type !== 'IMAGE') {
    return
  }

  imagePreview.alt = resource.alt || resource.title || resource.originalFilename
  imagePreview.src = resource.url
  imagePreview.open = true
}

function closeImagePreview() {
  imagePreview.open = false
}

async function saveMetadata(input: UpdateResourceInput) {
  if (!activeResource.value) {
    return
  }

  metadataPending.value = true

  try {
    await adminApiFetch<AdminResourceItem>(`/api/resources/${activeResource.value.id}`, {
      body: input,
      method: 'PATCH',
    })
    message.success('资源信息已保存')
    metadataModalOpen.value = false
    await refresh()
  } catch (error) {
    message.error(getAdminApiErrorMessage(error, '保存失败，请稍后重试。'))
  } finally {
    metadataPending.value = false
  }
}

function deleteCurrentResource(resource: AdminResourceItem) {
  Modal.confirm({
    cancelText: '取消',
    centered: true,
    content:
      resource.referencesCount > 0
        ? '该资源仍被文章引用，暂不能删除。'
        : `确认删除「${getResourceDisplayName(resource)}」吗？此操作不可恢复。`,
    okButtonProps: {
      danger: resource.referencesCount === 0,
      disabled: resource.referencesCount > 0,
    },
    okText: '删除',
    title: '删除资源',
    async onOk() {
      await adminApiFetch(`/api/resources/${resource.id}`, {
        method: 'DELETE',
      })
      message.success('资源已删除')
      await refresh()
    },
  })
}

async function copyResourceUrl(resource: AdminResourceItem) {
  await copyText(resource.url, '资源地址已复制')
}

async function copyResourceMarkdown(resource: AdminResourceItem) {
  const altText = resource.alt || resource.title || resource.originalFilename

  await copyText(`![${altText}](${resource.url})`, 'Markdown 已复制')
}

async function copyText(value: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(value)
    message.success(successMessage)
  } catch {
    message.error('复制失败')
  }
}

function applyFilters() {
  const query: Record<string, string> = {}
  const keyword = searchKeyword.value.trim()

  if (keyword) {
    query.keyword = keyword
  }

  if (selectedType.value) {
    query.type = selectedType.value
  }

  if (pageSize.value !== defaultPageSize) {
    query.pageSize = String(pageSize.value)
  }

  void navigateTo({
    path: route.path,
    query,
  })
}

function handlePaginationChange(page: number, nextPageSize: number) {
  void goToPage(nextPageSize !== pageSize.value ? 1 : page, nextPageSize)
}

async function goToPage(page: number, nextPageSize: number) {
  const targetPage = Math.min(Math.max(1, page), pagination.value.totalPages)
  const query: Record<string, string> = {}
  const keyword = keywordQuery.value
  const type = typeQuery.value

  if (keyword) {
    query.keyword = keyword
  }

  if (type) {
    query.type = type
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

function getStringQueryValue(value: unknown) {
  const rawValue = Array.isArray(value) ? value[0] : value

  return typeof rawValue === 'string' ? rawValue : ''
}

function toResourceType(value: unknown): ResourceType | undefined {
  const rawValue = getStringQueryValue(value)

  return ['IMAGE', 'AUDIO', 'VIDEO', 'FILE'].includes(rawValue)
    ? (rawValue as ResourceType)
    : undefined
}
</script>

<style scoped>
:deep(.admin-resource-panel.ant-card) {
  overflow: hidden;
  border-color: #e5ebf3;
  border-radius: 10px;
  box-shadow: none;
}
</style>
