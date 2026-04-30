import type { PaginatedResult } from './pagination'

export type ResourceType = 'IMAGE' | 'AUDIO' | 'VIDEO' | 'FILE'

export type ResourceStatus = 'READY' | 'PROCESSING' | 'FAILED' | 'DELETED'

export type AdminResourceItem = {
  id: string
  type: ResourceType
  status: ResourceStatus
  storageKey: string
  url: string
  originalFilename: string
  title: string | null
  alt: string | null
  mimeType: string
  extension: string | null
  size: number
  width: number | null
  height: number | null
  durationMs: number | null
  coverUrl: string | null
  referencesCount: number
  createdAt: string
}

export type AdminResourceReference = {
  articleId: string
  articleTitle: string
  refType: 'ARTICLE_CONTENT' | 'ARTICLE_COVER'
}

export type AdminResourcesResponse = PaginatedResult<AdminResourceItem>
