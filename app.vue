<template>
  <div
    dir="rtl"
    lang="ar"
    class="flex flex-col  min-h-screen h-full  w-full bg-background text-text-primary dark:bg-dark-background dark:text-dark-text-primary">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <UModals />
    <USlideovers />

</div>
</template>
<script setup lang="ts"></script>
<style></style>
