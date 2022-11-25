<script setup>
import * as THREE from 'three';

const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
});
</script>


<template>
  <canvas ref="canvasRef"></canvas>
</template>