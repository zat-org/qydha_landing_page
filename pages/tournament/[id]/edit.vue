<template>
    <ClientOnly>
        <TournamentEdit v-if="getREQ.data.value" :tournament="getREQ.data.value.data"> </TournamentEdit>
    </ClientOnly>
</template>

<script lang="ts" setup>
const route =useRoute()
const tourId  = route.params.id.toString()
const tourApi = useTournament()
const getREQ =await tourApi.getTourById()
await getREQ.fetchREQ(+tourId)
if(getREQ.status.value=="error") navigateTo('/tournament')
</script>

<style>

</style>