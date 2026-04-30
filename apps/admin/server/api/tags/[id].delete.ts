import { TagNotFoundError, deleteTag } from '@ps/data-access'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '标签 id 不能为空')

  try {
    await deleteTag(id)

    return ok({
      deleted: true,
    })
  } catch (error) {
    if (error instanceof TagNotFoundError) {
      throw apiError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '标签不存在',
      })
    }

    throw error
  }
})
