<template>
  <a-space :size="2">
    <a-tooltip title="复制地址">
      <a-button size="small" type="text" aria-label="复制地址" @click="emit('copy-url', resource)">
        <template #icon>
          <CopyOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip v-if="resource.type === 'IMAGE'" title="复制 Markdown">
      <a-button
        size="small"
        type="text"
        aria-label="复制 Markdown"
        @click="emit('copy-markdown', resource)"
      >
        <template #icon>
          <CodeOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="编辑信息">
      <a-button size="small" type="text" aria-label="编辑信息" @click="emit('edit', resource)">
        <template #icon>
          <EditOutlined />
        </template>
      </a-button>
    </a-tooltip>
    <a-tooltip title="删除">
      <a-button
        danger
        size="small"
        type="text"
        aria-label="删除资源"
        @click="emit('delete', resource)"
      >
        <template #icon>
          <DeleteOutlined />
        </template>
      </a-button>
    </a-tooltip>
  </a-space>
</template>

<script setup lang="ts">
import { CodeOutlined, CopyOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons-vue'
import type { AdminResourceItem } from '@ps/shared/resource'

defineProps<{
  resource: AdminResourceItem
}>()

const emit = defineEmits<{
  'copy-markdown': [resource: AdminResourceItem]
  'copy-url': [resource: AdminResourceItem]
  delete: [resource: AdminResourceItem]
  edit: [resource: AdminResourceItem]
}>()
</script>
