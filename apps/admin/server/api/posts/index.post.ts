import { createPost } from '@ps/data-access'
import { createPostSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const input = await readValidatedBody(event, createPostSchema.parse)

  return createPost(input)
})
