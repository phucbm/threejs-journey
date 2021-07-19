# three.js journey
https://threejs-journey.xyz/

## Chapter 01 - Basics

### 04. Webpack

- An 3D object is also called a Mesh.
- A Mesh needs a Geometry and a Material.
- Use Camera to adjust the POV of the scene.
- Perspective is the default camera.
- A Camera needs an aspect ratio and an FOV (degree).
- A Renderer need width/height, where to render into, a camera to see and a scene with every mesh's in it.

### 05. Transform objects

- Use Group to control multiple Mesh at once.
- Position, Scale and Rotation is Vector3, so they can be assigned using `.set(x, y, z)`.
- The order of axes when doing rotation is IMPORTANT!
- Messy order could cause "gimbal lock", use `mesh.rotation.reorder('YXZ')` to set the correct order before doing any rotation changing.
- Quaternion <=> Rotation
- Use `AxesHelper` to show axes.
- Use `camera.lookAt(position)` to set focus on a position.

### 06. Animations

- Use `requestAnimationFrame` to update value => create animations.
- Different framerate on different devices could lead to **inconsistent animation's duration**.
- Workaround #1: create a deltaTime with `Date.now()`. **Delta time is the amount of milliseconds that elapsed since the previous tick**.
- Workaround #2: use `clock.getElapsedTime()`.
- Workaround #3: use GSAP.
- We can also use GSAP to perform the render process.

### 07. Cameras

- FOV: vertical height of the camera
- Near & Far: how close and how far the camera can see
- Do not use extreme value like 0.0001 and 99999 for near & far to prevent **z-fighting**
- Controlling camera with `mousemove` event or OrbitControls

### 08. Fullscreen and resizing

- Resize canvas:
    - Use CSS to set the canvas size
    - Use window `resize` event to update camera (aspect & updateProjectionMatrix) and renderer (size and pixel ratio).
- Stair effect issue: limit the `devicePixelRatio` using `renderer.setPixelRatio()` to gain a better and consistent performance.
- Pixel ratio: 2 is enough (retina), 3 is maximum.
- Fullscreen mode: using `canvas.requestFullscreen()` and `document.exitFullscreen()`, safari need webkit prefix.

### 09. Geometries
### 10. Debug UI
### 11. Textures
### 12. Materials
### 13. 3D Text

## Chapter 02 - Classic techniques

### 14. Lights