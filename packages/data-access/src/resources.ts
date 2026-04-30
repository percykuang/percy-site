import { prisma } from '@ps/db'
import type {
  AdminResourceItem,
  AdminResourceReference,
  ResourceListQueryInput,
  ResourceStatus,
  ResourceType,
  UpdateResourceInput,
} from '@ps/shared/resource'

export class ResourceNotFoundError extends Error {
  constructor() {
    super('Resource not found')
    this.name = 'ResourceNotFoundError'
  }
}

export class ResourceInUseError extends Error {
  constructor() {
    super('Resource is still referenced')
    this.name = 'ResourceInUseError'
  }
}

type CreateResourceRecordInput = {
  alt?: string
  createdById?: string
  extension?: string | null
  mimeType: string
  originalFilename: string
  size: number
  storageKey: string
  title?: string
  type: ResourceType
  url: string
}

type ResourceDbClient = Pick<typeof prisma, 'article' | 'resource' | 'resourceReference'>

const adminResourceSelect = {
  id: true,
  type: true,
  status: true,
  storageKey: true,
  url: true,
  originalFilename: true,
  title: true,
  alt: true,
  mimeType: true,
  extension: true,
  size: true,
  width: true,
  height: true,
  durationMs: true,
  coverUrl: true,
  createdAt: true,
  _count: {
    select: {
      references: true,
    },
  },
} as const

export async function listResources(options: ResourceListQueryInput) {
  const page = options.page
  const pageSize = options.pageSize
  const skip = (page - 1) * pageSize
  const keyword = options.keyword?.trim()

  const where = {
    ...(options.type ? { type: options.type } : {}),
    ...(keyword
      ? {
          OR: [
            {
              originalFilename: {
                contains: keyword,
                mode: 'insensitive' as const,
              },
            },
            {
              title: {
                contains: keyword,
                mode: 'insensitive' as const,
              },
            },
            {
              alt: {
                contains: keyword,
                mode: 'insensitive' as const,
              },
            },
            {
              storageKey: {
                contains: keyword,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {}),
  }

  const [items, total] = await prisma.$transaction([
    prisma.resource.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      select: adminResourceSelect,
      skip,
      take: pageSize,
    }),
    prisma.resource.count({
      where,
    }),
  ])

  return {
    items: items.map(mapAdminResourceItem),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}

export function getResourceById(id: string) {
  return prisma.resource
    .findUnique({
      where: {
        id,
      },
      select: adminResourceSelect,
    })
    .then((resource) => (resource ? mapAdminResourceItem(resource) : null))
}

export function createResourceRecord(input: CreateResourceRecordInput) {
  return prisma.resource
    .create({
      data: {
        ...(input.alt ? { alt: input.alt.trim() } : {}),
        ...(input.createdById
          ? {
              createdBy: {
                connect: {
                  id: input.createdById,
                },
              },
            }
          : {}),
        extension: input.extension ?? null,
        mimeType: input.mimeType,
        originalFilename: input.originalFilename,
        size: input.size,
        storageKey: input.storageKey,
        title: normalizeOptionalText(input.title),
        type: input.type,
        url: input.url,
      },
      select: adminResourceSelect,
    })
    .then(mapAdminResourceItem)
}

export async function updateResource(id: string, input: UpdateResourceInput) {
  const existingResource = await prisma.resource.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingResource) {
    throw new ResourceNotFoundError()
  }

  return prisma.resource
    .update({
      where: {
        id,
      },
      data: {
        ...(input.alt === undefined ? {} : { alt: normalizeOptionalText(input.alt) }),
        ...(input.title === undefined ? {} : { title: normalizeOptionalText(input.title) }),
      },
      select: adminResourceSelect,
    })
    .then(mapAdminResourceItem)
}

export async function deleteResource(id: string) {
  const existingResource = await prisma.resource.findUnique({
    where: {
      id,
    },
    select: {
      _count: {
        select: {
          references: true,
        },
      },
      id: true,
      storageKey: true,
      url: true,
    },
  })

  if (!existingResource) {
    throw new ResourceNotFoundError()
  }

  if (existingResource._count.references > 0) {
    throw new ResourceInUseError()
  }

  return prisma.resource.delete({
    where: {
      id,
    },
    select: {
      id: true,
      storageKey: true,
      url: true,
    },
  })
}

export async function listResourceReferences(
  resourceId: string,
): Promise<AdminResourceReference[]> {
  const references = await prisma.resourceReference.findMany({
    where: {
      resourceId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      refId: true,
      refType: true,
    },
  })

  if (references.length === 0) {
    return []
  }

  const articleIds = Array.from(
    new Set(references.map((reference) => reference.refId).filter((refId) => refId.length > 0)),
  )

  const articles = await prisma.article.findMany({
    where: {
      id: {
        in: articleIds,
      },
    },
    select: {
      id: true,
      title: true,
    },
  })

  const articleMap = new Map(articles.map((article) => [article.id, article.title]))

  return references
    .map((reference) => {
      const articleTitle = articleMap.get(reference.refId)

      if (!articleTitle) {
        return null
      }

      return {
        articleId: reference.refId,
        articleTitle,
        refType: reference.refType,
      }
    })
    .filter((reference): reference is AdminResourceReference => reference !== null)
}

export async function syncArticleResourceReferences(
  options: {
    articleId: string
    content: string
  },
  db: ResourceDbClient = prisma,
) {
  const urls = extractMarkdownImageUrls(options.content)
  const resources =
    urls.length > 0
      ? await db.resource.findMany({
          where: {
            url: {
              in: urls,
            },
          },
          select: {
            id: true,
          },
        })
      : []

  await db.resourceReference.deleteMany({
    where: {
      refId: options.articleId,
      refType: 'ARTICLE_CONTENT',
    },
  })

  if (resources.length === 0) {
    return
  }

  await db.resourceReference.createMany({
    data: resources.map((resource) => ({
      refId: options.articleId,
      refType: 'ARTICLE_CONTENT' as const,
      resourceId: resource.id,
    })),
    skipDuplicates: true,
  })
}

export function deleteArticleResourceReferences(articleId: string, db: ResourceDbClient = prisma) {
  return db.resourceReference.deleteMany({
    where: {
      refId: articleId,
      refType: {
        in: ['ARTICLE_CONTENT', 'ARTICLE_COVER'],
      },
    },
  })
}

function extractMarkdownImageUrls(markdown: string) {
  const urls = new Set<string>()
  const imagePattern = /!\[[^\]]*]\((?:<)?([^)\s>]+)(?:>)?(?:\s+["'][^"']*["'])?\)/g

  for (const match of markdown.matchAll(imagePattern)) {
    const url = match[1]?.trim()

    if (url) {
      urls.add(url)
    }
  }

  return [...urls]
}

function mapAdminResourceItem(resource: {
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
  createdAt: Date
  _count: {
    references: number
  }
}): AdminResourceItem {
  return {
    alt: resource.alt,
    coverUrl: resource.coverUrl,
    createdAt: resource.createdAt.toISOString(),
    durationMs: resource.durationMs,
    extension: resource.extension,
    height: resource.height,
    id: resource.id,
    mimeType: resource.mimeType,
    originalFilename: resource.originalFilename,
    referencesCount: resource._count.references,
    size: resource.size,
    status: resource.status,
    storageKey: resource.storageKey,
    title: resource.title,
    type: resource.type,
    url: resource.url,
    width: resource.width,
  }
}

function normalizeOptionalText(value?: string | null) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}
