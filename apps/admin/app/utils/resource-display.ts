import type { AdminResourceItem, ResourceType } from '@ps/shared/resource'

export function getResourceDisplayName(resource: AdminResourceItem) {
  return resource.title || resource.originalFilename
}

export function formatResourceTableText(value: string | null | undefined) {
  return value?.trim() || '--'
}

export function getResourceTypeLabel(type: ResourceType) {
  switch (type) {
    case 'IMAGE':
      return '图片'
    case 'AUDIO':
      return '音频'
    case 'VIDEO':
      return '视频'
    case 'FILE':
      return '文件'
  }
}

export function getResourceTypeColor(type: ResourceType) {
  switch (type) {
    case 'IMAGE':
      return 'blue'
    case 'AUDIO':
      return 'green'
    case 'VIDEO':
      return 'purple'
    case 'FILE':
      return undefined
  }
}

export function formatResourceFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

export function formatResourceDate(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}
