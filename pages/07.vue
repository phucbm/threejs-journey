<script setup>
import * as THREE from 'three';
import gsap from "gsap";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

definePageMeta({title: `Debug UI`});

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
  if(process.server) return;

  const canvas = canvasRef.value;

  /**
   * Debug
   */
  const parameters = {
    color: '#f00',
    spin: () => {
      gsap.fromTo(mesh.rotation, {y: 0}, {y: 10, duration: 2})
      gsap.fromTo(mesh.rotation, {x: 0}, {x: 10, duration: 2})
      gsap.fromTo(mesh.rotation, {z: 0}, {z: 10, duration: 2})
    }
  }


  /**
   * Base
   */
  const scene = new THREE.Scene()

  /**
   * Object
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({color: 0xff0000})
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  let gui = new dat.GUI();
  gui.add(mesh.position, 'x', -3, 3, .01);
  gui.add(mesh.position, 'y')
      .min(-3)
      .max(3)
      .name('elevation')
      .step(.01)

  gui.add(mesh, 'visible')

  gui.add(material, 'wireframe')

  gui.addColor(parameters, 'color')
      .onChange(() => {
        material.color.set(parameters.color)
      })

  gui.add(parameters, 'spin')

  /**
   * Sizes
   */
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

  /**
   * Camera
   */
// Base camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
  camera.position.z = 3
  scene.add(camera)

// Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  /**
   * Animate
   */
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