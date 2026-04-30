<template>
  <main
    class="relative grid min-h-screen place-items-center overflow-hidden bg-[#0b1422] px-4 py-10"
  >
    <div
      class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgb(66_104_181/0.28),transparent_30%),radial-gradient(circle_at_82%_18%,rgb(30_64_175/0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgb(15_23_42/0.4),transparent_30%),linear-gradient(180deg,#0e1828_0%,#09111d_100%)]"
      aria-hidden="true"
    />
    <slot />
  </main>
</template>
