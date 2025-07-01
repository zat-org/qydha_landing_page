<template>
  <ClientOnly>
    <TournamentAdd />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
</script>

<style></style>
