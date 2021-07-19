# Three.js Journey

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Exercise notes

- Resize canvas:
  - Use CSS to set the canvas size
  - Use window `resize` event to update camera (aspect & updateProjectionMatrix) and renderer (size and pixel ratio).
- Stair effect issue: limit the device pixel ratio using `renderer.setPixelRatio()` to gain a better and consistent performance.
- Pixel ratio: 2 is enough (retina), 3 is maximum.
- Fullscreen mode: using `canvas.requestFullscreen()` and `document.exitFullscreen()`, safari need webkit prefix.