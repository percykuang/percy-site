<template>
  <a-layout class="admin-shell">
    <a-layout-sider class="admin-sider" :width="256">
      <div class="flex px-3 py-5">
        <NuxtLink class="flex items-center gap-3 text-white" to="/articles">
          <Logo src="/favicon.svg" class="size-8" :size="32" />
          <span class="text-sm font-semibold tracking-wide text-[#9ebeff]">后台管理</span>
        </NuxtLink>
      </div>

      <div class="flex-1 overflow-auto">
        <a-menu
          class="admin-nav-menu"
          theme="dark"
          mode="inline"
          :selected-keys="[selectedMenuKey]"
        >
          <a-menu-item v-for="item in navItems" :key="item.to">
            <template #icon>
              <component :is="item.icon" />
            </template>
            <NuxtLink :to="item.to">{{ item.label }}</NuxtLink>
          </a-menu-item>
        </a-menu>
      </div>

      <div class="mt-auto border-t border-white/10 p-2">
        <div
          class="flex h-10 min-w-0 items-center gap-3 rounded-full border border-[#22344d] bg-[#16253a] px-3"
        >
          <Logo src="/favicon.svg" class="size-7" :size="28" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-[15px] leading-none font-medium text-white/92">
              {{ userEmail }}
            </p>
          </div>
          <a-button
            class="admin-logout-button"
            shape="circle"
            type="text"
            :loading="logoutPending"
            aria-label="退出登录"
            @click="logout"
          >
            <template #icon>
              <LogoutOutlined />
            </template>
          </a-button>
        </div>
      </div>
    </a-layout-sider>

    <a-layout class="admin-main-layout">
      <a-layout-content class="admin-content">
        <div class="admin-content-inner">
          <slot />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { FileTextOutlined, LogoutOutlined } from '@ant-design/icons-vue'
import { Logo } from '@ps/ui'

const route = useRoute()
const logoutPending = ref(false)
const { clearSession, fetchSession, session } = useAdminSession()

if (!session.value) {
  await fetchSession()
}

const navItems = [
  {
    icon: FileTextOutlined,
    label: '文章',
    to: '/articles',
  },
] as const

const selectedMenuKey = computed(() => {
  const activeItem = navItems.find((item) => {
    return route.path === item.to || route.path.startsWith(`${item.to}/`)
  })

  return activeItem?.to ?? '/articles'
})
const userEmail = computed(() => session.value?.user.email ?? 'admin@example.com')

async function logout() {
  logoutPending.value = true

  try {
    await adminApiFetch('/api/auth/logout', {
      method: 'POST',
    })
    clearSession()
    await navigateTo('/login')
  } finally {
    logoutPending.value = false
  }
}
</script>
