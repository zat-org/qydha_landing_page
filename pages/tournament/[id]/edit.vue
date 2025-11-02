<template>
    <ClientOnly>
        <TournamentEdit > </TournamentEdit>
    </ClientOnly>
</template>

<script lang="ts" setup>
const route =useRoute()
const tourId  = route.params.id.toString()
// const tourApi = useTournament()
// const getREQ =await tourApi.getSingelTournament(tourId)

// if(getREQ.status.value=="error") navigateTo('/tournament')
useHead({
  title:'تعديل البطولة',
  meta:[
    {name:'description',content:'تعديل البطولة'}
  ]
})
</script>

<style>

</style>