import { ResourceNotFoundError, updateResource } from '@ps/data-access'
import { updateResourceSchema } from '@ps/shared/resource'
import { apiError, getRequiredRouteParam, ok, readValidatedBodyWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '资源 id 不能为空')
  const input = await readValidatedBodyWithSchema(event, updateResourceSchema)

  try {
    return ok(await updateResource(id, input))
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw apiError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '资源不存在',
      })
    }

    throw error
  }
})
