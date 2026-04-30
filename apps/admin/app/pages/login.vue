<template>
  <div
    class="w-full max-w-md rounded-3xl border border-white/10 bg-[rgb(11_20_34/0.78)] p-8 shadow-[0_24px_80px_rgb(0_0_0/0.34)] backdrop-blur-xl"
  >
    <a-form class="admin-login-form" layout="vertical" :model="form" @finish="submit">
      <a-form-item
        label="邮箱"
        name="email"
        :rules="[{ required: true, type: 'email', message: '请输入有效邮箱' }]"
      >
        <a-input
          v-model:value="form.email"
          autocomplete="email"
          placeholder="admin@example.com"
          size="large"
        />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
      >
        <a-input-password
          v-model:value="form.password"
          autocomplete="current-password"
          placeholder="请输入密码"
          size="large"
        />
      </a-form-item>

      <a-alert v-if="error" class="mb-4" type="error" show-icon :message="error" />

      <a-button
        class="admin-login-submit h-13 rounded-xl"
        block
        html-type="submit"
        size="large"
        type="primary"
        :loading="pending"
        :disabled="!form.email.trim() || !form.password"
      >
        登录
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { AdminAuthState } from '@ps/shared/auth'

definePageMeta({
  layout: 'auth',
})

const form = reactive({
  email: '',
  password: '',
})
const error = ref('')
const pending = ref(false)
const { setSession } = useAdminSession()

async function submit() {
  error.value = ''
  pending.value = true

  try {
    const session = await adminApiFetch<AdminAuthState>('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    })
    setSession(session)
    await navigateTo('/articles')
  } catch (fetchError) {
    error.value = getAdminApiErrorMessage(fetchError, '邮箱或密码不正确')
  } finally {
    pending.value = false
  }
}
</script>
