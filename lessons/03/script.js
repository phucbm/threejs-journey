//console.log('Xin chao');
//console.log(THREE);

// Scene
const scene = new THREE.Scene();

// Red cube
const geometry = new THREE.BoxGeometry(1, 1, 1); // whatever unit
const material = new THREE.MeshBasicMaterial({color: 'red'});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {width: 800, height: 600};

// Camera
// THREE.PerspectiveCamera( pov, aspect ratio );
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); // 75deg from the top pov
camera.position.z = 3; // move the cam further to see the cube
scene.add(camera);

// Renderer
const canvas = document.querySelector('canvas.webgl');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);