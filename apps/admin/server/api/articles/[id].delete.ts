import { deleteArticle } from '@ps/data-access'
import { ArticleNotFoundError } from '@ps/data-access'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '文章 id 不能为空')

  try {
    await deleteArticle(id)

    return ok({
      deleted: true,
    })
  } catch (error) {
    if (error instanceof ArticleNotFoundError) {
      throw apiError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '文章不存在',
      })
    }

    throw error
  }
})
