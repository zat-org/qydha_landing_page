<template>  
  <TournamentTeam/>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
 useHead({
  title:' الفرق في البطولة',
  meta:[
    {name:'description',content:'الفرق في البطولة'}
  ]
 })
</script>

<style>

</style>