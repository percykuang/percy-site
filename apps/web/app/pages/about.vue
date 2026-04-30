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
          Percy，一名专注于前端开发的工程师。大学毕业后，我在字节跳动飞书部门工作了三年，主要参与复杂
          B
          端业务系统的前端建设。这个过程让我长期面对真实业务中的流程、权限、状态和协作问题，也让我更重视用户体验、产品落地和工程质量之间的平衡。
        </p>
        <p>
          我喜欢研究技术，也喜欢分享、学习和思考。我不太喜欢为了技术而技术，更关心一个想法如何被做成清晰、稳定、好用的产品体验。现在我也在深入
          AI 应用开发，尝试把模型能力、产品交互和工程实现结合起来，做一些真正能解决问题的应用。
        </p>

        <p>
          工作之外，我喜欢电影、音乐、游戏和旅行。它们让我放松，也让我持续接触不同的叙事、审美和生活经验。
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
