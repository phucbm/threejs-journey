<script setup>
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const canvasRef = ref(null);

onMounted(() => {
  if(process.server) return;

  const canvas = canvasRef.value;

  /**
   * Base
   */

// Scene
  const scene = new THREE.Scene()

// Object
//const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)

  const count = 500;
  const positionsArray = new Float32Array(count * 3 * 3);

  for(let i = 0; i < count * 3 * 3; i++){
    positionsArray[i] = (Math.random() - .5) * 3;
  }

  const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', positionsAttribute);

  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

// Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

// Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.z = 3
  scene.add(camera)

// Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

// Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
  }

  tick()
});
</script>


<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>