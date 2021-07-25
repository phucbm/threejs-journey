import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Helpers
 */
function getCirclePosition(numberOfPoints, radius = 10) {
    let radStep = 2 * Math.PI / numberOfPoints,
        radBegin = Math.PI,
        center = {x: 0, y: 0},
        coordinates = [];

    for (let i = 0; i < numberOfPoints; i++) {
        const rad = radBegin + radStep * i;
        coordinates.push({x: center.x + radius * Math.cos(rad), y: center.y + radius * Math.sin(rad)});
    }

    return coordinates;
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

// Axes helper
//scene.add(new THREE.AxesHelper(10));

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
camera.position.set(0, 12, 0);
//camera.lookAt(0, 0, 0);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;
controls.enabled = false;

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const textTexture = textureLoader.load("textures/matcap/2.png");


/**
 * Blocks Textures
 */
const getBlockTexturePath = (name) => `textures/minecraft/${name}.png`;
const blockTextures = [
    {name: 'Obsidian'},
    {name: 'EnderGemOre', pretty: 'Ender Gem Ore'},
    {name: 'Netherrack'},
    {name: 'Glowstone'},
    {name: 'WoodenPlanks', pretty: 'Wooden Planks'},
    {name: 'RedstoneLamp', pretty: 'Redstone Lamp'},
    {name: 'Dirt'},
    {name: 'DirtGrass', pretty: 'Dirt Grass'},
    {name: 'Cobweb'},
    {name: 'DiamondOre', pretty: 'Diamond Ore'},
    {name: 'GoldOre', pretty: 'Gold Ore'},
    {name: 'IronOre', pretty: 'Iron Ore'},
    {name: 'CoalOre', pretty: 'Coal Ore'},
    {name: 'Gravel'},
    {name: 'Wood'},
    {name: 'Sand'},
    {name: 'RedstoneOre', pretty: 'Redstone Ore'},
    {name: 'TopazOre', pretty: 'Topaz Ore'},
    {name: 'LapisOre', pretty: 'Lapis Ore'},
    {name: 'OddRockOre', pretty: 'Odd Rock Ore'}
];
const blockPositions = getCirclePosition(blockTextures.length, 10);
const textPositions = getCirclePosition(blockTextures.length, 10.8);

// generate textures
for (let i = 0; i < blockTextures.length; i++) {
    const blockName = blockTextures[i].name;
    const blockMaterialPath = getBlockTexturePath(blockName);

    // create texture
    blockTextures[i].textures = textureLoader.load(blockMaterialPath);

    // filter texture
    blockTextures[i].textures.generateMipmaps = false;
    blockTextures[i].textures.minFilter = THREE.NearestFilter;
    blockTextures[i].textures.magFilter = THREE.NearestFilter;
}


/**
 * Groups
 */
const group = new THREE.Group();
const groupText = new THREE.Group();
group.position.set(0, 10, 10);
groupText.position.set(0, 10, 10);

scene.add(group, groupText);


/**
 * Texts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load('fonts/dot-gothic-16-reg.json', (font) => {
    const textMaterial = new THREE.MeshMatcapMaterial({matcap: textTexture});

    for (let i = 0; i < blockTextures.length; i++) {
        const blockName = typeof blockTextures[i].pretty !== "undefined" ? blockTextures[i].pretty : blockTextures[i].name;

        // Create text "めっちゃ凄い"
        const textGeometry = new THREE.TextGeometry(`${blockName}`, {
            font: font,
            size: .12,
            height: .05,
        });
        textGeometry.center();

        const text = new THREE.Mesh(textGeometry, textMaterial);

        // position
        text.position.z = textPositions[i].x;
        text.position.y = textPositions[i].y;
        //text.lookAt(0, 0, 0);

        // Add text
        groupText.add(text);
    }
});


/**
 * Block objects
 */
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

for (let i = 0; i < blockTextures.length; i++) {
    const blockTexture = blockTextures[i].textures;

    // material
    const cubeMaterial = new THREE.MeshBasicMaterial({map: blockTexture});
    cubeMaterial.side = THREE.DoubleSide;

    // mesh
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    // position
    cube.position.z = blockPositions[i].x;
    cube.position.y = blockPositions[i].y;
    cube.lookAt(0, 0, 0);

    group.add(cube);
}


/**
 * Animate
 */

// group
const timeline = gsap.timeline({
        /*repeat: -1,
        delay: 1,*/
        defaults: {ease: 'linear', duration: 1},
        scrollTrigger: {
            trigger: 'body',
            scrub: true,
            start: 'top top',
            end: 'bottom bottom'
        }
    }),
    step = Math.PI * 2 / blockTextures.length;

for (let i = 0; i < blockTextures.length; i++) {
    timeline.to([group.rotation, groupText.rotation], {x: (i + 1) * step});
}

// Render using GSAP ticker
const render = () => {
    for (let i = 0; i < groupText.children.length; i++) {
        groupText.children[i].lookAt(camera.position);
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
};
// https://greensock.com/docs/v3/GSAP/gsap.ticker
gsap.ticker.add(render);