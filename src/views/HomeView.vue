<template>
  <div class="sheep-container" ref="container" @click="onClickSheepContainer">
    <SheepComponent :show="show" @clickMessage="onClickMessage" />
    <div v-if="show" class="message" @click="onClickMessage">Eid Moubarak !!!</div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import SheepComponent from '@/components/Sheep/Sheep.vue'
import Sheep from '@/assets/Sheep.mp3'

export default {
  name: 'HomeView',
  components: {
    SheepComponent
  },
  setup() {
    const container = ref<HTMLElement | null>(null)
    let audio: HTMLAudioElement | null = null
    const show = ref(false)

    const onClickSheepContainer = () => {
      // Create a new audio instance each time to trigger the sound
      audio = new Audio(Sheep)
      audio.play()
      // Toggle the message visibility
      show.value = !show.value
    }

    const onClickMessage = () => {
      // Hide the message
      show.value = false
    }

    return { container, onClickSheepContainer, onClickMessage, show }
  }
}
</script>

<style scoped>
.sheep-container {
  width: 100%;
  height: 100%;
  perspective: 800px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message {
  position: fixed;
  top: 70px;
  right: 20px;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 10px;
  border-radius: 5px;
  font-size: 2em;
  font-family: 'Comic Sans MS', cursive, sans-serif;
}
</style>
