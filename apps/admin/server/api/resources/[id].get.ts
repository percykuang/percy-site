import { getResourceById } from '@ps/data-access'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '资源 id 不能为空')
  const resource = await getResourceById(id)

  if (!resource) {
    throw apiError({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: '资源不存在',
    })
  }

  return ok(resource)
})
