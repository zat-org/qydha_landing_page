<template>
    <ClientOnly>
        <TournamentEdit > </TournamentEdit>
    </ClientOnly>
</template>

<script lang="ts" setup>
import TournamentEdit from '~/features/tournament/edit/components/TournamentEdit.vue';

definePageMeta({
  middleware: ["auth"],
});

useHead({
  title:'تعديل البطولة',
  meta:[
    {name:'description',content:'تعديل البطولة'}
  ]
})
</script>

<style>

</style>