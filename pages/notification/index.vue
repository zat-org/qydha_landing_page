<template>
  <Notification/>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
})
useHead({
  title:'الإشعارات',
  meta:[
    {name:'description',content:'الإشعارات'}
  ]
})

</script>

<style>

</style>