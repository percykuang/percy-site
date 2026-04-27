import { z } from 'zod'

export const createContactMessageSchema = z.object({
  name: z.string().min(1).max(80),
  email: z.email(),
  subject: z.string().min(1).max(120),
  message: z.string().min(1).max(4000),
})

export type CreateContactMessageInput = z.infer<typeof createContactMessageSchema>
