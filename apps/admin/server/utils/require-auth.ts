import type { H3Event } from 'h3'
import { getAdminUserById } from '@ps/data-access'

export async function requireAuth(event: H3Event) {
  const session = verifyAdminSessionCookie(event)

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const user = await getAdminUserById(session.userId)

  if (!user) {
    clearAdminSessionCookie(event)

    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return user
}
