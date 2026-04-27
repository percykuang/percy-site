import { authenticateAdmin } from '@ps/data-access'
import { loginSchema } from '@ps/shared'

export default defineEventHandler(async (event) => {
  const input = await readValidatedBody(event, loginSchema.parse)
  const user = await authenticateAdmin(input)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  setAdminSessionCookie(event, user.id)

  return {
    ok: true,
    user,
  }
})
