export default defineNuxtRouteMiddleware(async (to) => {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  try {
    await $fetch('/api/auth/me', {
      headers,
    })

    if (to.path === '/login') {
      return navigateTo('/')
    }
  } catch {
    if (to.path !== '/login') {
      return navigateTo('/login')
    }
  }
})
