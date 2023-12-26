import { EventDispatcher } from "three"

export class WebXRHandler extends EventDispatcher {
  constructor() {
    super()

    this.xrMode = "inline"
    this.xrSessionFeatures = {
      requiredFeatures: ["local"],
      optionalFeatures: ["hand-tracking"],
    }
    this.xrSession = null
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
          this.dispatchEvent({
            type: "xrsupported",
            message: {
              isSupported: true,
            },
          })
        } else {
          this.dispatchEvent({
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
      this.dispatchEvent({
        type: "xrsupported",
        message: {
          isSupported: false,
          reason: "The WebXR API does not exist in navigator",
        },
      })
    }
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
