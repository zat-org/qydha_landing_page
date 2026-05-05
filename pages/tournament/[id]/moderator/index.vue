<template>
  <TournamentModerator/>
</template>

<script lang="ts" setup>
import TournamentModerator from '~/features/tournament/moderators/components/TournamentModerator.vue';
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin','Organizer'],
 });
 useHead({
  title:' مديرين البطوله ',
  meta:[
    {name:'description',content:'مديرين البطوله'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
 })
</script>

<style>

</style>