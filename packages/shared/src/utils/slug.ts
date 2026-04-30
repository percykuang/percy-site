import { createCompactId } from './id'

export function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function createScopedSlug(value: string, prefix: string, suffix?: string | number) {
  const normalized = normalizeSlug(value)

  if (normalized) {
    return normalized
  }

  const suffixSegment = suffix === undefined ? '' : `-${String(suffix)}`

  return `${prefix}-${createCompactId().slice(0, 8)}${suffixSegment}`
}
