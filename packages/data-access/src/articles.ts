import { prisma } from '@ps/db'
import {
  countWords,
  createArticleId,
  type CreateArticleInput,
  type UpdateArticleInput,
} from '@ps/shared/article'
import type { PaginationQueryInput } from '@ps/shared/pagination'
import { createScopedSlug } from '@ps/shared/utils'

export class ArticleNotFoundError extends Error {
  constructor() {
    super('Article not found')
    this.name = 'ArticleNotFoundError'
  }
}

type ArticleCategoryRecord = {
  id: string
  name: string
  slug: string
}

type ArticleTagRecord = {
  id?: string
  name: string
  slug: string
}

type BaseArticleRecord = {
  id: string
  title: string
  category: ArticleCategoryRecord
  excerpt: string
  wordCount: number
  publishedAt: Date | null
  tags: ArticleTagRecord[]
  createdAt: Date
}

type ArticleDetailRecord = BaseArticleRecord & {
  content: string
}

const publicArticleSelect = {
  id: true,
  title: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  excerpt: true,
  wordCount: true,
  publishedAt: true,
  tags: {
    select: {
      name: true,
      slug: true,
    },
  },
  createdAt: true,
} as const

const publicArticleDetailSelect = {
  ...publicArticleSelect,
  content: true,
} as const

const adminArticleListSelect = publicArticleSelect

const adminArticleDetailSelect = {
  ...publicArticleDetailSelect,
  tags: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
} as const

export function listPublishedArticles() {
  return prisma.article
    .findMany({
      where: {
        published: true,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      select: publicArticleSelect,
    })
    .then((articles) => articles.map(mapArticleListItem))
}

export function getPublishedArticleById(id: string) {
  return prisma.article
    .findFirst({
      where: {
        id,
        published: true,
      },
      select: publicArticleDetailSelect,
    })
    .then((article) => (article ? mapArticleDetail(article) : null))
}

export async function listAdminArticles(options: PaginationQueryInput) {
  const page = options.page
  const pageSize = options.pageSize
  const skip = (page - 1) * pageSize

  const [items, total] = await prisma.$transaction([
    prisma.article.findMany({
      orderBy: {
        publishedAt: 'desc',
      },
      select: adminArticleListSelect,
      skip,
      take: pageSize,
    }),
    prisma.article.count(),
  ])

  return {
    items: items.map(mapArticleListItem),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}

export function getAdminArticleById(id: string) {
  return prisma.article
    .findUnique({
      where: {
        id,
      },
      select: adminArticleDetailSelect,
    })
    .then((article) => (article ? mapAdminArticleDetail(article) : null))
}

export async function createArticle(input: CreateArticleInput) {
  const id = createArticleId()
  const category = await upsertArticleCategory(input.category)
  const tags = await upsertArticleTags(input.tags)

  return prisma.article
    .create({
      data: {
        category: {
          connect: {
            id: category.id,
          },
        },
        content: input.content,
        excerpt: input.excerpt,
        id,
        published: true,
        publishedAt: input.publishedAt ?? new Date(),
        slug: id,
        tags: {
          connect: tags,
        },
        title: input.title,
        wordCount: input.wordCount || countWords(input.content),
      },
      select: adminArticleDetailSelect,
    })
    .then(mapAdminArticleDetail)
}

export async function updateArticle(id: string, input: UpdateArticleInput) {
  const existingArticle = await prisma.article.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!existingArticle) {
    throw new ArticleNotFoundError()
  }

  const { tags: inputTags, category: inputCategory, ...articleInput } = input
  const category = inputCategory ? await upsertArticleCategory(inputCategory) : undefined
  const tags = inputTags ? await upsertArticleTags(inputTags) : undefined
  const wordCount = input.wordCount || (input.content ? countWords(input.content) : input.wordCount)

  return prisma.article
    .update({
      where: {
        id,
      },
      data: {
        ...articleInput,
        ...(category === undefined
          ? {}
          : {
              category: {
                connect: {
                  id: category.id,
                },
              },
            }),
        ...(wordCount === undefined ? {} : { wordCount }),
        ...(tags === undefined
          ? {}
          : {
              tags: {
                set: tags,
              },
            }),
      },
      select: adminArticleDetailSelect,
    })
    .then(mapAdminArticleDetail)
}

export function deleteArticle(id: string) {
  return prisma.article
    .findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    })
    .then((article) => {
      if (!article) {
        throw new ArticleNotFoundError()
      }

      return prisma.article.delete({
        where: {
          id,
        },
      })
    })
}

async function upsertArticleCategory(name: string) {
  const categoryName = name.trim()
  const slug = createScopedSlug(categoryName, 'category')

  return prisma.category.upsert({
    where: {
      name: categoryName,
    },
    update: {
      slug,
    },
    create: {
      name: categoryName,
      slug,
    },
  })
}

async function upsertArticleTags(tags: CreateArticleInput['tags']) {
  const normalizedTags = tags.map((tag, index) => ({
    name: tag.name,
    slug: createScopedSlug(tag.slug, 'tag', index + 1),
  }))

  await prisma.$transaction(
    normalizedTags.map((tag) =>
      prisma.tag.upsert({
        where: {
          name: tag.name,
        },
        update: {
          slug: tag.slug,
        },
        create: tag,
      }),
    ),
  )

  return normalizedTags.map((tag) => ({
    slug: tag.slug,
  }))
}

function mapArticleListItem(article: BaseArticleRecord) {
  return {
    id: article.id,
    title: article.title,
    category: article.category.name,
    excerpt: article.excerpt,
    wordCount: article.wordCount,
    publishedAt: article.publishedAt,
    tags: article.tags.map((tag) => ({
      name: tag.name,
      slug: tag.slug,
    })),
    createdAt: article.createdAt,
  }
}

function mapArticleDetail(article: ArticleDetailRecord) {
  return {
    ...mapArticleListItem(article),
    content: article.content,
  }
}

function mapAdminArticleDetail(article: ArticleDetailRecord) {
  return {
    ...mapArticleDetail(article),
    tags: article.tags.map((tag) => ({
      id: tag.id ?? '',
      name: tag.name,
      slug: tag.slug,
    })),
  }
}
