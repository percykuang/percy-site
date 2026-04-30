import { randomUUID } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import { dirname, extname, join } from 'node:path'
import type { ResourceType } from '@ps/shared/resource'

type ResourceUploadSpec = {
  type: ResourceType
  directory: string
  extensions: string[]
  mimeTypes: string[]
  maxSize: number
}

export type StoredResourceFile = {
  extension: string | null
  mimeType: string
  size: number
  storageKey: string
  type: ResourceType
  url: string
}

const mb = 1024 * 1024

const resourceUploadSpecs: ResourceUploadSpec[] = [
  {
    type: 'IMAGE',
    directory: 'images',
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'],
    maxSize: 10 * mb,
  },
  {
    type: 'AUDIO',
    directory: 'audio',
    extensions: ['mp3', 'm4a', 'wav', 'ogg', 'flac'],
    mimeTypes: ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/flac'],
    maxSize: 30 * mb,
  },
  {
    type: 'VIDEO',
    directory: 'videos',
    extensions: ['mp4', 'webm', 'mov'],
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    maxSize: 100 * mb,
  },
  {
    type: 'FILE',
    directory: 'files',
    extensions: ['pdf', 'txt', 'md', 'zip'],
    mimeTypes: [
      'application/pdf',
      'application/zip',
      'application/x-zip-compressed',
      'text/plain',
      'text/markdown',
    ],
    maxSize: 20 * mb,
  },
]

const mimeTypeToSpec = new Map(
  resourceUploadSpecs.flatMap((spec) =>
    spec.mimeTypes.map((mimeType) => [mimeType, spec] as const),
  ),
)

const extensionToSpec = new Map(
  resourceUploadSpecs.flatMap((spec) =>
    spec.extensions.map((extension) => [extension, spec] as const),
  ),
)

export class ResourceUploadValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ResourceUploadValidationError'
  }
}

export async function storeUploadedResource(file: File): Promise<StoredResourceFile> {
  const { extension, mimeType, spec } = resolveUploadSpec(file)

  if (file.size <= 0) {
    throw new ResourceUploadValidationError('上传文件不能为空')
  }

  if (file.size > spec.maxSize) {
    throw new ResourceUploadValidationError(
      `${getResourceTypeLabel(spec.type)}文件大小不能超过 ${Math.floor(spec.maxSize / mb)}MB`,
    )
  }

  const now = new Date()
  const year = String(now.getFullYear())
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const filename = `${randomUUID()}${extension ? `.${extension}` : ''}`
  const storageKey = `${spec.directory}/${year}/${month}/${filename}`
  const absolutePath = getAbsoluteStoragePath(storageKey)

  await mkdir(dirname(absolutePath), {
    recursive: true,
  })

  const fileBuffer = Buffer.from(await file.arrayBuffer())

  await writeFile(absolutePath, fileBuffer)

  return {
    extension,
    mimeType,
    size: file.size,
    storageKey,
    type: spec.type,
    url: `/uploads/${storageKey}`,
  }
}

export async function deleteStoredResource(storageKey: string) {
  const absolutePath = getAbsoluteStoragePath(storageKey)

  try {
    await unlink(absolutePath)
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return
    }

    throw error
  }
}

function resolveUploadSpec(file: File) {
  const normalizedMimeType = file.type.trim().toLowerCase()
  const extension = normalizeExtension(extname(file.name))
  const spec =
    mimeTypeToSpec.get(normalizedMimeType) ||
    (normalizedMimeType === '' || normalizedMimeType === 'application/octet-stream'
      ? extensionToSpec.get(extension ?? '')
      : undefined)

  if (!spec) {
    throw new ResourceUploadValidationError('暂不支持该文件类型上传')
  }

  const fallbackMimeType = spec.mimeTypes[0]

  if (!fallbackMimeType) {
    throw new ResourceUploadValidationError('暂不支持该文件类型上传')
  }

  return {
    extension: extension ?? spec.extensions[0] ?? null,
    mimeType: normalizedMimeType || fallbackMimeType,
    spec,
  }
}

function getAbsoluteStoragePath(storageKey: string) {
  if (
    !storageKey ||
    storageKey.startsWith('/') ||
    storageKey.includes('..') ||
    storageKey.includes('\\')
  ) {
    throw new Error('Invalid storage key')
  }

  const runtimeConfig = useRuntimeConfig()

  return join(runtimeConfig.uploadsDir, storageKey)
}

function normalizeExtension(value: string) {
  const normalizedValue = value.replace(/^\./, '').trim().toLowerCase()

  return normalizedValue ? normalizedValue : null
}

function getResourceTypeLabel(type: ResourceType) {
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

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error
}
