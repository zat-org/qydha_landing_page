<template>
  <ClientOnly >
    <AppStatistics />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: 'auth'
})

</script>

<style>

</style>