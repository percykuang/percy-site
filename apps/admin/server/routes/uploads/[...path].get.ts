import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { extname, resolve, sep } from 'node:path'
import type { H3Event } from 'h3'
import { createError, getRequestURL, sendStream, setHeader } from 'h3'

const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.flac': 'audio/flac',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.m4a': 'audio/mp4',
  '.md': 'text/markdown; charset=utf-8',
  '.mov': 'video/quicktime',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ogg': 'audio/ogg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.webp': 'image/webp',
  '.zip': 'application/zip',
}

export default defineEventHandler(async (event) => {
  const storageKey = getStorageKeyFromRequest(event)
  const uploadsRoot = resolve(useRuntimeConfig().uploadsDir)
  const filePath = resolve(uploadsRoot, storageKey)

  if (filePath !== uploadsRoot && !filePath.startsWith(`${uploadsRoot}${sep}`)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid upload path',
    })
  }

  const fileStat = await stat(filePath).catch(() => null)

  if (!fileStat?.isFile()) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Upload not found',
    })
  }

  const contentType = contentTypes[extname(filePath).toLowerCase()]

  if (contentType) {
    setHeader(event, 'Content-Type', contentType)
  }

  setHeader(event, 'Content-Length', fileStat.size)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, createReadStream(filePath))
})

function getStorageKeyFromRequest(event: H3Event) {
  const pathname = getRequestURL(event).pathname
  const prefix = '/uploads/'

  if (!pathname.startsWith(prefix)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Upload not found',
    })
  }

  let storageKey: string

  try {
    storageKey = decodeURIComponent(pathname.slice(prefix.length))
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid upload path',
    })
  }

  if (
    !storageKey ||
    storageKey.startsWith('/') ||
    storageKey.includes('..') ||
    storageKey.includes('\\')
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid upload path',
    })
  }

  return storageKey
}
