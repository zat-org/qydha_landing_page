<template>
  <ClientOnly v-if="!colorMode?.forced">
    <UButton
      :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
      color="gray"
      variant="ghost"
      size="lg"
      :class="[
        'transition-all duration-300 ease-in-out',
        'hover:scale-110 ',
        'focus:scale-110 ',
        'active:scale-95'
      ]"
      :ui="{
        base: 'relative overflow-hidden'
      }"
      @click="isDark = !isDark"
      :aria-label="isDark ? 'تبديل إلى الوضع المضيء' : 'تبديل إلى الوضع المظلم'"
    />

    <template #fallback>
      <div class="w-8 h-8" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

// Optional: Add keyboard shortcut for color mode toggle
onMounted(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    // Toggle with Ctrl/Cmd + Shift + L
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
      e.preventDefault()
      colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
  }
  
  document.addEventListener('keydown', handleKeyboard)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyboard)
  })
})
</script>

<style scoped>
/* Additional styling for smooth transitions */
.color-mode-toggle {
  position: relative;
}

.color-mode-toggle::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(var(--color-primary), 0.2) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
  z-index: -1;
}

.color-mode-toggle:hover::before {
  width: 40px;
  height: 40px;
}
</style> 