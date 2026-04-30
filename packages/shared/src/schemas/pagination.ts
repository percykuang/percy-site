import { z } from 'zod'

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  pageSize: z.coerce.number().int().min(1).max(50).catch(10),
})

export type PaginationQueryInput = z.infer<typeof paginationQuerySchema>
