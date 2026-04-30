import { createArticle } from '@ps/data-access'
import { createArticleSchema } from '@ps/shared/article'
import { ok, readValidatedBodyWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const input = await readValidatedBodyWithSchema(event, createArticleSchema)

  return ok(await createArticle(input))
})
