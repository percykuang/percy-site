<template>
  <div class="text-foreground flex min-h-screen flex-col">
    <SiteHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <SiteFooter />
    <BackToTopButton />
    <ImageLightbox
      :alt="markdownImageViewer.alt"
      :open="markdownImageViewer.isOpen"
      :src="markdownImageViewer.src"
      @close="closeMarkdownImageViewer"
    />
  </div>
</template>

<script setup lang="ts">
import { ImageLightbox } from '@ps/ui'
import BackToTopButton from './components/layout/BackToTopButton.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import SiteHeader from './components/layout/SiteHeader.vue'

const { closeMarkdownImageViewer, markdownImageViewer } = useMarkdownImageViewer()
</script>
