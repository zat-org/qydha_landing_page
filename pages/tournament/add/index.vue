<template>
  <ClientOnly>
    <TournamentAdd />
  </ClientOnly>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
 });
 useHead({
  title:'إضافة بطولة',
  meta:[
    {name:'description',content:'إضافة بطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
 })
</script>

<style></style>
