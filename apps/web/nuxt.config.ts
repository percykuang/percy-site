import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

const workspaceRoot = fileURLToPath(new URL('../..', import.meta.url))
const uploadsDir = process.env.NUXT_UPLOADS_DIR || resolve(workspaceRoot, 'storage/uploads')

export default defineNuxtConfig({
  compatibilityDate: '2026-04-27',
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: "Percy's Site",
      link: [
        {
          href: '/favicon.svg',
          rel: 'icon',
          type: 'image/svg+xml',
        },
      ],
    },
  },
  devtools: {
    enabled: process.env.NUXT_DEVTOOLS === 'true',
  },
  runtimeConfig: {
    sessionSecret: process.env.NUXT_SESSION_SECRET || '',
    uploadsDir,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      adminUrl: process.env.NUXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
