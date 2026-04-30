import { getAdminArticleById } from '@ps/data-access'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '文章 id 不能为空')

  const article = await getAdminArticleById(id)

  if (!article) {
    throw apiError({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: '文章不存在',
    })
  }

  return ok(article)
})
