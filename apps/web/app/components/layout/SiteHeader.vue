<template>
  <header class="border-border bg-background/90 border-b">
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
      <NuxtLink to="/" class="text-sm font-semibold tracking-wide"> Percy </NuxtLink>
      <nav class="text-muted-foreground flex items-center gap-5 text-sm">
        <NuxtLink to="/projects" class="hover:text-foreground">项目</NuxtLink>
        <NuxtLink to="/blog" class="hover:text-foreground">文章</NuxtLink>
        <NuxtLink to="/about" class="hover:text-foreground">关于</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-foreground">联系</NuxtLink>
      </nav>
    </div>
  </header>
</template>
