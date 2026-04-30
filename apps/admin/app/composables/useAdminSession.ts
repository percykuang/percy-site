import type { AdminAuthState } from '@ps/shared/auth'

const sessionStateKey = 'admin-session-state'
const sessionLoadedStateKey = 'admin-session-loaded'
const sessionPendingStateKey = 'admin-session-pending'

let sessionRequest: Promise<AdminAuthState | null> | null = null

export function useAdminSession() {
  const session = useState<AdminAuthState | null>(sessionStateKey, () => null)
  const hasLoaded = useState<boolean>(sessionLoadedStateKey, () => false)
  const pending = useState<boolean>(sessionPendingStateKey, () => false)

  async function fetchSession(force = false) {
    if (!force && hasLoaded.value) {
      return session.value
    }

    if (sessionRequest) {
      return sessionRequest
    }

    pending.value = true
    const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

    sessionRequest = adminApiFetch<AdminAuthState>('/api/auth/me', {
      headers,
    })
      .then((response) => {
        session.value = response
        hasLoaded.value = true

        return response
      })
      .catch((error) => {
        session.value = null
        hasLoaded.value = true
        throw error
      })
      .finally(() => {
        pending.value = false
        sessionRequest = null
      })

    return sessionRequest
  }

  function setSession(value: AdminAuthState | null) {
    session.value = value
    hasLoaded.value = true
  }

  function clearSession() {
    setSession(null)
  }

  return {
    clearSession,
    fetchSession,
    hasLoaded,
    pending,
    session,
    setSession,
  }
}
