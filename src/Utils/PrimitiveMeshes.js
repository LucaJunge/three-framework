import {
  BoxGeometry,
  CapsuleGeometry,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
} from "three"

let boxGeometry = new BoxGeometry()
let sphereGeometry = new SphereGeometry()
let material = new MeshStandardMaterial({ color: 0xbf616a })

export function createCube() {
  let mesh = new Mesh(boxGeometry, material)
  return mesh
}

export function createSphere() {
  let mesh = new Mesh(sphereGeometry, material)
  return mesh
}

export function createCapsule() {
  let geometry = new CapsuleGeometry(1, 2, 2, 8)
  let material = new MeshStandardMaterial({ color: 0xbababa })
  let mesh = new Mesh(geometry, material)
  return mesh
}
