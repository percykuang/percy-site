<template>
  <header class="border-soft-border bg-background sticky top-0 z-50 border-b">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink
        to="/"
        aria-label="返回首页"
        class="focus-visible:ring-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <Logo src="/favicon.svg" class="size-9" :size="36" />
      </NuxtLink>

      <div class="flex items-center gap-2">
        <nav class="text-muted-foreground flex items-center gap-1 text-sm">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="hover:bg-primary-soft hover:text-foreground rounded-md px-3 py-2 transition-colors"
            :class="isNavActive(item) ? navActiveClass : ''"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <SiteSearch />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Logo } from '@ps/ui'
import SiteSearch from './SiteSearch.vue'

const navActiveClass = 'bg-primary-soft text-foreground'

type NavItem = {
  exact?: boolean
  label: string
  to: string
}

const route = useRoute()

const navItems: NavItem[] = [
  {
    exact: true,
    label: '首页',
    to: '/',
  },
  {
    label: '文章',
    to: '/articles',
  },
  {
    label: '分类',
    to: '/categories',
  },
  {
    label: '关于',
    to: '/about',
  },
]

function isNavActive(item: NavItem) {
  if (item.exact) {
    return route.path === item.to
  }

  if (route.path.startsWith('/articles/') && route.query.from === 'categories') {
    return item.to === '/categories'
  }

  return route.path === item.to || route.path.startsWith(`${item.to}/`)
}
</script>
