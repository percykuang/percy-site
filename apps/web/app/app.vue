<template>
  <div class="text-foreground flex h-screen flex-col overflow-hidden">
    <SiteHeader />
    <main ref="mainScrollRef" class="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
      <NuxtPage />
    </main>
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
import SiteHeader from './components/layout/SiteHeader.vue'

const mainScrollRef = ref<HTMLElement | null>(null)
const { registerScrollContainer } = useWebScroll()
const { closeMarkdownImageViewer, markdownImageViewer } = useMarkdownImageViewer()

registerScrollContainer(mainScrollRef)
</script>
