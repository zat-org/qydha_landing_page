<template>
  <Codes />
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
})
useHead({
  title:'اكواد التسويق',
  meta:[
    {name:'description',content:'اكواد التسويق'}
  ]
})

</script>

<style>

</style>