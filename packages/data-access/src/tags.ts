import { prisma } from '@ps/db'
import type { CreateTagInput } from '@ps/shared/tag'
import { createScopedSlug } from '@ps/shared/utils'

export class TagNotFoundError extends Error {
  constructor() {
    super('Tag not found')
    this.name = 'TagNotFoundError'
  }
}

export function listTags() {
  return prisma.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export function createTag(input: CreateTagInput) {
  const name = input.name.trim()
  const slug = normalizeTagSlug(name)

  return prisma.tag.upsert({
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

export async function deleteTag(id: string) {
  const tag = await prisma.tag.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
    },
  })

  if (!tag) {
    throw new TagNotFoundError()
  }

  return prisma.tag.delete({
    where: {
      id,
    },
  })
}

function normalizeTagSlug(name: string) {
  return createScopedSlug(name, 'tag')
}
