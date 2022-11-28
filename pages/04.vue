<script setup>
import * as THREE from 'three';
import gsap from 'gsap';

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
const canvasRef2 = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
  const canvas2 = canvasRef2.value;

  // Scene
  const scene = new THREE.Scene()
  const scene2 = new THREE.Scene()

  // Object
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({color: 0xff0000})
  const mesh = new THREE.Mesh(geometry, material)
  const mesh2 = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  scene2.add(mesh2)

  // Sizes
  const sizes = {
    width: 400,
    height: 300
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  const camera2 = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 3
  camera2.position.z = 3
  scene.add(camera)
  scene2.add(camera2)

  // Renderer
  const renderer = new THREE.WebGLRenderer({canvas: canvas});
  const renderer2 = new THREE.WebGLRenderer({canvas: canvas2});
  renderer.setSize(sizes.width, sizes.height)
  renderer2.setSize(sizes.width, sizes.height)

  // Delta time: the amount of milliseconds that elapsed since the previous tick
  let time = Date.now();

  // Clock
  //const clock = new THREE.Clock();

  gsap.fromTo(mesh.rotation,
      {y: Math.PI * 2, x: Math.PI * 2},
      {y: 0, x: 0, yoyo: false, repeat: -1, duration: 1}
  );
  gsap.fromTo(camera2.position,
      {x: -1, y: -1},
      {x: 1, y: 1, yoyo: true, repeat: -1, ease: "slow(0.7, 0.7, false)", duration: 1}
  );


  // Animations
  const tick = () => {
    // Delta time
    const currentTime = Date.now();
    const deltaTime = currentTime - time; // millisecond
    time = currentTime;
    console.log(deltaTime);

    // Elapsed time
    //const elapsedTime = clock.getElapsedTime(); // second

    // Update objects
    //mesh.rotation.y += .001 * deltaTime;
    //mesh.rotation.y = elapsedTime * Math.PI * 2;
    //mesh.position.y = Math.sin(elapsedTime);
    //mesh.position.x = Math.cos(elapsedTime);
    //console.log(mesh.rotation.y);

    // #2 canvas
    //camera2.position.y = Math.sin(elapsedTime);
    //camera2.position.x = Math.cos(elapsedTime);
    //camera2.lookAt(mesh2.position);

    // Render
    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);

    window.requestAnimationFrame(tick);
    // issue: more high framerate, the faster the animation runs
    // #1: deltaTime
  };
  //tick();

  // Render using GSAP ticker
  const render = () => {
    renderer.render(scene, camera);
    renderer2.render(scene2, camera2);
  };
  // https://greensock.com/docs/v3/GSAP/gsap.ticker
  gsap.ticker.add(render);
});
</script>


<template>
  <div>
    <canvas ref="canvasRef"></canvas>
    <canvas ref="canvasRef2"></canvas>
  </div>
</template>