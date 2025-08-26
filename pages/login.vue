<template>
  <Login />

</template>

<script lang="ts" setup>
useHead({
  title:'تسجيل الدخول',
  meta:[
    {name:'description',content:'تسجيل الدخول'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})
definePageMeta({middleware:'auth'})
</script>

<style></style>