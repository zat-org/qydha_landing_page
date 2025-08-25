<template>
  <TournamentRequest :tournamentId="id"/>
</template>

<script lang="ts" setup>
const route = useRoute();
const id = route.params.id.toString();

definePageMeta({ 
  middleware: ['auth','role'],
  requiredRoles: ['StaffAdmin', 'SuperAdmin'],
});
useHead({
  title:' طلبات البطولة',
  meta:[
    {name:'description',content:'طلبات البطولة'}
  ]
})
</script>

<style>

</style> 