<template>
  <img
    class="logo"
    :src="src"
    :alt="resolvedAlt"
    :width="size"
    :height="size"
    :aria-hidden="decorative ? 'true' : undefined"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    alt?: string
    decorative?: boolean
    size?: number
    src: string
  }>(),
  {
    alt: '',
    decorative: true,
    size: 32,
  },
)

const resolvedAlt = computed(() => {
  return props.decorative ? '' : props.alt
})
</script>

<style scoped>
.logo {
  display: block;
  flex-shrink: 0;
}
</style>
