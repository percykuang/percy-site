import { ResourceInUseError, ResourceNotFoundError, deleteResource } from '@ps/data-access'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'
import { deleteStoredResource } from '../../utils/resource-storage'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '资源 id 不能为空')

  try {
    const deletedResource = await deleteResource(id)

    await deleteStoredResource(deletedResource.storageKey)

    return ok({
      deleted: true,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      throw apiError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '资源不存在',
      })
    }

    if (error instanceof ResourceInUseError) {
      throw apiError({
        statusCode: 409,
        code: 'CONFLICT',
        message: '该资源仍被文章引用，不能删除',
      })
    }

    throw error
  }
})
