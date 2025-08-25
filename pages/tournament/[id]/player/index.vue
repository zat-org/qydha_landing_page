<template>
<TournamentPlayer/>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
 useHead({
  title:' اللاعبين في البطولة',
  meta:[
    {name:'description',content:'اللاعبين في البطولة'}
  ]
 })
</script>

<style>

</style>