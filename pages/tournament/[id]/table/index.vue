<template>
  <TournamentTable />
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
 useHead({
  title:' طاولات البطولة',
  meta:[
    {name:'description',content:'طاولات البطولة'}
  ]
 })
</script>

<style></style>