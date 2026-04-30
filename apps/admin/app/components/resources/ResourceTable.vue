<template>
  <div class="admin-resource-table-shell">
    <ClientOnly fallback-tag="div">
      <a-table
        class="admin-resource-table"
        :columns="columns"
        :data-source="resources"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: tableScrollX }"
        table-layout="fixed"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'preview'">
            <ResourcePreviewCell
              :resource="toResourceRecord(record)"
              @preview="emit('preview', $event)"
            />
          </template>

          <template v-else-if="column.key === 'name'">
            <span
              class="admin-table-ellipsis w-full font-medium text-[#111827]"
              :title="getResourceDisplayName(toResourceRecord(record))"
            >
              {{ formatResourceTableText(getResourceDisplayName(toResourceRecord(record))) }}
            </span>
          </template>

          <template v-else-if="column.key === 'description'">
            <span
              class="admin-table-ellipsis w-full text-slate-600"
              :title="toResourceRecord(record).alt || undefined"
            >
              {{ formatResourceTableText(toResourceRecord(record).alt) }}
            </span>
          </template>

          <template v-else-if="column.key === 'storageKey'">
            <span
              class="admin-table-ellipsis w-full text-xs text-slate-500"
              :title="toResourceRecord(record).storageKey"
            >
              {{ formatResourceTableText(toResourceRecord(record).storageKey) }}
            </span>
          </template>

          <template v-else-if="column.key === 'type'">
            <a-tag :color="getResourceTypeColor(toResourceRecord(record).type)">
              {{ getResourceTypeLabel(toResourceRecord(record).type) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'size'">
            <span class="text-slate-700">{{
              formatResourceFileSize(toResourceRecord(record).size)
            }}</span>
          </template>

          <template v-else-if="column.key === 'referencesCount'">
            <a-tag :color="toResourceRecord(record).referencesCount > 0 ? 'blue' : undefined">
              {{ toResourceRecord(record).referencesCount }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'createdAt'">
            <span class="text-slate-700">{{
              formatResourceDate(toResourceRecord(record).createdAt)
            }}</span>
          </template>

          <template v-else-if="column.key === 'actions'">
            <ResourceActions
              :resource="toResourceRecord(record)"
              @copy-url="emit('copy-url', $event)"
              @copy-markdown="emit('copy-markdown', $event)"
              @edit="emit('edit', $event)"
              @delete="emit('delete', $event)"
            />
          </template>
        </template>
      </a-table>

      <template #fallback>
        <div class="p-6">
          <a-skeleton active />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { AdminResourceItem } from '@ps/shared/resource'
import type { TableColumnType, TablePaginationConfig } from 'ant-design-vue'
import {
  formatResourceDate,
  formatResourceFileSize,
  formatResourceTableText,
  getResourceDisplayName,
  getResourceTypeColor,
  getResourceTypeLabel,
} from '../../utils/resource-display'
import ResourceActions from './ResourceActions.vue'
import ResourcePreviewCell from './ResourcePreviewCell.vue'

defineProps<{
  loading: boolean
  pagination: false | TablePaginationConfig
  resources: AdminResourceItem[]
}>()

const emit = defineEmits<{
  'copy-markdown': [resource: AdminResourceItem]
  'copy-url': [resource: AdminResourceItem]
  delete: [resource: AdminResourceItem]
  edit: [resource: AdminResourceItem]
  preview: [resource: AdminResourceItem]
}>()

const tableScrollX = 1120

const columns: TableColumnType[] = [
  {
    key: 'preview',
    title: '资源',
    width: 96,
  },
  {
    dataIndex: 'originalFilename',
    key: 'name',
    title: '文件名',
    ellipsis: true,
    width: 120,
  },
  {
    dataIndex: 'alt',
    key: 'description',
    title: '描述',
    ellipsis: true,
    width: 120,
  },
  {
    dataIndex: 'storageKey',
    key: 'storageKey',
    title: '存储路径',
    ellipsis: true,
    width: 200,
  },
  {
    dataIndex: 'type',
    key: 'type',
    title: '类型',
    width: 96,
  },
  {
    dataIndex: 'size',
    key: 'size',
    title: '大小',
    width: 100,
  },
  {
    dataIndex: 'referencesCount',
    key: 'referencesCount',
    title: '引用',
    width: 80,
  },
  {
    dataIndex: 'createdAt',
    key: 'createdAt',
    title: '上传时间',
    width: 150,
  },
  {
    align: 'center' as const,
    fixed: 'right',
    key: 'actions',
    title: '操作',
    width: 140,
  },
]

function toResourceRecord(record: unknown) {
  return record as AdminResourceItem
}
</script>

<style scoped>
.admin-resource-table-shell :deep(.admin-resource-table .ant-table) {
  color: #111827;
}

.admin-resource-table-shell :deep(.admin-resource-table .ant-table-thead > tr > th) {
  border-bottom: 1px solid #e9eef6;
  background: #f8fafc;
  color: #0f172a;
  font-weight: 600;
}

.admin-resource-table-shell :deep(.admin-resource-table .ant-table-tbody > tr > td) {
  padding: 14px 16px;
  border-bottom: 1px solid #edf2f7;
}

.admin-resource-table-shell :deep(.admin-resource-table .ant-table-tbody > tr > td.ant-table-cell) {
  vertical-align: middle !important;
}

.admin-resource-table-shell :deep(.admin-resource-table .ant-table-tbody > tr:hover > td) {
  background: #f8fbff;
}

.admin-resource-table-shell :deep(.admin-resource-table .ant-table-cell::before) {
  display: none;
}

.admin-resource-table-shell :deep(.admin-resource-table .ant-pagination) {
  margin: 16px 20px;
}
</style>
