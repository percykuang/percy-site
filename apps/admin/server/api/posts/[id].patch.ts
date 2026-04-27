import { updatePost } from '@ps/data-access'
import { updatePostSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')
  const input = await readValidatedBody(event, updatePostSchema.parse)

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post id is required',
    })
  }

  return updatePost(id, input)
})
