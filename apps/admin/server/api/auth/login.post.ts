import { authenticateAdmin } from '@ps/data-access'
import { loginSchema } from '@ps/shared/auth'
import { apiError, ok, readValidatedBodyWithSchema } from '../../utils/api'

export default defineEventHandler(async (event) => {
  const input = await readValidatedBodyWithSchema(event, loginSchema)
  const user = await authenticateAdmin(input)

  if (!user) {
    throw apiError({
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message: '邮箱或密码不正确',
    })
  }

  setAdminSessionCookie(event, user.id)

  return ok({
    authenticated: true,
    user,
  })
})
