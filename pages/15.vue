<script setup>
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

definePageMeta({title: `Galaxy generator`});

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

onMounted(async() => {
  if(process.server) return;
  const dat = await import('dat.gui')
  const canvas = canvasRef.value;

  /**
   * Base
   */
// Debug
  const gui = new dat.GUI({width: 400})

// Scene
  const scene = new THREE.Scene()

  /**
   * Galaxy
   */
  const parameters = {}
  parameters.count = 100000
  parameters.size = .01
  parameters.radius = 5
  parameters.branches = 3
  parameters.spin = 1
  parameters.randomness = 1
  parameters.randomnessPower = 3
  parameters.insideColor = '#ff6030'
  parameters.outsideColor = '#1b3984'

  let geometry = null
  let material = null
  let points = null

  const generateGalaxy = () => {
    /**
     * Destroy the galaxy
     */
    if(points !== null){
      geometry.dispose();
      material.dispose();
      scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++){
      const i3 = i * 3

      // Position
      const radius = Math.random() * parameters.radius
      const spinAngle = radius * parameters.spin
      const branchAngle = (i % parameters.branches) * (Math.PI * 2 / parameters.branches)

      //if (i < 20) console.log(i, branchAngle)

      /*const randomX = Math.random() * parameters.randomness
      const randomY = Math.random() * parameters.randomness
      const randomZ = Math.random() * parameters.randomness*/

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1)

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX // x
      positions[i3 + 1] = randomY // y
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ// z

      // Color
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */
    material = new THREE.PointsMaterial({
      size: parameters.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
  }
  generateGalaxy()

  gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
  gui.add(parameters, 'size').min(.001).max(.1).step(.001).onFinishChange(generateGalaxy)
  gui.add(parameters, 'radius').min(.01).max(20).step(.01).onFinishChange(generateGalaxy)
  gui.add(parameters, 'branches').min(2).max(20).step(1).onChange(generateGalaxy)
  gui.add(parameters, 'spin').min(-5).max(5).step(.01).onFinishChange(generateGalaxy)
  gui.add(parameters, 'randomness').min(0).max(2).step(.001).onFinishChange(generateGalaxy)
  gui.add(parameters, 'randomnessPower').min(1).max(10).step(.001).onFinishChange(generateGalaxy)
  gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
  gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


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
  camera.position.x = 3
  camera.position.y = 3
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

    points.rotation.y = elapsedTime * .1

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