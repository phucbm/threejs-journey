<script setup>
import * as THREE from 'three';

definePageMeta({title: `Textures`});

const route = useRoute();
useHead({
  title: route.meta.title,
  meta: [
    //{name: 'description', content: ''},
    //{property: 'og:description', content: ''},
    //{property: 'og:image', content: ''},
  ]
});

const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
});
</script>


<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>