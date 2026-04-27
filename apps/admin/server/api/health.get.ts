export default defineEventHandler(() => {
  return {
    ok: true,
    service: 'admin',
    timestamp: new Date().toISOString(),
  }
})
