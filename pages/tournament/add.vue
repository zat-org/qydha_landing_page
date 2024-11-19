<template>
  <ClientOnly>
    <TournamentAdd />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: "auth" });
</script>

<style></style>
