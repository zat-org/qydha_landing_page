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
    <div  class="w-full h-full flex flex-col flex-1" data-vaul-drawer-wrapper>
      <NuxtLayout >
        <NuxtPage  />
      </NuxtLayout>
    </div>
    </UApp>
  </div>
</template>

<script setup lang="ts">
</script>

<style>
</style>
