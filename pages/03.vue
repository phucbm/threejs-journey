<script setup>
import * as THREE from 'three';

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

  // Scene
  const scene = new THREE.Scene();

  /**
   * Objects
   */
  const group = new THREE.Group();
  group.position.y = 1;
  scene.add(group);

// Cube 1
  const cube1 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({color: 'red'})
  );
  group.add(cube1);

// Cube 2
  const cube2 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({color: 'blue'})
  );
  cube2.position.set(2, 0, 0);
  group.add(cube2);

// Cube 3
  const cube3 = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({color: 'green'})
  );
  cube3.position.set(-2, 0, 0);
  group.add(cube3);

// distance from the center of the scene
//console.log(mesh.position.length());

// set the position back to length 1
//mesh.position.normalize();
//console.log(mesh.position.length());

// Position
//mesh.position.set(.7, -.6, 1);

// Scale
//mesh.scale.set(2, .5, .5);

// Rotation, radians,  Math.PI is half a rotation
  /*mesh.rotation.reorder('YXZ');
  mesh.rotation.x = Math.PI * .25;
  mesh.rotation.y = Math.PI * .25;*/
// gimbal lock issue
// the order of axes when doing rotation is IMPORTANT!

// Quaternion <=> Rotation

// Axes helper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);


  /**
   * Sizes
   */
  const sizes = {
    width: 800,
    height: 600
  }

  /**
   * Camera
   */
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.set(0, 0, 3);
  scene.add(camera)

//camera.lookAt(mesh.position);

// distance from the mesh to the cam
//console.log(mesh.position.distanceTo(camera.position));

  /**
   * Renderer
   */
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.render(scene, camera)
});
</script>


<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>