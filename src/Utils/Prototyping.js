import {
  BoxGeometry,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
} from "three"

const geometries = [
  new BoxGeometry(0.2, 0.2, 0.2),
  new ConeGeometry(0.2, 0.2, 64),
  new CylinderGeometry(0.2, 0.2, 0.2, 64),
  new IcosahedronGeometry(0.2, 8),
  new TorusGeometry(0.2, 0.04, 64, 32),
]

export function createRandomObjects(amount = 10) {
  let objects = []

  for (let i = 0; i < amount; i++) {
    const geometry = geometries[Math.floor(Math.random() * geometries.length)]
    const material = new MeshStandardMaterial({
      color: Math.random() * 0xffffff,
      roughness: 0.3,
      metalness: 0.0,
    })

    const object = new Mesh(geometry, material)

    object.position.x = Math.random() * 4 - 2
    object.position.y = Math.random() * 2
    object.position.z = Math.random() * 4 - 2

    object.rotation.x = Math.random() * 2 * Math.PI
    object.rotation.y = Math.random() * 2 * Math.PI
    object.rotation.z = Math.random() * 2 * Math.PI

    object.scale.setScalar(Math.random() + 0.5)

    object.castShadow = true
    object.receiveShadow = true

    objects.push(object)
  }

  return objects
}
