import "./style.css"
import { Vector3 } from "three"
import { App } from "./src/Entry"
import { createCube } from "./src/Entry"

let app = new App()

app.camera.position.set(1, 1, 1)
app.camera.lookAt(new Vector3(0, 0, 0))

let xrSession = {
  requiredFeatures: ["local"],
  optionalFeatures: ["hand-tracking"],
}

app.xr.setXRSessionFeatures("immersive-vr", xrSession)

app.addEventListener("xrstarted", (event) => {
  console.log("XR started")
})

app.addEventListener("xrended", (event) => {
  console.log("XR ended")
})

app.addEventListener("update", (event) => {
  console.log("update")
})

app.scene.add(createCube())

app.start()

console.log(app.scene.children)
