import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-27',
  css: ['~/assets/css/main.css'],
  devtools: {
    enabled: true,
  },
  runtimeConfig: {
    sessionSecret: process.env.NUXT_SESSION_SECRET || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      adminUrl: process.env.NUXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
