import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Debug
 */
const gui = new dat.GUI();


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/1/px.jpg',
    '/textures/environmentMaps/1/nx.jpg',
    '/textures/environmentMaps/1/py.jpg',
    '/textures/environmentMaps/1/ny.jpg',
    '/textures/environmentMaps/1/pz.jpg',
    '/textures/environmentMaps/1/nz.jpg',
]);

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Objects
 */
/*const material = new THREE.MeshBasicMaterial();
material.map = doorColorTexture;
material.transparent = true;
material.alphaMap = doorAlphaTexture; // kind of mask
material.side = THREE.DoubleSide; // low performance*/

// direction of the outside of the object: lighting, reflection, refraction, etc.
/*const material = new THREE.MeshNormalMaterial();
material.flatShading = true;*/

// use image to simulate the lights, shadows
/*const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;*/

// further get darker, closer get lighter
//const material = new THREE.MeshDepthMaterial();

// reacts with lights, got blurry issue
//const material = new THREE.MeshLambertMaterial();

// less blurry, less performant
/*const material = new THREE.MeshPhongMaterial();
material.specular = new THREE.Color('#ff0000');*/

// cartoon effect
/*const material = new THREE.MeshToonMaterial();
material.gradientMap = gradientTexture;*/

// smoother, better parameter, uses PBR
const material = new THREE.MeshStandardMaterial();
material.metalness = .7;
material.roughness = .2;
material.envMap = environmentMapTexture;

/*material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture; // create depth like shadow, need uv2
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture; // white goes up, black goes down, others stand still
material.displacementScale = .05;
material.metalnessMap = doorMetalnessTexture
material.roughnessMap = doorRoughnessTexture
material.normalMap = doorNormalTexture
material.alphaMap = doorAlphaTexture
material.transparent = true*/

gui.add(material, 'metalness', 0, 1, .01)
gui.add(material, 'roughness', 0, 1, .01)
/*gui.add(material, 'aoMapIntensity', 0, 10, .01)
gui.add(material, 'displacementScale', 0, 10, .01)*/

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.5, 16, 16),
    material
);
sphere.position.x = -1.5;
sphere.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 128, 128),
    material
)
plane.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.3, .2, 64, 128),
    material
)
torus.geometry.setAttribute(
    'uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

torus.position.x = 1.5;

scene.add(sphere, plane, torus);


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#fff', .5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight('#fff', .5);
pointLight.position.x = 2;
pointLight.position.x = 3;
pointLight.position.x = 4;
scene.add(pointLight);


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
camera.position.z = 2
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

    // Update objects
    sphere.rotation.y = .1 * elapsedTime;
    plane.rotation.y = .1 * elapsedTime;
    torus.rotation.y = .1 * elapsedTime;

    sphere.rotation.x = .15 * elapsedTime;
    plane.rotation.x = .15 * elapsedTime;
    torus.rotation.x = .15 * elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()