<template>
<TournamentRequest/>
    
</template>
<script setup lang="ts">
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin','Organizer'],
 });
 useHead({
  title:'طلبات البطولة',
  meta:[
    {name:'description',content:'طلبات  بطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
 })
</script>