import { createContactMessage } from '@ps/data-access'
import { createContactMessageSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  const input = await readValidatedBody(event, createContactMessageSchema.parse)

  return createContactMessage(input)
})
