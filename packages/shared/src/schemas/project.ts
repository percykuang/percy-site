import { z } from 'zod'

export const projectCategorySchema = z.enum([
  'WEB_APP',
  'OPEN_SOURCE',
  'UI_EXPERIMENT',
  'AI',
  'TOOLING',
])

export const createProjectSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  summary: z.string().min(1).max(300),
  content: z.string().min(1),
  coverImage: z.url().optional(),
  category: projectCategorySchema.default('WEB_APP'),
  techStack: z.array(z.string().min(1)).default([]),
  demoUrl: z.url().optional(),
  repoUrl: z.url().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export type ProjectCategory = z.infer<typeof projectCategorySchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
