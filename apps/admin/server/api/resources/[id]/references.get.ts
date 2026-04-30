import { listResourceReferences } from '@ps/data-access'
import { getRequiredRouteParam, ok } from '../../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '资源 id 不能为空')

  return ok(await listResourceReferences(id))
})
