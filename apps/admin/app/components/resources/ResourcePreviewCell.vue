<template>
  <button
    v-if="resource.type === 'IMAGE'"
    class="flex size-14 cursor-zoom-in items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50 p-0"
    type="button"
    :aria-label="`放大查看 ${getResourceDisplayName(resource)}`"
    @click="emit('preview', resource)"
  >
    <img
      class="size-full object-cover"
      :src="resource.url"
      :alt="resource.alt || resource.originalFilename"
    />
  </button>
  <div
    v-else
    class="flex size-14 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50"
  >
    <component :is="resourceIcon" class="text-xl text-slate-500" />
  </div>
</template>

<script setup lang="ts">
import {
  FileImageOutlined,
  FileOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons-vue'
import type { AdminResourceItem, ResourceType } from '@ps/shared/resource'
import { getResourceDisplayName } from '../../utils/resource-display'

const props = defineProps<{
  resource: AdminResourceItem
}>()

const emit = defineEmits<{
  preview: [resource: AdminResourceItem]
}>()

const resourceIcon = computed(() => getResourceIcon(props.resource.type))

function getResourceIcon(type: ResourceType) {
  switch (type) {
    case 'IMAGE':
      return FileImageOutlined
    case 'AUDIO':
      return SoundOutlined
    case 'VIDEO':
      return VideoCameraOutlined
    case 'FILE':
      return FileOutlined
  }
}
</script>
