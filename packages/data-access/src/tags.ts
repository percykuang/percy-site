import { prisma } from '@ps/db'
import type { CreateTagInput, UpdateTagInput } from '@ps/shared'

export function listTags() {
  return prisma.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  })
}

export function createTag(input: CreateTagInput) {
  return prisma.tag.create({
    data: input,
  })
}

export function updateTag(id: string, input: UpdateTagInput) {
  return prisma.tag.update({
    where: {
      id,
    },
    data: input,
  })
}

export function deleteTag(id: string) {
  return prisma.tag.delete({
    where: {
      id,
    },
  })
}
