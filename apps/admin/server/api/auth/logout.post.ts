export default defineEventHandler((event) => {
  clearAdminSessionCookie(event)

  return {
    ok: true,
  }
})
