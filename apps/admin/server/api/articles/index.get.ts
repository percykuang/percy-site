import { listAdminArticles } from '@ps/data-access'
import { paginationQuerySchema } from '@ps/shared/pagination'
import { ok, readValidatedQueryWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = readValidatedQueryWithSchema(event, paginationQuerySchema)

  return ok(await listAdminArticles(query))
})
