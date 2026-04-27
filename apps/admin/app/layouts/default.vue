<template>
  <div class="bg-muted/30 text-foreground min-h-screen">
    <aside
      class="border-border bg-background fixed inset-y-0 left-0 hidden w-64 border-r px-4 py-5 md:block"
    >
      <NuxtLink to="/" class="text-sm font-semibold">Percy Admin</NuxtLink>
      <nav class="mt-8 grid gap-1 text-sm">
        <NuxtLink class="hover:bg-muted rounded-md px-3 py-2" to="/">Dashboard</NuxtLink>
        <NuxtLink class="hover:bg-muted rounded-md px-3 py-2" to="/projects">项目</NuxtLink>
        <NuxtLink class="hover:bg-muted rounded-md px-3 py-2" to="/posts">文章</NuxtLink>
        <NuxtLink class="hover:bg-muted rounded-md px-3 py-2" to="/tags">标签</NuxtLink>
        <NuxtLink class="hover:bg-muted rounded-md px-3 py-2" to="/messages">联系消息</NuxtLink>
      </nav>
    </aside>
    <div class="md:pl-64">
      <header class="border-border bg-background/90 sticky top-0 z-10 border-b">
        <div class="flex h-16 items-center justify-between px-4">
          <p class="text-muted-foreground text-sm">admin.percy.dev</p>
          <button
            class="text-muted-foreground hover:text-foreground text-sm"
            type="button"
            @click="logout"
          >
            退出
          </button>
        </div>
      </header>
      <main class="p-4 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
async function logout() {
  await $fetch('/api/auth/logout', {
    method: 'POST',
  })
  await navigateTo('/login')
}
</script>
