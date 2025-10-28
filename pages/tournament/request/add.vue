<template>
    <ClientOnly>
      <TournamentRequestForm  :mode/>
    </ClientOnly>
  </template>
  <script lang="ts" setup>
import { TournamentRequsetFormType } from '~/models/tournamentRequest';


  const mode = TournamentRequsetFormType.Add
  definePageMeta({ middleware: ['auth','role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin',"Organizer"],
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
  