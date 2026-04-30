import type { H3Event } from 'h3'
import { getAdminUserById } from '@ps/data-access'
import { apiError } from './api'

export async function requireAuth(event: H3Event) {
  const session = verifyAdminSessionCookie(event)

  if (!session) {
    throw apiError({
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message: '未登录或登录已失效',
    })
  }

  const user = await getAdminUserById(session.userId)

  if (!user) {
    clearAdminSessionCookie(event)

    throw apiError({
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message: '未登录或登录已失效',
    })
  }

  return user
}
