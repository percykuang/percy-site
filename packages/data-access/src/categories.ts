import { prisma } from '@ps/db'
import type { CreateCategoryInput } from '@ps/shared/category'
import { createScopedSlug } from '@ps/shared/utils'

export class CategoryInUseError extends Error {
  constructor() {
    super('Category is still referenced by articles')
    this.name = 'CategoryInUseError'
  }
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super('Category not found')
    this.name = 'CategoryNotFoundError'
  }
}

export function listCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export function upsertCategory(input: CreateCategoryInput) {
  const name = input.name.trim()
  const slug = normalizeCategorySlug(name)

  return prisma.category.upsert({
    where: {
      name,
    },
    update: {
      slug,
    },
    create: {
      name,
      slug,
    },
  })
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!category) {
    throw new CategoryNotFoundError()
  }

  const articlesCount = await prisma.article.count({
    where: {
      categoryId: id,
    },
  })

  if (articlesCount > 0) {
    throw new CategoryInUseError()
  }

  return prisma.category.delete({
    where: {
      id,
    },
  })
}

function normalizeCategorySlug(name: string) {
  return createScopedSlug(name, 'category')
}
