import { listCategories } from '@ps/data-access'
import { ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return ok(await listCategories())
})
