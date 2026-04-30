<template>
  <a-modal
    :open="open"
    centered
    title="编辑资源信息"
    :confirm-loading="confirmLoading"
    ok-text="保存"
    cancel-text="取消"
    @ok="submit"
    @update:open="emit('update:open', $event)"
  >
    <a-form class="pt-2" layout="vertical" :model="form">
      <a-form-item label="文件名">
        <a-input
          v-model:value="form.title"
          allow-clear
          :maxlength="160"
          placeholder="用于后台识别资源，留空则使用原文件名"
        />
      </a-form-item>
      <a-form-item v-if="resource?.type === 'IMAGE'" label="描述">
        <a-input
          v-model:value="form.alt"
          allow-clear
          :maxlength="160"
          placeholder="用于图片 alt 文本，建议描述图片内容"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import type { AdminResourceItem, UpdateResourceInput } from '@ps/shared/resource'

const props = defineProps<{
  confirmLoading: boolean
  open: boolean
  resource: AdminResourceItem | null
}>()

const emit = defineEmits<{
  save: [input: UpdateResourceInput]
  'update:open': [open: boolean]
}>()

const form = reactive<UpdateResourceInput>({
  alt: '',
  title: '',
})

watch(
  () => [props.open, props.resource] as const,
  ([open, resource]) => {
    if (!open || !resource) {
      return
    }

    form.alt = resource.alt ?? ''
    form.title = resource.title ?? ''
  },
  {
    immediate: true,
  },
)

function submit() {
  emit('save', {
    ...(props.resource?.type === 'IMAGE' ? { alt: form.alt } : {}),
    title: form.title,
  })
}
</script>
