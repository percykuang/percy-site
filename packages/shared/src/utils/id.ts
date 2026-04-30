const idFallbackRandomLength = 20

function createRandomIdSegment(length: number) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length)
    .padEnd(length, '0')
}

export function createCompactId() {
  if (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.randomUUID === 'function'
  ) {
    return globalThis.crypto.randomUUID().replace(/-/g, '')
  }

  return `${Date.now().toString(36)}-${createRandomIdSegment(idFallbackRandomLength)}`
}
