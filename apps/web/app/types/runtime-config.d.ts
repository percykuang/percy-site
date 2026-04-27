declare module 'nuxt/schema' {
  interface RuntimeConfig {
    sessionSecret: string
  }

  interface PublicRuntimeConfig {
    siteUrl: string
    adminUrl: string
  }
}

export {}
