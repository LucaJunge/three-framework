import { BufferGeometry, EventDispatcher, Line, Vector3 } from "three"
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory.js"
import { XRHandModelFactory } from "three/addons/webxr/XRHandModelFactory"
import { App } from "./App"

export class WebXRHandler extends EventDispatcher {
  constructor() {
    super()

    this.app = new App()
    this.xrMode = "inline"
    this.xrSessionFeatures = {
      requiredFeatures: ["local"],
      optionalFeatures: ["hand-tracking"],
    }
    this.xrSession = null
    this.xrButton = this.createXRButton()
    this.controllers = this.setupControllers()
  }

  setXRSessionFeatures(mode = "inline", features = {}) {
    this.xrMode = mode
    this.xrSessionFeatures = features
  }

  checkXRSupport() {
    // First check: The API is there
    if ("xr" in navigator) {
      // Second check: The session mode is supported
      navigator.xr.isSessionSupported(this.xrMode).then((isSupported) => {
        if (isSupported) {
          this.app.dispatchEvent({
            type: "xrsupported",
            message: {
              isSupported: true,
            },
          })
        } else {
          this.app.dispatchEvent({
            type: "xrsupported",
            message: {
              isSupported: false,
              reason: `The session mode '${this.xrMode}' is not supported on this device`,
            },
          })
        }
      })
    } else {
      // XR not in navigator
      this.app.dispatchEvent({
        type: "xrsupported",
        message: {
          isSupported: false,
          reason: "The WebXR API does not exist in navigator",
        },
      })
    }
  }

  onSessionEnded = () => {
    this.xrSession.removeEventListener("end", this.onSessionEnded)

    this.xrSession = null

    this.app.dispatchEvent({ type: "xrended", message: "xrended" })
  }

  onSessionStarted = async (session) => {
    session.addEventListener("end", this.onSessionEnded)

    this.app.renderer.xr.setReferenceSpaceType("local")

    await this.app.renderer.xr.setSession(session)

    this.xrSession = session

    this.app.dispatchEvent({ type: "xrstarted", message: "xrstarted" })
  }

  createXRButton() {
    let button = document.createElement("button")
    button.id = "xr-button"
    button.disabled = true
    button.innerText = "XR not available"

    this.app.addEventListener("xrsupported", (event) => {
      console.log("xrsupported", event)
      if (event.message.isSupported) {
        //Enable the XR button
        button.innerText = "Start XR"
        button.disabled = false

        // Add the event listener
        button.addEventListener("click", () => {
          this.startXR()
        })
      }
    })

    return button
  }

  setupControllers() {
    let controllerModelFactory = new XRControllerModelFactory()
    let handModelFactory = new XRHandModelFactory()

    let controllers = []

    for (let i = 0; i < 2; i++) {
      let controllerDevice = this.app.renderer.xr.getController(i)
      controllers.push(controllerDevice)

      let handDevice = this.app.renderer.xr.getHand(i)
      handDevice.add(handModelFactory.createHandModel(handDevice, "mesh"))
      this.app.scene.add(handDevice)

      // Add raycast lines to controllers
      let geometry = new BufferGeometry().setFromPoints([
        new Vector3(0, 0, 0),
        new Vector3(0, 0, -1),
      ])

      let line = new Line(geometry)
      line.name = "line"
      line.scale.z = 3
      controllerDevice.add(line.clone())

      // Add the corresponding grip space for correct mesh placement
      let controllerGrip = this.app.renderer.xr.getControllerGrip(i)
      controllerGrip.add(
        controllerModelFactory.createControllerModel(controllerGrip)
      )

      this.app.scene.add(controllerDevice)
      this.app.scene.add(controllerGrip)
    }

    return controllers
  }

  async startXR() {
    if (this.xrSession !== null) {
      console.log("There is already an active XR session. Exiting...")
      this.xrSession.end()
    }

    try {
      let requestedSession = await navigator.xr.requestSession(
        this.xrMode,
        this.xrSessionFeatures
      )

      this.onSessionStarted(requestedSession)
    } catch (error) {
      console.error(error)
    }
  }
}
