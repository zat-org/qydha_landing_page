<template>
    <UserSingle  :id="id"/>
  </template>
  
  <script lang="ts" setup>
  const route =useRoute()
  const id  =route.params.id.toString()
  definePageMeta({ middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
   });
   useHead({
    title:'ملف المستخدم',
    meta:[
      {name:'description',content:'ملف المستخدم'}
    ]
   })
  </script>
  
  <style>
  
  </style>