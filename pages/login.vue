<template>
  <Login />

</template>

<script lang="ts" setup>
useHead({
  title:'تسجيل الدخول',
  meta:[
    {name:'description',content:'تسجيل الدخول'}
  ]
})
definePageMeta({middleware:'auth'})
</script>

<style></style>