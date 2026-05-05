<template>
  <TournamentTable />
</template>

<script lang="ts" setup>
import TournamentTable from '~/features/tournament/tables/components/TournamentTable.vue';
definePageMeta({ middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin','Organizer'],
 });
 useHead({
  title:' طاولات البطولة',
  meta:[
    {name:'description',content:'طاولات البطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
  ]
 })
</script>

<style></style>