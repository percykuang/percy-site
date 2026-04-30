import { z } from 'zod'

const articleTagSchema = z.object({
  name: z.string().trim().min(1).max(60),
  slug: z.string().trim().min(1).max(80),
})

export const createArticleSchema = z.object({
  title: z.string().trim().min(1).max(140),
  category: z.string().trim().min(1).max(80).default('前端工程'),
  excerpt: z.string().trim().min(1).max(300),
  content: z.string().min(1),
  tags: z.array(articleTagSchema).default([]),
  wordCount: z.number().int().nonnegative().default(0),
  publishedAt: z.coerce.date().optional(),
})

export const updateArticleSchema = createArticleSchema.partial()

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
