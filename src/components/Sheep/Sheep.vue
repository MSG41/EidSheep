<template>
  <div
    class="sheep-component"
    ref="mount"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  ></div>
</template>

<script lang="ts">
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import sheep from '@/assets/sheep.glb'

export default {
  name: 'SheepComponent',
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  setup(props) {
    const mount = ref<HTMLElement | null>(null)
    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let animationFrameId: number | null = null
    let model: THREE.Group | null = null
    let raycaster: THREE.Raycaster | null = null
    let mouse: THREE.Vector2 | null = null
    let touch: THREE.Vector2 | null = null
    let isDragging = false
    let previousMouseX = 0

    // Render Loop
    const animate = function () {
      animationFrameId = requestAnimationFrame(animate)
      if (model) {
        model.rotation.y += 0.01 // Rotate the model continuously
      }
      renderer!.render(scene!, camera!)
    }

    onMounted(() => {
      // Scene
      scene = new THREE.Scene()

      // Lighting
      const light = new THREE.HemisphereLight(0xffffff, 0x000000, 1)
      scene.add(light)

      // Camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 10 // Adjust camera position to ensure the model is in view

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      mount.value?.appendChild(renderer.domElement)

      // Mouse and Raycaster
      mouse = new THREE.Vector2()
      raycaster = new THREE.Raycaster()

      // Load Model
      const loader = new GLTFLoader()
      loader.load(
        sheep,
        (gltf) => {
          model = gltf.scene
          model.scale.set(1, 1, 1) // Scale the model
          scene!.add(model)
          // Start animation
          animate()
        },
        undefined,
        (error) => console.error(error)
      )
    })

    const onMouseMove = (event: MouseEvent) => {
      // Update the mouse position
      if (isDragging) {
        const currentMouseX = event.clientX
        const deltaX = currentMouseX - previousMouseX

        // Rotate the model based on the mouse movement
        if (model) {
          model.rotation.y += deltaX * 0.01
        }

        previousMouseX = currentMouseX
      }
    }

    const onMouseDown = (event: MouseEvent) => {
      isDragging = true
      previousMouseX = event.clientX
    }

    const onMouseUp = () => {
      isDragging = false
    }

    const onTouchStart = (event: TouchEvent) => {
      const touchEvent = event.touches[0]
      touch = new THREE.Vector2(touchEvent.clientX, touchEvent.clientY)
    }

    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault()
      const touchEvent = event.touches[0]
      const currentTouch = new THREE.Vector2(touchEvent.clientX, touchEvent.clientY)
      const deltaX = currentTouch.x - touch!.x

      // Rotate the model based on the touch movement
      if (model) {
        model.rotation.y += deltaX * 0.01
      }

      touch = currentTouch
    }

    const onTouchEnd = () => {
      touch = null
    }

    //   const onClick = () => {
    //     if (!props.show && model) {
    //       // If the sheep is clicked and the message is not shown, play the sound
    //       audio.play()
    //       // Emit the clickMessage event to hide the message
    //       emit('clickMessage')
    //     }
    //   }

    onBeforeUnmount(() => {
      // Stop animation and remove the canvas on component unmount
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId)
      mount.value?.removeChild(renderer!.domElement)
    })

    return {
      mount,
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  }
}
</script>

<style lang="scss" scoped>
.sheep-component {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: white;
}
</style>
