import { CategoryInUseError, CategoryNotFoundError, deleteCategory } from '@ps/data-access'
import { apiError, getRequiredRouteParam, ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  await requireAuth(event)

  const id = getRequiredRouteParam(event, 'id', '分类 id 不能为空')

  try {
    await deleteCategory(id)

    return ok({
      deleted: true,
    })
  } catch (error) {
    if (error instanceof CategoryNotFoundError) {
      throw apiError({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: '分类不存在',
      })
    }

    if (error instanceof CategoryInUseError) {
      throw apiError({
        statusCode: 409,
        code: 'CONFLICT',
        message: '该分类仍被文章使用，不能删除',
      })
    }

    throw error
  }
})
