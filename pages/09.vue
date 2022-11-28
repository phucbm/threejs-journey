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
   * Textures
   */
  /*
  // native js way
  const image = new Image();
  const texture = new THREE.Texture(image);
  image.onload = () => {
      // tells Threejs this texture will be updated later
      texture.needsUpdate = true;
  };
  image.src = 'textures/door/color.jpg';*/

  const loadingManager = new THREE.LoadingManager();
  /*loadingManager.onLoad = (data) => {
      console.log('load', data)
  };
  loadingManager.onProgress = (data) => {
      console.log('progress', data)
  };
  loadingManager.onError = (data) => {
      console.log('error', data)
  };*/

  const textureLoader = new THREE.TextureLoader(loadingManager);
  const colorTexture = textureLoader.load('/textures/minecraft.png');
  const alphaTexture = textureLoader.load('/textures/door/alpha.jpg');
  const heightTexture = textureLoader.load('/textures/door/height.jpg');
  const normalTexture = textureLoader.load('/textures/door/normal.jpg');
  const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
  const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
  const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

  /*colorTexture.repeat.x = 2;
  colorTexture.repeat.y = 3;
  colorTexture.wrapS = THREE.RepeatWrapping;
  colorTexture.wrapT = THREE.RepeatWrapping;*/

  colorTexture.generateMipmaps = false;
  colorTexture.minFilter = THREE.NearestFilter;
  colorTexture.magFilter = THREE.NearestFilter;

  /**
   * Base
   */

// Scene
  const scene = new THREE.Scene()

  /**
   * Object
   */
  const geometry = new THREE.BoxGeometry(1, 1, 1)
//console.log(geometry.attributes.uv)

  const material = new THREE.MeshBasicMaterial({map: colorTexture})
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

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
  camera.position.x = 1
  camera.position.y = 1
  camera.position.z = 1
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