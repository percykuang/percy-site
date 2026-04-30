import { ok } from '../utils/api'

export default defineEventHandler(() => {
  return ok({
    ok: true,
    service: 'admin',
    timestamp: new Date().toISOString(),
  })
})
