<template>
  <section class="border-border bg-background w-full max-w-sm rounded-lg border p-6">
    <h1 class="text-xl font-semibold">登录后台</h1>
    <form class="mt-6 grid gap-4" @submit.prevent="submit">
      <label class="grid gap-2 text-sm">
        <span>邮箱</span>
        <input
          v-model="email"
          class="border-border bg-background rounded-md border px-3 py-2"
          type="email"
          autocomplete="email"
          required
        />
      </label>
      <label class="grid gap-2 text-sm">
        <span>密码</span>
        <input
          v-model="password"
          class="border-border bg-background rounded-md border px-3 py-2"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>
      <p v-if="error" class="text-destructive text-sm">{{ error }}</p>
      <button
        class="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        :disabled="pending"
      >
        {{ pending ? '登录中' : '登录' }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
})

const email = ref('')
const password = ref('')
const error = ref('')
const pending = ref(false)

async function submit() {
  error.value = ''
  pending.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: email.value,
        password: password.value,
      },
    })
    await navigateTo('/')
  } catch {
    error.value = '邮箱或密码不正确'
  } finally {
    pending.value = false
  }
}
</script>
