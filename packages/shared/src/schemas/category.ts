import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().trim().min(1).max(80),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
