import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
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
const matcapTexture = textureLoader.load('textures/matcaps/7.png');

/**
 * Blocks Textures
 */
const getBlockTexturePath = (name) => `textures/minecraft/${name}.png`;
const blockTextures = [
    {
        name: 'Obsidian',
        description:
            `Name: Obsidian
Type: Block, Building block
Mine with: Diamond Pickaxe
Drops: Itself
`
    },
    {
        name: 'Dirt',
        description:
            `Name: Dirt
Type: Block
Mine with: Hand, Shovel
Drops: Itself
`
    },
    {
        name: 'DirtGrass', pretty: 'Grass',
        description:
            `Name: Grass
Type: Blocks, Plants
Mine with: Hand
Drops: Dirt
`
    },
    {
        name: 'Netherrack',
        description:
            `Name: Netherrack
Type: Blocks, Construction Materials
Mine with: Stone pickaxe
Drops: Itself
`
    },
    {
        name: 'Glowstone',
        description:
            `Name: Glow Stone
Type: Block
Mine with: Hand, Pickaxe
Drops: 4 Glowstone dust
`
    },
    {
        name: 'WoodenPlanks', pretty: 'Wooden Planks',
        description:
            `Name: Wooden Planks
Type: Solid
Mine with: Hand, Axes
Drops: itself
`
    },
    {
        name: 'RedstoneLamp', pretty: 'Redstone Lamp',
        description:
            `A redstone lamp can be mined 
by hand or with any tool, 
dropping itself as an item.
Name: Redstone Lamp
Type: Block
`
    },
    {
        name: 'Cobweb',
        description:
            `Name: Cobweb
Type: Block
Mine with: Shears, Swords
Drops: String
`
    },
    {
        name: 'DiamondOre', pretty: 'Diamond Ore',
        description:
            `Name: Diamond Ore
Type: Ore
Mine with: Iron pickaxe or higher
Drops: 10-12 experience points
`
    },
    {
        name: 'GoldOre', pretty: 'Gold Ore',
        description:
            `Name: Gold Ore
Type: Solid, natural, ore
Mine with: Iron pickaxe or higher
Drops: If mined with an iron pickaxe 
or above, gold ore drops itself. 
Otherwise it drops nothing.
`
    },
    {
        name: 'IronOre', pretty: 'Iron Ore',
        description:
            `Name: Iron Ore
Type: Block
Mine with: Stone pickaxe or higher
Drops: If mined with a stone pickaxe 
or above, iron ore drops itself. 
Otherwise, it drops nothing.
`
    },
    {
        name: 'CoalOre', pretty: 'Coal Ore',
        description:
            `Name: Coal Ore
Type: Solid, natural, ore
Mine with: Wooden pickaxe
Drops: coal and 
3-4 experience points
`
    },
    {
        name: 'Gravel',
        description:
            `Name: Gravel
Type: Solid, natural
Mine with: Hand, Shovels
Drops: Itself (9/10 chance), 
Flint (1/10 chance)
`
    },
    {
        name: 'Wood',
        description:
            `Name: Wood/tree wood
Type: Solid block
Mine with: Axe
Drops: wood
`
    },
    {
        name: 'Sand',
        description:
            `Name: Sand
Type: Solid, natural
Mine with: Hand, shovels
`
    },
    {
        name: 'RedstoneOre', pretty: 'Redstone Ore',
        description:
            `Name: Redstone Ore
Type: Solid, natural, ore
Mine with: Iron pickaxe
Drops: 3-5 redstone dust 
and 4-6 experience points
`
    },
    {
        name: 'TopazOre', pretty: 'Topaz Ore',
        description:
            `Name: Topaz Ore
Type: Ore
Mine with: Stone pickaxe or higher
Drops: 1-2 topaz and 
4-5 experience points
`
    },
    {
        name: 'LapisOre', pretty: 'Lapis Ore',
        description:
            `Name: Lapis Lazuli Ore
Type: Block, Decoration
Mine with: Iron pickaxe or higher
Drops: 4-6 lapis lazuli
`
    },
    {
        name: 'OddRockOre', pretty: 'Odd Rock Ore',
        description:
            `Name: Odd rock ore
Type: Ore
Mine with: Iron Pickaxe or higher
Drops: Odd rock
`
    },
    {
        name: 'EnderGemOre',
        pretty: `Ender Gem Ore`,
        description:
            `Name: Ender Gem Ore
Type: Block
Mine with: Iron pickaxe or better
Drops: Ender gem and Experience
`
    }
];
const blockPositions = getCirclePosition(blockTextures.length, 10);
const textPositions = getCirclePosition(blockTextures.length, 10.8);
const descriptionPositions = getCirclePosition(blockTextures.length, 10.15);

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
const groupDescription = new THREE.Group();
group.position.set(0, 10, 10);
groupText.position.set(0, 10, 10);
groupDescription.position.set(0, 10, 10);

scene.add(group, groupText, groupDescription);


/**
 * Texts
 */
const fontLoader = new THREE.FontLoader();
fontLoader.load('fonts/dot-gothic-16-reg.json', (font) => {
    const textMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});
    const descriptionMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture});

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

        // Add text
        groupText.add(text);


        // description
        const blockDescription = blockTextures[i].description;

        if (typeof blockDescription !== "undefined") {
            const descriptionGeometry = new THREE.TextGeometry(blockDescription, {
                font: font,
                size: window.innerWidth > 768 ? .02 : .014,
                height: .002,
            });
            descriptionGeometry.center();

            const description = new THREE.Mesh(descriptionGeometry, descriptionMaterial);

            // position
            description.position.z = descriptionPositions[i].x;
            description.position.y = descriptionPositions[i].y;

            // Add text
            groupDescription.add(description);
        }
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
let direction = 0;
const timeline = gsap.timeline({
        //repeat: -1,
        //delay: 1,
        defaults: {/*ease: "slow(0.7, 0.7, false)",*/ease: "linear", duration: 2},
        scrollTrigger: {
            trigger: 'body',
            scrub: true,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: self => {
                direction = self.direction;
            }
        },
        onUpdate: () => {
            if (timeline.progress() === 1 && direction === 1) {
                window.scrollTo(0, 0);
            }
            if (timeline.progress() === 0 && direction === -1) {
                window.scrollTo(0, document.body.scrollHeight);
            }
        }
    }),
    step = Math.PI * 2 / blockTextures.length;

for (let i = 0; i < blockTextures.length; i++) {
    timeline.to([group.rotation, groupText.rotation, groupDescription.rotation], {x: (i + .5) * step}/*, ">+=2"*/);
}

timeline.timeScale(1.2)

// Render using GSAP ticker
const render = () => {
    for (let i = 0; i < groupText.children.length; i++) {
        groupText.children[i].lookAt(camera.position);
    }

    for (let i = 0; i < groupDescription.children.length; i++) {
        groupDescription.children[i].lookAt(camera.position);
        groupDescription.children[i].rotation.z = 0;
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)
};
// https://greensock.com/docs/v3/GSAP/gsap.ticker
gsap.ticker.add(render);