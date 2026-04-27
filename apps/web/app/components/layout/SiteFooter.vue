<template>
  <footer class="border-border border-t">
    <div
      class="text-muted-foreground mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm"
    >
      <p>© {{ year }} Percy.</p>
      <a href="https://github.com" target="_blank" rel="noreferrer" class="hover:text-foreground">
        GitHub
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
