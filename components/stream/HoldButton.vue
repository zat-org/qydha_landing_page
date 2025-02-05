<template>
  <UButton 
  variant="outline"
    :icon="icon"
    @mousedown="startAction"
    @mouseup="stopInterval"
    @mouseleave="stopInterval"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  icon: string
  step: number
  action: (step: number) => void
}>()

const intervalId = ref<number | null>(null)

const startAction = () => {
  props.action(props.step)
  intervalId.value = window.setInterval(() => {
    props.action(props.step)
  }, 100)
}

const stopInterval = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}
</script>