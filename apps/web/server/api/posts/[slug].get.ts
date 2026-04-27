import { getPublishedPostBySlug } from '@ps/data-access'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post slug is required',
    })
  }

  const post = await getPublishedPostBySlug(slug)

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Post not found',
    })
  }

  return post
})
