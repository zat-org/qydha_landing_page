<template>
  <Marketing/>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
})
useHead({
  title:'التسويق',
  meta:[
    {name:'description',content:'التسويق'}
  ]
})

</script>

<style>

</style>