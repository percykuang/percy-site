<template>
  <div class="mx-auto max-w-5xl px-4 py-10 sm:px-6 md:py-12">
    <section class="mx-auto max-w-3xl">
      <div class="text-center">
        <p class="text-primary text-sm font-semibold">About</p>
        <h1 class="mt-3 text-4xl leading-tight font-semibold">关于我</h1>
      </div>

      <div class="text-muted-foreground mt-6 space-y-3 leading-7">
        <p>
          我是
          Percy，一名专注于前端开发的工程师。大学毕业后，我在字节跳动飞书部门工作了三年，长期参与 B
          端产品建设，也因此对复杂业务场景、用户体验和产品落地有了更深入的理解。
        </p>
        <p>
          我喜欢研究技术，也喜欢分享、学习和思考。具体到技术方向，我关注工程化、组件化、框架原理、性能优化和代码规范，并享受把一个个想法打磨成稳定产品的过程。工作之外，我喜欢看电影、听音乐、打游戏，也会在假期出去旅行，看看更大的世界。
        </p>
      </div>
    </section>

    <section class="mt-10">
      <div class="text-center">
        <p class="text-primary text-sm font-semibold">Focus</p>
        <h2 class="mt-2 text-2xl font-semibold">我关注的方向</h2>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <article
          v-for="item in focusAreas"
          :key="item.title"
          class="border-soft-border bg-surface rounded-lg border p-4 shadow-sm"
        >
          <p class="text-primary text-sm font-semibold">{{ item.label }}</p>
          <h3 class="mt-3 text-lg font-semibold">{{ item.title }}</h3>
          <p class="text-muted-foreground mt-3 leading-7">{{ item.description }}</p>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const focusAreas = [
  {
    label: '01',
    title: '产品界面',
    description: '从布局、文案、状态和响应式体验入手，让页面适合长期使用。',
  },
  {
    label: '02',
    title: '前端工程',
    description: '关注类型约束、构建链路、代码规范、包边界和部署流程。',
  },
  {
    label: '03',
    title: 'AI 应用',
    description: '关注模型能力、产品交互和工程落地，把 AI 能力接入真实业务场景。',
  },
]
</script>
