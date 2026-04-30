import { ok } from '../utils/api'

export default defineEventHandler(() => {
  return ok({
    ok: true,
    service: 'web',
    timestamp: new Date().toISOString(),
  })
})
