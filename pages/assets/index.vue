<template>
<Assets />
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
})
useHead({
  title:'الملفات الثابته',
  meta:[
    {name:'description',content:'الملفات الثابته'}
  ]
})

</script>

<style>

</style>