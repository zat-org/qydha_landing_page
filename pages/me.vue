<template>
    <UserSingle :id="id!"></UserSingle>
      <!-- <UserDelete></UserDelete> -->
    
  </template>
  
  <script lang="ts" setup>
  definePageMeta({middleware:['auth']})
  import { useMyAuthStore } from '~/store/Auth'
  const authuser = useMyAuthStore()
  const id = ref(authuser.user?.user.id)
  </script>
  
  <style>
  
  </style>