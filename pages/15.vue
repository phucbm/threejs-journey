<script setup>
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const route = useRoute();
useHead({
  title: route.name,
  meta: [
    //{name: 'description', content: ''},
    //{property: 'og:description', content: ''},
    //{property: 'og:image', content: ''},
  ]
});

const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;

  /**
   * Base
   */

// Scene
  const scene = new THREE.Scene()

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader()
  const particleTexture = textureLoader.load('/textures/particles/2.png')

  /**
   * Particles
   */
// Geometry
//const particlesGeometry = new THREE.SphereBufferGeometry(1, 32, 32)
  const particlesGeometry = new THREE.BufferGeometry()
  const count = 20000

  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for(let i = 0; i < count * 3; i++){
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));


// Material
  const particlesMaterial = new THREE.PointsMaterial(
      {
        //map: particleTexture,
        transparent: true,
        alphaMap: particleTexture,
        size: .1,
        sizeAttenuation: true,
        alphaTest: .001,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      }
  )


// Points
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles)


  const cube = new THREE.Mesh(
      new THREE.BoxGeometry(),
      new THREE.MeshBasicMaterial()
  )
//scene.add(cube)


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

    // Update particles
    //particles.rotation.y = elapsedTime
    for(let i = 0; i < count; i++){
      const i3 = i * 3;

      const x = particlesGeometry.attributes.position.array[i3];
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true

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