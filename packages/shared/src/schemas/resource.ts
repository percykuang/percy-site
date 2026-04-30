import { z } from 'zod'
import { paginationQuerySchema } from './pagination'

export const resourceTypeSchema = z.enum(['IMAGE', 'AUDIO', 'VIDEO', 'FILE'])

export const resourceStatusSchema = z.enum(['READY', 'PROCESSING', 'FAILED', 'DELETED'])

export const updateResourceSchema = z.object({
  alt: z.string().trim().max(160).optional(),
  title: z.string().trim().max(160).optional(),
})

export const resourceListQuerySchema = paginationQuerySchema.extend({
  keyword: z.string().trim().max(120).optional().catch(undefined),
  type: resourceTypeSchema.optional().catch(undefined),
})

export type ResourceTypeInput = z.infer<typeof resourceTypeSchema>
export type ResourceStatusInput = z.infer<typeof resourceStatusSchema>
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>
export type ResourceListQueryInput = z.infer<typeof resourceListQuerySchema>
