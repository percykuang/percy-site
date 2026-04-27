import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'

const keyLength = 64
const saltLength = 16
const scryptOptions = {
  N: 16384,
  r: 8,
  p: 1,
}

export function hashPassword(password: string) {
  const salt = randomBytes(saltLength).toString('base64url')
  const key = scryptSync(password, salt, keyLength, scryptOptions).toString('base64url')

  return `scrypt:${scryptOptions.N}:${scryptOptions.r}:${scryptOptions.p}:${salt}:${key}`
}

export function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, n, r, p, salt, key] = passwordHash.split(':')

  if (algorithm !== 'scrypt' || !n || !r || !p || !salt || !key) {
    return false
  }

  const expectedKey = Buffer.from(key, 'base64url')
  const actualKey = scryptSync(password, salt, expectedKey.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
  })

  if (actualKey.length !== expectedKey.length) {
    return false
  }

  return timingSafeEqual(actualKey, expectedKey)
}
