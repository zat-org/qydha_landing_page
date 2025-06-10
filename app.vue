<template>
  <div
    dir="rtl"
    lang="ar"
    class="flex flex-col h-screen bg-[var(--color-background)] dark:bg-[var(--color-background-secondary)] text-[var(--color-text-primary)] dark:text-[var(--color-text-primary)]">
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
