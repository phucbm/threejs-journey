import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()
type FoxAnimationName = 'watching' | 'walking' | 'running'
let activeAction: THREE.AnimationAction;
const foxActions = {} as Record<FoxAnimationName, THREE.AnimationAction>;
const playAction = (name: FoxAnimationName) => {
    const nextAction = foxActions[name]
    if (nextAction === activeAction) return

    // gradually change to new pose
    activeAction.fadeOut(0.5)
    nextAction.reset().fadeIn(0.5).play()

    // without cross-fade, visible pop between poses
    // nextAction.play();

    activeAction = nextAction
}

const animationDebugObject = {
    watching: () => playAction('watching'),
    walking: () => playAction('walking'),
    running: () => playAction('running')
}
gui.add(animationDebugObject, 'watching')
gui.add(animationDebugObject, 'walking')
gui.add(animationDebugObject, 'running')

// Canvas
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
let mixer: THREE.AnimationMixer;

gltfLoader.load(
    './models/Fox/glTF/Fox.gltf',
    (gltf) => {
        mixer = new THREE.AnimationMixer(gltf.scene)

        foxActions.watching = mixer.clipAction(gltf.animations[0])
        foxActions.walking = mixer.clipAction(gltf.animations[1])
        foxActions.running = mixer.clipAction(gltf.animations[2])

        activeAction = foxActions.walking
        activeAction.play()

        gltf.scene.scale.set(0.025, .025, .025)
        scene.add(gltf.scene)
    }
)
// gltfLoader.load(
//     './models/FlightHelmet/glTF/FlightHelmet.gltf',
//     (gltf) => {
//         // scene.add(gltf.scene)
//
//         // for (const child of [...gltf.scene.children]) {
//         //     scene.add(child)
//         // }
//         //
//         // console.log(scene)
//     }
// )

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, .5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.VSMShadowMap // PCFSoftShadowMap deprecated in newer three.js (silently falls back to PCFShadowMap), VSMShadowMap is the soft-shadow replacement
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new THREE.Timer() // Clock deprecated in newer three.js, replaced by Timer
let previousTime = 0

const tick = () =>
{
    timer.update()
    const elapsedTime = timer.getElapsed()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    mixer?.update(deltaTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()