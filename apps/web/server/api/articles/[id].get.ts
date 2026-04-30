import { getPublishedArticleById } from '@ps/data-access'
import { renderMarkdownToHtml } from '../../utils/markdown'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  const id = getRequiredRouteParam(event, 'id', '文章 id 不能为空')

  const article = await getPublishedArticleById(id)

  if (!article) {
    throw apiError({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: '文章不存在',
    })
  }

  const contentHtml = await renderMarkdownToHtml(article.content)

  return ok({
    ...article,
    contentHtml,
  })
})
