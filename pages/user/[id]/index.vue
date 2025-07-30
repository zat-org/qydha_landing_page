<template>
    <UserSingle  :id="id"/>
  </template>
  
  <script lang="ts" setup>
  const route =useRoute()
  const id  =route.params.id.toString()
  definePageMeta({ middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
   });
  </script>
  
  <style>
  
  </style>