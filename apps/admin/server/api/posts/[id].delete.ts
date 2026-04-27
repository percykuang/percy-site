import { deletePost } from '@ps/data-access'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post id is required',
    })
  }

  return deletePost(id)
})
