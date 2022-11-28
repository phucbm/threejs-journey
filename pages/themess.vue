<script setup>
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";


useHead({
  title: 'The Mess',
  meta: [
    //{name: 'description', content: ''},
    //{property: 'og:description', content: ''},
    //{property: 'og:image', content: ''},
  ]
});

const canvasRef = ref(null);
const fn = () => {
  const canvas = canvasRef.value;

  /**
   * Debug
   */
//const gui = new dat.GUI();
//gui.hide();
  const parameters = {
    speed: 2,
    color: '#f00',
    count: 300,
    size: 5,
    getPositionAttribute: (count) => {
      // create a Float32Array with given size
      const positionsArray = new Float32Array(count * 3 * 3);

      // use loop to add vertices value
      for(let i = 0; i < count * 3 * 3; i++){
        positionsArray[i] = (Math.random() - .5) * parameters.size;
      }

      // create buffer attribute
      return new THREE.BufferAttribute(positionsArray, 3);
    },
    updateWireframe: () => {
      mesh.geometry.attributes.position = parameters.getPositionAttribute(parameters.count);
      mesh.geometry.setDrawRange(0, parameters.count);
    }
  };


  /**
   * Cursor
   */
  const cursor = {x: 0, y: 0};
  window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5;
    cursor.y = -(event.clientY / sizes.height - 0.5);
    //console.log(cursor);

    const x = event.clientX / sizes.width,
        y = event.clientY / sizes.height,
        color = {r: x, g: y, b: x - y};

    /*d = Math.sqrt(Math.pow(event.clientX - sizes.width / 2, 2) + Math.pow(event.clientY - sizes.height / 2, 2)),
    r = Math.max(sizes.width, sizes.height),
    p = 1 - d / r;

    parameters.count = 500 * p;
    parameters.updateWireframe();*/


    material.color.set(new THREE.Color(color.r, color.g, color.b))
  });


  /**
   * Base
   */

// Scene
  const scene = new THREE.Scene()


  /**
   * Object
   */
// create geometry with attribute
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', parameters.getPositionAttribute(parameters.count));

  const material = new THREE.MeshBasicMaterial({
    color: parameters.color,
    wireframe: true
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

// set flag for later update of geometry
  mesh.geometry.attributes.position.needsUpdate = true;


// Add debug
//gui.add(material, 'wireframe')
// gui.addColor(parameters, 'color')
//     .onChange(() => {
//         material.color.set(parameters.color)
//     })
//
// gui.add(parameters, 'size', .1, 10, .1)
//     .onChange(parameters.updateWireframe)
// gui.add(parameters, 'count', 1, 1000, 1)
//     .onChange(parameters.updateWireframe)


// Sizes
  const sizes = {width: window.innerWidth, height: window.innerHeight};

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
  camera.position.z = 6
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


// Warping animation
  gsap.to(mesh.rotation, {
    z: Math.PI * 2,
    y: Math.PI * 2,
    x: Math.PI * 2,
    repeat: -1,
    duration: 4 * parameters.speed,
    ease: 'linear'
  });
  gsap.to(mesh.scale, {z: .2, yoyo: true, repeat: -1, duration: 1 * parameters.speed});
  gsap.to(mesh.scale, {x: .2, yoyo: true, repeat: -1, duration: 2 * parameters.speed});
  gsap.to(mesh.scale, {y: .2, yoyo: true, repeat: -1, duration: 3 * parameters.speed});


// Render using GSAP ticker
  const render = () => {
    camera.lookAt(mesh.position);

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
  };
// https://greensock.com/docs/v3/GSAP/gsap.ticker
  gsap.ticker.add(render);
}

onMounted(fn);
</script>

<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>