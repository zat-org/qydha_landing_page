<template>
  <ClientOnly >
    <Statistics />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin'],
})
useHead({
  title:'الإحصائيات',
  meta:[
    {name:'description',content:'الإحصائيات'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})

</script>

<style>

</style>