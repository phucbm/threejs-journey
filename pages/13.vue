<script setup>
import * as THREE from 'three';
import * as dat from "lil-gui";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

definePageMeta({title: `The haunted house`});

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
  const canvas = canvasRef.value;

  /**
   * Base
   */
// Debug
  const gui = new dat.GUI()

// Scene
  const scene = new THREE.Scene()

// Fog
  scene.fog = new THREE.Fog('#262837', 1, 15)

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader()
  const doorColorTexture = textureLoader.load('/textures/14/door/color.jpg')
  const doorAlphaTexture = textureLoader.load('/textures/14/door/alpha.jpg')
  const doorAmbientOcclusionTexture = textureLoader.load('/textures/14/door/ambientOcclusion.jpg')
  const doorNormalTexture = textureLoader.load('/textures/14/door/normal.jpg')
  const doorMetalnessTexture = textureLoader.load('/textures/14/door/metalness.jpg')
  const doorRoughnessTexture = textureLoader.load('/textures/14/door/roughness.jpg')
  const doorHeightTexture = textureLoader.load('/textures/14/door/height.jpg')

  const bricksColorTexture = textureLoader.load('/textures/14/bricks/color.jpg')
  const bricksAmbientOcclusionTexture = textureLoader.load('/textures/14/bricks/ambientOcclusion.jpg')
  const bricksNormalTexture = textureLoader.load('/textures/14/bricks/normal.jpg')
  const bricksRoughnessTexture = textureLoader.load('/textures/14/bricks/roughness.jpg')

  const grassColorTexture = textureLoader.load('/textures/14/grass/color.jpg')
  const grassAmbientOcclusionTexture = textureLoader.load('/textures/14/grass/ambientOcclusion.jpg')
  const grassNormalTexture = textureLoader.load('/textures/14/grass/normal.jpg')
  const grassRoughnessTexture = textureLoader.load('/textures/14/bricks/roughness.jpg')

  grassColorTexture.repeat.set(8, 8)
  grassAmbientOcclusionTexture.repeat.set(8, 8)
  grassNormalTexture.repeat.set(8, 8)
  grassRoughnessTexture.repeat.set(8, 8)

  grassColorTexture.wrapS = THREE.RepeatWrapping
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
  grassNormalTexture.wrapS = THREE.RepeatWrapping
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping

  grassColorTexture.wrapT = THREE.RepeatWrapping
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
  grassNormalTexture.wrapT = THREE.RepeatWrapping
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping

  /**
   * House
   */
  const house = new THREE.Group()
  scene.add(house)

// Walls
  const walls = new THREE.Mesh(
      new THREE.BoxBufferGeometry(4, 2.5, 4),
      new THREE.MeshStandardMaterial({
        map: bricksColorTexture,
        aoMap: bricksAmbientOcclusionTexture,
        normalMap: bricksNormalTexture,
        roughnessMap: bricksRoughnessTexture
      })
  )
  walls.position.y = 2.5 / 2
  walls.geometry.setAttribute('uv2',
      new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))
  house.add(walls)

// Roof
  const roof = new THREE.Mesh(
      new THREE.ConeBufferGeometry(3.5, 1, 4),
      new THREE.MeshStandardMaterial({color: '#b35f45'})
  )
  roof.position.y = 2.5 + 1 / 2;
  roof.rotation.y = Math.PI * 0.25;
  house.add(roof)

// Door
  const door = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
      new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: .1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
      })
  )
  door.geometry.setAttribute('uv2',
      new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
  door.position.z = 2 + .01
  door.position.y = 1
  house.add(door)

// Bushes
  const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
  const bushMaterial = new THREE.MeshStandardMaterial({color: '#89c854'})

  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.scale.set(.5, .5, .5)
  bush1.position.set(.8, .2, 2.2)

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.scale.set(.25, .25, .25)
  bush2.position.set(1.4, .1, 2.1)

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.scale.set(.4, .4, .4)
  bush3.position.set(-.8, .1, 2.2)

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.scale.set(.15, .15, .15)
  bush4.position.set(-1, .05, 2.6)

  house.add(bush1, bush2, bush3, bush4)

// Graves
  const graves = new THREE.Group();
  scene.add(graves);
  const graveGeometry = new THREE.BoxBufferGeometry(.6, .8, .2)
  const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

  for(let i = 0; i < 50; i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 5
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, .3, z)
    grave.rotation.z = (Math.random() - .5) * .4
    grave.rotation.y = (Math.random() - .5) * .4
    grave.castShadow = true

    graves.add(grave)
  }

// Floor
  const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
      })
  )
  floor.geometry.setAttribute('uv2',
      new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
  floor.rotation.x = -Math.PI * 0.5
  floor.position.y = 0
  scene.add(floor)

  /**
   * Lights
   */
// Ambient light
  const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
  gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
  scene.add(ambientLight)

// Directional light
  const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
  moonLight.position.set(4, 5, -2)
  gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
  gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001)
  gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001)
  gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001)
  scene.add(moonLight)

  const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
  doorLight.position.set(0, 2.2, 2.7)
  house.add(doorLight)

  /**
   * Ghosts
   */
  const ghost1 = new THREE.PointLight('#f0f', 2, 3)
  scene.add(ghost1)

  const ghost2 = new THREE.PointLight('#0ff', 2, 3)
  scene.add(ghost2)

  const ghost3 = new THREE.PointLight('#ff0', 2, 3)
  scene.add(ghost3)


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
  camera.position.x = 4
  camera.position.y = 2
  camera.position.z = 5
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
  renderer.setClearColor('#262837')

  /**
   * Shadows
   */
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  moonLight.castShadow = true
  doorLight.castShadow = true
  ghost1.castShadow = true
  ghost2.castShadow = true
  ghost3.castShadow = true

  walls.castShadow = true
//roof.castShadow=true
  bush1.castShadow = true
  bush2.castShadow = true
  bush3.castShadow = true
  bush4.castShadow = true

  floor.receiveShadow = true

  doorLight.shadow.mapSize.width = 256
  doorLight.shadow.mapSize.height = 256
  doorLight.shadow.camera.far = 7

  ghost1.shadow.mapSize.width = 256
  ghost1.shadow.mapSize.height = 256
  ghost1.shadow.camera.far = 7

  ghost2.shadow.mapSize.width = 256
  ghost2.shadow.mapSize.height = 256
  ghost2.shadow.camera.far = 7

  ghost3.shadow.mapSize.width = 256
  ghost3.shadow.mapSize.height = 256
  ghost3.shadow.camera.far = 7

  /**
   * Animate
   */
  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update ghosts
    const ghost1Angle = elapsedTime * .5;
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.sin(elapsedTime * 3)

    const ghost2Angle = -elapsedTime * .32;
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = -elapsedTime * .18;
    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * .32))
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * .5))
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5)

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