import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1).max(140),
  slug: z.string().min(1).max(140),
  excerpt: z.string().min(1).max(300),
  content: z.string().min(1),
  coverImage: z.url().optional(),
  published: z.boolean().default(false),
  publishedAt: z.coerce.date().optional(),
})

export const updatePostSchema = createPostSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
