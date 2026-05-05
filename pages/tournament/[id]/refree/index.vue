<template>
  
   <TournamentRefree/>
  
</template>

<script lang="ts" setup>
import TournamentRefree from '~/features/tournament/referees/components/TournamentRefree.vue';
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin','Organizer'],
 });
 useHead({
  title:' الحكام في البطولة',
  meta:[
    {name:'description',content:'الحكام في البطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
 })
</script>

<style>

</style>