import { EventDispatcher as r, Scene as a, PerspectiveCamera as o, WebGLRenderer as h, Color as d, AmbientLight as p, BoxGeometry as c, SphereGeometry as l, MeshStandardMaterial as u, Mesh as i } from "three";
class x extends r {
  constructor() {
    super(), this.xrMode = "inline", this.xrSessionFeatures = {
      requiredFeatures: ["local"],
      optionalFeatures: ["hand-tracking"]
    }, this.xrSession = null;
  }
  setXRSessionFeatures(e = "inline", t = {}) {
    this.xrMode = e, this.xrSessionFeatures = t;
  }
  checkXRSupport() {
    "xr" in navigator ? navigator.xr.isSessionSupported(this.xrMode).then((e) => {
      e ? this.dispatchEvent({
        type: "xrsupported",
        message: {
          isSupported: !0
        }
      }) : this.dispatchEvent({
        type: "xrsupported",
        message: {
          isSupported: !1,
          reason: `The session mode '${this.xrMode}' is not supported on this device`
        }
      });
    }) : this.dispatchEvent({
      type: "xrsupported",
      message: {
        isSupported: !1,
        reason: "The WebXR API does not exist in navigator"
      }
    });
  }
  async startXR() {
    this.xrSession !== null && (console.log("There is already an active XR session. Exiting..."), this.xrSession.end());
    try {
      let e = await navigator.xr.requestSession(
        this.xrMode,
        this.xrSessionFeatures
      );
      this.onSessionStarted(e);
    } catch (e) {
      console.error(e);
    }
  }
}
class v extends r {
  constructor() {
    super(), this.canvas = document.querySelector("#app"), this.canvas.classList.add("app"), this.scene = new a(), this.camera = new o(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1e3
    ), this.renderer = new h({ canvas: this.canvas, antialias: !0 }), this.renderer.setSize(window.innerWidth, window.innerHeight), this.renderer.pixelRatio = Math.max(window.devicePixelRatio, 2), this.renderer.xr.enabled = !0, this.renderer.setClearColor(new d(0, 0, 0)), this.xr = new x();
    let e = new p(16777215, 1);
    this.scene.add(e), window.addEventListener("resize", () => {
      this.onResize();
    });
  }
  start() {
    this.renderer.xr && this.xr.checkXRSupport(), this.renderer.setAnimationLoop(() => {
      this.dispatchEvent({ type: "update", message: "update" }), this.renderer.render(this.scene, this.camera);
    });
  }
  onResize() {
    let e = window.innerWidth, t = window.innerHeight;
    this.camera.aspect = e / t, this.camera.updateProjectionMatrix(), this.renderer.setSize(e, t);
  }
}
let w = new c(), m = new l(), n = new u({ color: 12542314 });
function g() {
  return new i(w, n);
}
function f() {
  return new i(m, n);
}
export {
  v as App,
  x as WebXRHandler,
  g as createCube,
  f as createSphere
};
