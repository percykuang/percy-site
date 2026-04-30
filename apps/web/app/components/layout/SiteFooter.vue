<template>
  <footer class="border-soft-border border-t bg-white">
    <div class="mx-auto max-w-6xl px-4 pt-1 pb-6 sm:px-6">
      <div class="pt-6">
        <div class="text-muted-foreground flex items-center justify-center gap-3 text-sm">
          <span class="bg-soft-border h-px w-10" aria-hidden="true" />
          <Logo src="/favicon.svg" class="size-5 opacity-80" :size="20" />
          <span>© 2026</span>
          <span class="bg-soft-border h-px w-10" aria-hidden="true" />
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { Logo } from '@ps/ui'
</script>
