<template>
  
   <TournamentRefree/>
  
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
 useHead({
  title:' الحكام في البطولة',
  meta:[
    {name:'description',content:'الحكام في البطولة'}
  ]
 })
</script>

<style>

</style>