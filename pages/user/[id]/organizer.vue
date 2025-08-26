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
})
useHead({
  title:'ملف المنظم',
  meta:[
    {name:'description',content:'ملف المنظم'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})

</script> 