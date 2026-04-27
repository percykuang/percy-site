import { prisma } from '@ps/db'
import type { CreatePostInput, UpdatePostInput } from '@ps/shared'

const publicPostSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} as const

export function listPublishedPosts() {
  return prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    select: publicPostSelect,
  })
}

export function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    select: publicPostSelect,
  })
}

export function listAdminPosts() {
  return prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export function createPost(input: CreatePostInput) {
  return prisma.post.create({
    data: input,
  })
}

export function updatePost(id: string, input: UpdatePostInput) {
  return prisma.post.update({
    where: {
      id,
    },
    data: input,
  })
}

export function deletePost(id: string) {
  return prisma.post.delete({
    where: {
      id,
    },
  })
}
