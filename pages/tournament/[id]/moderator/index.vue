<template>
  <TournamentModerator/>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
 useHead({
  title:' مديرين البطوله ',
  meta:[
    {name:'description',content:'مديرين البطوله'}
  ]
 })
</script>

<style>

</style>