<template>
  <section class="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl content-center gap-10 px-4 py-20">
    <div class="max-w-3xl">
      <p class="text-muted-foreground mb-4 text-sm font-medium">Frontend Developer</p>
      <h1 class="text-foreground text-4xl leading-tight font-semibold md:text-6xl">
        你好，我是 Percy。
      </h1>
      <p class="text-muted-foreground mt-6 max-w-2xl text-lg leading-8">
        我专注于构建高质量 Web 应用，关注界面体验、组件设计、工程化和可维护性。
      </p>
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink
          class="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium"
          to="/projects"
        >
          查看项目
        </NuxtLink>
        <NuxtLink class="border-border rounded-md border px-4 py-2 text-sm font-medium" to="/blog">
          阅读文章
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
