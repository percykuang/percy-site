import { createTag } from '@ps/data-access'
import { createTagSchema } from '@ps/shared/tag'
import { ok, readValidatedBodyWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const input = await readValidatedBodyWithSchema(event, createTagSchema)

  return ok(await createTag(input))
})
