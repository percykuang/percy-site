import { upsertCategory } from '@ps/data-access'
import { createCategorySchema } from '@ps/shared/category'
import { ok, readValidatedBodyWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const input = await readValidatedBodyWithSchema(event, createCategorySchema)

  return ok(await upsertCategory(input))
})
