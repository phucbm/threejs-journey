import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()
// const rayOrigin = new THREE.Vector3(-3, 0, 0)
// const rayDirection = new THREE.Vector3(10, 0, 0).normalize()
// raycaster.set(rayOrigin, rayDirection)
//
// const intersect = raycaster.intersectObject(object2)
// console.log(intersect)
//
// const intersects = raycaster.intersectObjects([object1, object2, object3])
// console.log(intersects)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
 * Mouse
 */
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = -(event.clientY / sizes.height) * 2 + 1
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
 * Models
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load(
    './models/Duck/glTF-Binary/Duck.glb',
    (gltf) => {
        gltf.scene.position.y = -1.2;
        scene.add(gltf.scene)
    }
)


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#fff', .9);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00fffc, 2.1);
directionalLight.position.set(1, .25, 0);
scene.add(directionalLight);

/**
 * Animate
 */
const clock = new THREE.Clock()


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate objects
    object1.position.y = Math.sin(elapsedTime * .3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * .6) * 1.5;
    object3.position.y = Math.sin(elapsedTime * .5) * 1.5;

    // Cast a ray
    raycaster.setFromCamera(mouse, camera);

    // const rayOrigin = new THREE.Vector3(-3, 0, 0)
    // const rayDirection = new THREE.Vector3(1, 0, 0).normalize()
    // raycaster.set(rayOrigin, rayDirection);
    //
    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);

    for (const object of objectsToTest) {
        object.material.color.set('#f00');
    }

    for (const intersect of intersects) {
        //@ts-ignore
        intersect.object.material.color.set('#0000ff');
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()