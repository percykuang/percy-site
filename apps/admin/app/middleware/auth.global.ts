export default defineNuxtRouteMiddleware(async (to) => {
  const { fetchSession } = useAdminSession()

  try {
    await fetchSession(true)

    if (to.path === '/login' || to.path === '/') {
      return navigateTo('/articles')
    }
  } catch {
    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})
