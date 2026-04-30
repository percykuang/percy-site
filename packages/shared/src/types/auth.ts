export type AdminSessionUser = {
  email: string
}

export type AdminAuthState = {
  authenticated: boolean
  user: AdminSessionUser
}
