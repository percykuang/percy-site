<template>
  <section>
    <h1 class="text-2xl font-semibold">联系消息</h1>
    <div class="border-border bg-background mt-6 rounded-lg border">
      <div
        v-for="message in messages"
        :key="message.id"
        class="border-border border-b p-4 last:border-b-0"
      >
        <p class="font-medium">{{ message.subject }}</p>
        <p class="text-muted-foreground mt-1 text-sm">{{ message.email }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: messages } = await useFetch('/api/messages', {
  default: () => [],
})
</script>
