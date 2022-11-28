<script setup>
import * as THREE from 'three';

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