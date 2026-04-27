<template>
  <div class="bg-white">
    <section class="mx-auto max-w-4xl px-4 py-20 sm:px-6 md:py-28">
      <div>
        <p class="text-primary text-sm font-semibold">Frontend Engineer / AI Product Builder</p>
        <h1 class="mt-5 max-w-3xl text-4xl leading-tight font-semibold text-balance md:text-6xl">
          你好，我是 Percy。
        </h1>
        <p class="text-muted-foreground mt-6 max-w-3xl text-lg leading-8">
          我喜欢极简的设计哲学，也喜欢把界面当作系统来设计，在像素、状态、类型和数据流之间反复调试，构建干净、可靠、可长期运行的
          Web 体验。现在也在探索 AI 应用开发，把模型能力、产品交互和工程落地连接起来。
        </p>

        <div class="mt-7 flex flex-wrap gap-2">
          <span
            v-for="item in introTags"
            :key="item"
            class="border-soft-border bg-surface-blue text-foreground rounded-full border px-3 py-1 text-sm"
          >
            {{ item }}
          </span>
        </div>

        <div class="mt-9 flex flex-wrap gap-3">
          <NuxtLink
            class="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium shadow-sm transition-colors"
            to="/blog"
          >
            阅读文章
            <BookOpen class="size-4" aria-hidden="true" />
          </NuxtLink>
          <NuxtLink
            class="border-soft-border bg-surface hover:bg-surface-blue inline-flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
            to="/about"
          >
            关于我
            <ArrowRight class="size-4" aria-hidden="true" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, BookOpen } from 'lucide-vue-next'

const introTags = ['AI Product Builder', 'Minimal UI', 'Typed UI', 'Clean Systems']
</script>
