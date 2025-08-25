<template>
  <ClientOnly >
    <Statistics />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
})
useHead({
  title:'الإحصائيات',
  meta:[
    {name:'description',content:'الإحصائيات'}
  ]
})

</script>

<style>

</style>