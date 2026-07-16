<template>
  <div ref="container" class="building-viewer-3d" role="img" aria-label="Galpao 3D" />
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { FrameModel, FrameNode, Modulation } from '../../types'

const props = defineProps<{ modulation: Modulation; frame: FrameModel }>()
const container = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let controls: OrbitControls | null = null
let frameId = 0
let resizeObserver: ResizeObserver | null = null

onMounted(async () => {
  await nextTick()
  setupScene()
  renderBuilding()
})

watch(
  () => [props.modulation.id, props.modulation.repeatCount, props.modulation.frameSpacing, props.frame.frameId],
  () => renderBuilding(),
)

onBeforeUnmount(() => {
  if (frameId) cancelAnimationFrame(frameId)
  frameId = 0
  resizeObserver?.disconnect()
  controls?.dispose()
  renderer?.dispose()
})

function setupScene() {
  if (!container.value) return

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xfbfdff)

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000)
  camera.position.set(28, 18, 34)

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.innerHTML = ''
  container.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.target.set(totalWidth() / 2, maxHeight() / 2, depth() / 2)

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container.value)
  resize()
  animate()
}

function renderBuilding() {
  if (!scene || !camera || !controls) return
  scene.clear()

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8e0e8, 2.6))
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
  directionalLight.position.set(20, 30, 15)
  scene.add(directionalLight)

  const group = new THREE.Group()
  const material = new THREE.MeshStandardMaterial({ color: 0x146eb4, roughness: 0.55, metalness: 0.15 })
  const columnMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.1 })
  const purlinMaterial = new THREE.LineBasicMaterial({ color: 0x94a3b8 })

  for (let index = 0; index < props.modulation.repeatCount; index += 1) {
    const z = index * props.modulation.frameSpacing
    for (const member of membersWithNodes()) {
      const start = new THREE.Vector3(member.start.x, member.start.y, z)
      const end = new THREE.Vector3(member.end.x, member.end.y, z)
      group.add(makeTube(start, end, member.type === 'column' || member.type === 'external_column' ? columnMaterial : material))
    }
  }

  for (const pair of roofPairs()) {
    const points = []
    for (let index = 0; index < props.modulation.repeatCount; index += 1) {
      points.push(new THREE.Vector3(pair.x, pair.y, index * props.modulation.frameSpacing))
    }
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), purlinMaterial))
  }

  group.add(makeGround())
  scene.add(group)

  controls.target.set(totalWidth() / 2, maxHeight() / 2, depth() / 2)
  camera.position.set(totalWidth() * 1.15, maxHeight() * 1.2, Math.max(depth() * 1.5, 24))
  controls.update()
}

function membersWithNodes() {
  const nodeByKey = new Map(props.frame.nodes.map((node) => [node.key, node]))
  return props.frame.members
    .map((member) => ({ ...member, start: nodeByKey.get(member.startNodeKey), end: nodeByKey.get(member.endNodeKey) }))
    .filter((member): member is typeof member & { start: FrameNode; end: FrameNode } => Boolean(member.start && member.end))
}

function roofPairs() {
  const roofNodes = props.frame.nodes.filter((node) => node.y > 0).sort((a, b) => a.x - b.x)
  return roofNodes.map((node) => ({ x: node.x, y: node.y }))
}

function makeTube(start: THREE.Vector3, end: THREE.Vector3, material: THREE.Material) {
  const direction = new THREE.Vector3().subVectors(end, start)
  const length = direction.length()
  const geometry = new THREE.CylinderGeometry(0.06, 0.06, length, 10)
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.copy(start).add(direction.multiplyScalar(0.5))
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(end, start).normalize())
  return mesh
}

function makeGround() {
  const geometry = new THREE.PlaneGeometry(Math.max(totalWidth(), 1), Math.max(depth(), 1))
  const material = new THREE.MeshStandardMaterial({ color: 0xe8eef5, side: THREE.DoubleSide })
  const ground = new THREE.Mesh(geometry, material)
  ground.rotation.x = Math.PI / 2
  ground.position.set(totalWidth() / 2, -0.02, depth() / 2)
  return ground
}

function resize() {
  if (!container.value || !renderer || !camera) return
  const { width, height } = container.value.getBoundingClientRect()
  renderer.setSize(width, height)
  camera.aspect = width / Math.max(height, 1)
  camera.updateProjectionMatrix()
}

function animate() {
  if (!renderer || !scene || !camera) return
  controls?.update()
  renderer.render(scene, camera)
  frameId = requestAnimationFrame(animate)
}

function totalWidth() {
  return Math.max(...props.frame.nodes.map((node) => node.x), 1)
}

function maxHeight() {
  return Math.max(...props.frame.nodes.map((node) => node.y), 1)
}

function depth() {
  return Math.max(props.modulation.repeatCount - 1, 0) * props.modulation.frameSpacing
}
</script>

