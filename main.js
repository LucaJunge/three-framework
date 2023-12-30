import "./style.css"
import { DirectionalLight, Vector3 } from "three"
import { App } from "./src/Entry"
import { createCube, createRandomObjects } from "./src/Entry"
import { createCapsule } from "./src/Utils/PrimitiveMeshes"

let app = new App()
app.camera.near = 0.001

/* XR Setup */
let xrSession = {
  requiredFeatures: ["local"],
  optionalFeatures: ["hand-tracking"],
}

let speed = 0.005

app.xr.setXRSessionFeatures("immersive-ar", xrSession)

app.addEventListener("xrstarted", (event) => {
  console.log("XR started")
})

app.addEventListener("xrended", (event) => {
  console.log("XR ended")
})

/* XR SETUP END */

// Add a listener for one of the controllers
let gamepad = null
app.xr.controllers[0].addEventListener("connected", (event) => {
  console.log("connected")
  gamepad = event.data.gamepad
})

let muffin = await app.loader.load("/muffin.glb")
let glb = muffin.scene
glb.position.z = -1
glb.position.y = -0.3
app.scene.add(glb)

// Create entities
/*let capsule = createCapsule()
capsule.scale.setScalar(0.3)
console.log(capsule)
capsule.position.z = -4
app.scene.add(capsule)*/

app.addEventListener("update", (event) => {
  if (gamepad) {
    glb.position.x += gamepad.axes[2] * speed
    glb.position.z += gamepad.axes[3] * speed
  }
})

// Add the xr button to the DOM
document.body.prepend(app.xr.xrButton)

// Add random objects for testing
app.scene.add(...createRandomObjects())

// Add light
let dirLight = new DirectionalLight(0xffffff, 1)
dirLight.position.x = -2
dirLight.position.z = -0.2
app.scene.add(dirLight)

// Start the game loop
app.start()
