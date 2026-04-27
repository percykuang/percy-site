export default defineEventHandler(() => {
  return {
    ok: true,
    service: 'web',
    timestamp: new Date().toISOString(),
  }
})
