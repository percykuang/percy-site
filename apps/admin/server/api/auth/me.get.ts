import { ok } from '../../utils/api'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  return ok({
    authenticated: true,
    user,
  })
})
