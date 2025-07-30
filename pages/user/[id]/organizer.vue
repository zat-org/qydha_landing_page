<template>
  <UserOrganizer :id="id" />
</template>

<script lang='ts' setup>
const route = useRoute()
const id  =route.params.id.toString()

// Page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth',
  requiredRoles: ['SuperAdmin', 'StaffAdmin', 'User'],
  title: 'ملف المنظم'
})

</script> 