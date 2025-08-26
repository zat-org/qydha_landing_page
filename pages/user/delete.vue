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
    {name:'description',content:'حذف المستخدم'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})
</script>

<style></style>