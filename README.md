# Three.js Journey

> Demo: https://phucbm.github.io/threejs-journey/

---

Lesson recap and exercises. Each lesson is a standalone page (`<slug>/index.html` + `<slug>/script.ts`) built with plain Vite + TypeScript — no framework. See `CLAUDE.md` for the infra details.

The original Nuxt 3 / Vue version of this site is preserved on the [`legacy/nuxt-vue`](https://github.com/phucbm/threejs-journey/tree/legacy/nuxt-vue) branch.

## Chapter 01 - Basics

### 01. Webpack

- An 3D object is also called a Mesh.
- A Mesh needs a Geometry and a Material.
- Use Camera to adjust the POV of the scene.
- Perspective is the default camera.
- A Camera needs an aspect ratio and an FOV (degree).
- A Renderer need width/height, where to render into, a camera to see and a scene with every mesh's in it.

### 02. Transform objects

- Use Group to control multiple Mesh at once.
- Position, Scale and Rotation is Vector3, so they can be assigned using `.set(x, y, z)`.
- The order of axes when doing rotation is IMPORTANT!
- Messy order could cause "gimbal lock", use `mesh.rotation.reorder('YXZ')` to set the correct order before doing any rotation changing.
- Quaternion <=> Rotation
- Use `AxesHelper` to show axes.
- Use `camera.lookAt(position)` to set focus on a position.

### 03. Animations

- Use `requestAnimationFrame` to update value => create animations.
- Different framerate on different devices could lead to **inconsistent animation's duration**.
- Workaround #1: create a deltaTime with `Date.now()`. **Delta time is the amount of milliseconds that elapsed since the previous tick**.
- Workaround #2: use `clock.getElapsedTime()`.
- Workaround #3: use GSAP.
- We can also use GSAP to perform the render process.

### 04. Cameras

- FOV: vertical height of the camera
- Near & Far: how close and how far the camera can see
- Do not use extreme value like 0.0001 and 99999 for near & far to prevent **z-fighting**
- Controlling camera with `mousemove` event or OrbitControls

### 05. Fullscreen and resizing

- Resize canvas:
    - Use CSS to set the canvas size
    - Use window `resize` event to update camera (aspect & updateProjectionMatrix) and renderer (size and pixel ratio).
- Stair effect issue: limit the `devicePixelRatio` using `renderer.setPixelRatio()` to gain a better and consistent performance.
- Pixel ratio: 2 is enough (retina), 3 is maximum.
- Fullscreen mode: using `canvas.requestFullscreen()` and `document.exitFullscreen()`, safari need webkit prefix.

### 06. Geometries

- Vertices (coordinates)
- Use `Float32Array`: to gain a better performance with custom geometries
- `THREE.BufferGeometry()`

### 07. Debug UI

- dat.GUI [github](https://github.com/dataarts/dat.gui) [examples](https://jsfiddle.net/ikatyang/182ztwao/)
- Each item in the debug panel is also called a "tweak"

### 08. Textures

- Load textures (images) using `THREE.TextureLoader()`
- If texture could be changed after init, set `texture.needsUpdate` to `true`
- Get UV coordinates at `geometry.attributes.uv`
- Texture filter
- Texture optimization
- Texture resources: [poliigon.com](poliigon.com), [3dtextures.me](3dtextures.me), [arroway-textures.ch](arroway-textures.ch)

### 09. Materials

- `material.opacity`, `material.alphaMap` need `material.transparent = true`
- `material.side = THREE.DoubleSide;` could slow down the performance
- `THREE.MeshNormalMaterial()`, `flatShading`
- `THREE.MeshStandardMaterial()`, `aoMap`, `uv2`

### 10. 3D Text

- `THREE.FontLoader()`, convert font face to json with [Facetype.js](http://gero3.github.io/facetype.js/)
- `THREE.TextGeometry`, `textGeometry.center()`
- [Matcaps repository](https://github.com/nidorx/matcaps)
- `console.time()` and `console.timeEnd()`


---

## Chapter 02 - Classic techniques

### 11. Lights

- Lights
- Bake: create lights from textures
- Light helpers, rectAreaLightHelper is not a part of THREE

### 12. Shadows

- Lights that support shadows: PointLight, DirectionalLight, SpotLight
- Baking shadow: use textures to simulate the shadows, but shadows created by this way will be static

### 13. The haunted house

### 14. Particles

- `THREE.PointsMaterial()`, `THREE.Points()`

### 15. Galaxy generator

- `geometry.dispose()`, `material.dispose()`, `scene.remove(mesh)`

### 16. Raycaster

- `THREE.Raycaster()`: create hover, click events

### 20. Physics

#### 3D physics libraries

- Ammo.js (most used)
- Cannon.js (easier to implement and understand)
- Oimo.js

#### 2D physics libraries

- Matter.js
- P2.js
- Planck.js
- Box2D.js

---

## Playground

Just pulling some crazy ideas out of my sweaty brain.

### The mess

- Milestone: lesson #10
- Things in this mess: `gsap`, `OrbitControls`, `object.geometry.setDrawRange()`, `THREE.BufferGeometry()`

### Infinite Minecraft Blocks

- Milestone: lesson #13
- Keywords: `gsap/ScrollTrigger`, `THREE.FontLoader()`, `THREE.TextGeometry()`, `THREE.MeshBasicMaterial()`
  , `THREE.TextureLoader()`

---

## Development

```shell
# Install packages
pnpm install

# Start dev server
pnpm dev

# Build the static site
pnpm build

# Preview the production build locally
pnpm preview
```

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which builds with `pnpm build` and deploys `dist/` to GitHub Pages.