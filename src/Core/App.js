import {
  AmbientLight,
  Color,
  EventDispatcher,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three"
import { WebXRHandler } from "./WebXR"
import { Loader } from "./Loader"

let instance = null

export class App extends EventDispatcher {
  constructor() {
    super()

    if (instance) {
      return instance
    }
    instance = this

    this.canvas = document.querySelector("#app")
    this.canvas.classList.add("app")
    this.scene = new Scene()
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.renderer = new WebGLRenderer({ canvas: this.canvas, antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.pixelRatio = Math.max(window.devicePixelRatio, 2)
    this.renderer.xr.enabled = true
    this.renderer.setClearColor(new Color(0.0, 0.0, 0.0))

    // Components
    this.xr = new WebXRHandler()
    this.loader = new Loader()

    /* Default Lighting */
    let ambientLight = new AmbientLight(0xffffff, 1)
    this.scene.add(ambientLight)

    window.addEventListener("resize", () => {
      this.onResize()
    })
  }

  start() {
    if (this.renderer.xr) {
      this.xr.checkXRSupport()
    }

    this.renderer.setAnimationLoop(() => {
      this.dispatchEvent({ type: "update", message: "update" })

      this.renderer.render(this.scene, this.camera)
    })
  }

  onResize() {
    let width = window.innerWidth
    let height = window.innerHeight
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }
}
