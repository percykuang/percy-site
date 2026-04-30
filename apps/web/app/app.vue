<template>
  <div class="text-foreground flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <SiteFooter />
    <BackToTopButton />
    <MarkdownImageLightbox />
  </div>
</template>

<script setup lang="ts">
import BackToTopButton from './components/layout/BackToTopButton.vue'
import MarkdownImageLightbox from './components/layout/MarkdownImageLightbox.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import SiteHeader from './components/layout/SiteHeader.vue'
</script>
