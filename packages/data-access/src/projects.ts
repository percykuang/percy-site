import { prisma } from '@ps/db'
import type { CreateProjectInput, UpdateProjectInput } from '@ps/shared'

const publicProjectSelect = {
  id: true,
  title: true,
  slug: true,
  summary: true,
  content: true,
  coverImage: true,
  category: true,
  techStack: true,
  demoUrl: true,
  repoUrl: true,
  featured: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
} as const

export function listPublishedProjects() {
  return prisma.project.findMany({
    where: {
      published: true,
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: publicProjectSelect,
  })
}

export function getPublishedProjectBySlug(slug: string) {
  return prisma.project.findFirst({
    where: {
      slug,
      published: true,
    },
    select: publicProjectSelect,
  })
}

export function listAdminProjects() {
  return prisma.project.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export function createProject(input: CreateProjectInput) {
  return prisma.project.create({
    data: input,
  })
}

export function updateProject(id: string, input: UpdateProjectInput) {
  return prisma.project.update({
    where: {
      id,
    },
    data: input,
  })
}

export function deleteProject(id: string) {
  return prisma.project.delete({
    where: {
      id,
    },
  })
}
