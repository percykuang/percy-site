import { ArticleNotFoundError, updateArticle } from '@ps/data-access'
import { updateArticleSchema } from '@ps/shared/article'
import { apiError, getRequiredRouteParam, ok, readValidatedBodyWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '文章 id 不能为空')
  const input = await readValidatedBodyWithSchema(event, updateArticleSchema)

  try {
    return ok(await updateArticle(id, input))
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
