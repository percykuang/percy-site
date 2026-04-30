import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

const sessionCookieName = 'ps_admin_session'
const sessionMaxAge = 60 * 60 * 24 * 7
const minimumSessionSecretLength = 32
const weakSessionSecrets = new Set(['change-me', 'dev-session-secret'])

function normalizeSessionSecret(secret: string | undefined) {
  return secret?.trim() ?? ''
}

function isWeakSessionSecret(secret: string) {
  return secret.length < minimumSessionSecretLength || weakSessionSecrets.has(secret)
}

function getSessionSecret(event: H3Event) {
  const config = useRuntimeConfig(event)
  const secret = normalizeSessionSecret(config.sessionSecret || process.env.NUXT_SESSION_SECRET)

  if (secret) {
    if (process.env.NODE_ENV === 'production' && isWeakSessionSecret(secret)) {
      throw createError({
        statusCode: 500,
        statusMessage: 'NUXT_SESSION_SECRET is too weak for production',
      })
    }

    return secret
  }

  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_SESSION_SECRET is required',
    })
  }

  return 'dev-session-secret'
}

function signSessionPayload(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function setAdminSessionCookie(event: H3Event, userId: string) {
  const expiresAt = Date.now() + sessionMaxAge * 1000
  const payload = `${userId}.${expiresAt}`
  const signature = signSessionPayload(payload, getSessionSecret(event))

  setCookie(event, sessionCookieName, `${payload}.${signature}`, {
    httpOnly: true,
    maxAge: sessionMaxAge,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })
}

export function clearAdminSessionCookie(event: H3Event) {
  deleteCookie(event, sessionCookieName, {
    path: '/',
  })
}

export function verifyAdminSessionCookie(event: H3Event) {
  const session = getCookie(event, sessionCookieName)

  if (!session) {
    return null
  }

  const [userId, expiresAtValue, signature] = session.split('.')

  if (!userId || !expiresAtValue || !signature) {
    return null
  }

  const expiresAt = Number(expiresAtValue)

  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
    return null
  }

  const payload = `${userId}.${expiresAtValue}`
  const expectedSignature = signSessionPayload(payload, getSessionSecret(event))
  const actualSignatureBuffer = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  if (actualSignatureBuffer.length !== expectedSignatureBuffer.length) {
    return null
  }

  if (!timingSafeEqual(actualSignatureBuffer, expectedSignatureBuffer)) {
    return null
  }

  return {
    userId,
    expiresAt,
  }
}
