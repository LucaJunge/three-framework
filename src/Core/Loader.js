import { GLTFLoader } from "three/addons/loaders/GLTFLoader"
import { DRACOLoader } from "three/addons/loaders/DRACOLoader"

export class Loader {
  constructor() {
    this.gltfLoader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath("../libs/draco/gltf/")
    this.gltfLoader.setDRACOLoader(this.dracoLoader)
  }

  async load(modelData) {
    return await this.gltfLoader.loadAsync(modelData)
  }
}
