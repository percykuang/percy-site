import { listResources } from '@ps/data-access'
import { resourceListQuerySchema } from '@ps/shared/resource'
import { ok, readValidatedQueryWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const query = readValidatedQueryWithSchema(event, resourceListQuerySchema)

  return ok(await listResources(query))
})
