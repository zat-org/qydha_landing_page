<template>
    <ClientOnly>
        <TournamentEdit > </TournamentEdit>
    </ClientOnly>
</template>

<script lang="ts" setup>
import TournamentEdit from '~/features/tournament/core/components/TournamentEdit.vue';
useHead({
  title:'تعديل البطولة',
  meta:[
    {name:'description',content:'تعديل البطولة'}
  ]
})
</script>

<style>

</style>