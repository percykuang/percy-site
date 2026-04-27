<template>
  <header class="border-soft-border sticky top-0 z-40 border-b">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
      <NuxtLink
        to="/"
        aria-label="返回首页"
        class="focus-visible:ring-accent rounded-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <img src="/favicon.svg" alt="" class="size-9" width="36" height="36" aria-hidden="true" />
      </NuxtLink>

      <nav class="text-muted-foreground flex items-center gap-1 text-sm">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="hover:bg-primary-soft hover:text-foreground rounded-md px-3 py-2 transition-colors"
          :active-class="item.exact ? '' : navActiveClass"
          :exact-active-class="navActiveClass"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const navActiveClass = 'bg-primary-soft text-foreground'

const navItems = [
  {
    exact: true,
    label: '首页',
    to: '/',
  },
  {
    label: '文章',
    to: '/blog',
  },
  {
    label: '关于',
    to: '/about',
  },
]
</script>
