export interface Lesson {
    slug: string;
    number?: string;
    title: string;
    description: string;
    /** Defaults to 'vanilla' when omitted. Set to 'react' for react-three-fiber lessons. */
    type?: 'vanilla' | 'react';
    /** Excluded from the nav list but still a real page (mirrors the old NavBlock exclude list). */
    hidden?: boolean;
}

export const lessons: Lesson[] = [
    {
        slug: '00-textures', number: '00', title: 'Textures',
        description: 'Placeholder — not started yet.', hidden: true,
    },
    {
        slug: '01-setup', number: '01', title: 'Setup',
        description: 'Setting up a Three.js scene: mesh, camera, and renderer basics.',
    },
    {
        slug: '02-transform-objects', number: '02', title: 'Transform objects',
        description: 'Positioning, scaling, and rotating objects with Vector3, plus avoiding gimbal lock.',
    },
    {
        slug: '03-animations', number: '03', title: 'Animations',
        description: 'Animating with requestAnimationFrame, delta time, and GSAP.',
    },
    {
        slug: '04-cameras', number: '04', title: 'Cameras',
        description: 'Perspective camera FOV/near/far, mouse-controlled and OrbitControls cameras.',
    },
    {
        slug: '05-fullscreen-resizing', number: '05', title: 'Fullscreen and resizing',
        description: 'Resizing the canvas and handling devicePixelRatio and fullscreen mode.',
    },
    {
        slug: '06-geometries', number: '06', title: 'Geometries',
        description: 'Building custom geometries with BufferGeometry and Float32Array vertices.',
    },
    {
        slug: '07-debug-ui', number: '07', title: 'Debug UI',
        description: 'Adding a tweak panel (lil-gui) to control the scene live.',
    },
    {
        slug: '08-textures', number: '08', title: 'Textures',
        description: 'Loading and optimizing textures with TextureLoader and UV coordinates.',
    },
    {
        slug: '09-materials', number: '09', title: 'Materials',
        description: 'Exploring materials: MeshNormalMaterial, MeshStandardMaterial, maps, and transparency.',
    },
    {
        slug: '10-3d-text', number: '10', title: '3D Text',
        description: 'Rendering 3D text with FontLoader, TextGeometry, and matcap materials.',
    },
    {
        slug: '11-lights', number: '11', title: 'Lights',
        description: 'Lighting the scene and baking light into textures.',
    },
    {
        slug: '12-shadows', number: '12', title: 'Shadows',
        description: 'Real-time and baked shadows with PointLight, DirectionalLight, and SpotLight.',
    },
    {
        slug: '13-haunted-house', number: '13', title: 'The haunted house',
        description: 'A haunted house scene combining geometries, textures, lights, and shadows.',
    },
    {
        slug: '14-particles', number: '14', title: 'Particles',
        description: 'Rendering particle systems with Points and PointsMaterial.',
    },
    {
        slug: '15-galaxy-generator', number: '15', title: 'Galaxy generator',
        description: 'A generative particle galaxy with GUI-tweakable parameters.',
    },
    {
        slug: '16-raycaster', number: '16', title: 'Raycaster',
        description: 'Hover and click interactions using Raycaster.',
    },
    {
        slug: '17-scroll-based-animation', number: '17', title: 'Scroll based animation',
        description: 'Animating objects and camera based on scroll position with GSAP and lil-gui.',
    },
    {
        slug: '20-physics', number: '20', title: 'Physics',
        description: 'Create a physics world using cannon.js',
    },
    {
        slug: '21-imported-models', number: '21', title: 'Imported models',
        description: 'Loading external 3D models with GLTFLoader — glTF format, Draco compression, and animated models.',
    },
    {
        slug: '22-raycaster-and-mouse-events', number: '22', title: 'Raycaster and mouse events',
        description: 'Raycasting from the mouse — hover and click detection on multiple objects, plus intersecting an imported glTF model.',
    },
    {
        slug: '23-custom-models-with-blender', number: '23', title: 'Custom models with Blender',
        description: 'Loading a custom glTF model exported from Blender, with Draco compression support.',
    },
    {
        slug: '24-environment-map', number: '24', title: 'Environment map',
        description: 'Lighting and reflecting a scene with environment maps — cube maps, equirectangular HDRs, and generated skyboxes.',
    },
    {
        slug: 'mineblocks', title: 'Infinite Minecraft Blocks',
        description: 'A scroll-driven infinite grid of Minecraft-style blocks built with GSAP ScrollTrigger and Three.js text geometry.',
    },
    {
        slug: 'the-mess', title: 'The mess',
        description: 'An experimental scene mixing OrbitControls, custom draw ranges, and buffer geometry.',
    },
];
