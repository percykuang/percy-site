import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

export function loadDatabaseEnv() {
  if (process.env.DATABASE_URL) {
    return
  }

  const currentDir = dirname(fileURLToPath(import.meta.url))
  const envPaths = [
    resolve(process.cwd(), '.env'),
    resolve(process.cwd(), '..', '.env'),
    resolve(process.cwd(), '..', '..', '.env'),
    resolve(currentDir, '..', '..', '.env'),
    resolve(currentDir, '..', '..', '..', '.env'),
  ]

  for (const envPath of new Set(envPaths)) {
    if (!existsSync(envPath)) {
      continue
    }

    config({
      path: envPath,
      override: false,
    })

    if (process.env.DATABASE_URL) {
      return
    }
  }
}
