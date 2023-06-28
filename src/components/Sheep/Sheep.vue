<template>
  <div
    class="sheep-component"
    ref="mount"
    @mousedown="startRotation"
    @mousemove="updateRotation"
    @mouseup="stopRotation"
    @touchstart="startRotation"
    @touchmove="updateRotation"
    @touchend="stopRotation"
  ></div>
</template>

<script lang="ts">
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import sheep from '@/assets/sheep.glb'

export default {
  name: 'SheepComponent',
  setup() {
    const mount = ref<HTMLElement | null>(null)
    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let model: THREE.Group | null = null
    let isRotating = false
    let lastX = 0
    let lastY = 0

    // Render Loop
    const animate = function () {
      requestAnimationFrame(animate)
      if (model) {
        model.rotation.y += 0.005
      }
      renderer!.render(scene!, camera!)
    }

    onMounted(() => {
      scene = new THREE.Scene()
      scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 1))
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 10
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setClearColor(0xffffff)
      renderer.setSize(window.innerWidth, window.innerHeight)
      mount.value?.appendChild(renderer.domElement)

      const loader = new GLTFLoader()
      loader.load(
        sheep,
        (gltf) => {
          model = gltf.scene
          scene!.add(model)
          animate()
        },
        undefined,
        (error) => console.error(error)
      )

      window.addEventListener('resize', () => {
        if (camera && renderer) {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
        }
      })
    })

    const startRotation = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      isRotating = true
      const { clientX, clientY } = 'touches' in event ? event.touches[0] : event
      lastX = clientX
      lastY = clientY
    }

    const updateRotation = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      if (!isRotating || !model) return

      const { clientX, clientY } = 'touches' in event ? event.touches[0] : event
      const deltaX = (clientX - lastX) * 0.01
      const deltaY = (clientY - lastY) * 0.01

      model.rotation.y += deltaX
      model.rotation.x += deltaY

      lastX = clientX
      lastY = clientY
    }

    const stopRotation = () => {
      isRotating = false
    }

    onBeforeUnmount(() => {
      mount.value?.removeChild(renderer!.domElement)
    })

    return {
      mount,
      startRotation,
      updateRotation,
      stopRotation
    }
  }
}
</script>

<style lang="scss" scoped>
.sheep-component {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
