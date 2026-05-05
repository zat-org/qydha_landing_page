<template>  
  <TournamentTeam/>
</template>

<script lang="ts" setup>
import TournamentTeam from '~/features/tournament/teams/components/TournamentTeam.vue';
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin','Organizer'],
 });
 useHead({
  title:' الفرق في البطولة',
  meta:[
    {name:'description',content:'الفرق في البطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
 })
</script>

<style>

</style>