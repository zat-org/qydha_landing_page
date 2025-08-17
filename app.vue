<template>
  <div
    dir="rtl"
    lang="ar"
    :class="[
      'flex flex-col min-h-screen h-full w-full',
      'transition-colors duration-300 ease-in-out',
      'bg-gray-50 dark:bg-gray-900',
      'text-gray-900 dark:text-gray-100'
    ]"
  >
  <UApp >   
    <NuxtLayout >
        <NuxtPage  />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
</style>
