export default defineEventHandler(async (event) => {
  await requireAuth(event)

  return {
    siteName: 'Percy Site',
  }
})
