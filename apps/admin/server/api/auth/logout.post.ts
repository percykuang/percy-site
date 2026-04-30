import { ok } from '../../utils/api'

export default defineEventHandler((event) => {
  clearAdminSessionCookie(event)

  return ok({
    ok: true,
  })
})
