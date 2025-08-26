<template>
    <TournamentGroup :tournamentId="id"/>
    </template>
    
    <script lang="ts" setup>
    const route = useRoute();
    const id = route.params.id.toString();
    definePageMeta({ middleware: ['auth','role'],
      requiredRoles: ['StaffAdmin', 'SuperAdmin'],
     });
     useHead({
      title:' مجموعات البطولة',
      meta:[
        {name:'description',content:'مجموعات البطولة'},
    { property: 'og:title', content: 'قيدها |Qydha' },
    { property: 'og:image', content: '/images/preview.PNG'}
      ]
     })
    </script>
    
    <style>
    
    </style>