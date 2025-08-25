<template>
    <UserDelete></UserDelete>

</template>

<script lang="ts" setup>
definePageMeta({ 
  middleware: ['auth', 'role'],
  requiredRoles: ['SuperAdmin', 'StaffAdmin']
})
useHead({
  title:'حذف المستخدم',
  meta:[
    {name:'description',content:'حذف المستخدم'}
  ]
})
</script>

<style></style>