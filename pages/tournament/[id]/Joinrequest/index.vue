<template>
  <TournamentJoiningRequest :tournamentId="id"/>
</template>

<script lang="ts" setup>
const route = useRoute();
const id = route.params.id.toString();

definePageMeta({ 
  middleware: ['auth','role'],
  requiredRoles: ['Organizer','StaffAdmin', 'SuperAdmin'],
});

useHead({
  title:' طلبات البطولة',
  meta:[
    {name:'description',content:'طلبات البطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
})
</script>

<style>

</style> 