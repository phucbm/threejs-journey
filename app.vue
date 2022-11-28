<script setup>
useHead({
  // as a string,
  // where `%s` is replaced with the title
  titleTemplate: `%s - ThreeJs Journey`,
  bodyAttrs: {
    class: 'threejs-journey'
  },

  link: [
    {rel: 'icon', type: 'image/x-icon', href: '/img/favicon.png'}
  ],

  meta: [
    {name: "twitter:card", content: 'summary_large_image'}
  ]
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage/>
  </NuxtLayout>
</template>