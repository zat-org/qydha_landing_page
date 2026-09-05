<template>
    <ClientOnly>
      <div class="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden">
        <TournamentRequestForm class="flex h-full min-h-0 flex-1 flex-col overflow-hidden" :mode />
      </div>
    </ClientOnly>
  </template>
  <script lang="ts" setup>
import TournamentRequestForm from '~/features/tournament/request/components/TournamentRequestForm.vue';
import { TournamentRequsetFormType } from '~/features/tournament/models/tournamentRequest';


  const mode = TournamentRequsetFormType.Add
  definePageMeta({ middleware: ['auth','role'],
    requiredRoles: ["Organizer"],
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
  