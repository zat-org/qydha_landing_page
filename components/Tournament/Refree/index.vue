<template>
  <UCard :ui="{ base: 'flex flex-col h-full ', body: { base: 'grow ' } }">

    <template #header>
      <p>
        <span   >
          {{ tourREQ.data.value?.data.name }}
        </span>
      \
      الحكام
      </p>
    </template>

    <UTable :data="refrees" >
      <template #action-data="{row}">
        <UButton icon="material-symbols:delete" color="red" @click="deleteref(row)"/>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-between items-center">

        <UButton label="اضافة حكم " @click="openAddModal" icon ="material-symbols:add"/>
        <UButton label="عودة " color="red" @click="navigateTo('/tournament/'+tour_id)" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { MinUser } from '~/models/user';
import AddModal from './AddModal.vue';

const route = useRoute()
const tour_id = route.params.id.toString()
const overlay = useOverlay()
const tourREQ= await useTournament().getTourById()
await tourREQ.fetchREQ(+tour_id)
if (tourREQ.status.value =="error"){
navigateTo('/tournament')
}

const refreeGetREQ = await useTournamentRefree().getTournamentRefree()
await refreeGetREQ.fetchREQ(tour_id)


const refrees = computed(() => {

  if (refreeGetREQ.data.value)
    return refreeGetREQ.data.value.data
})


const cols= [
  {key:"username",label:"الاسم"},
  {key:"phone",label:"الهاتف"},
  {key:"action",label:"#"},


]

const openAddModal = () => {
  overlay.create(AddModal).open()
}
const refreDeleteREQ = await useTournamentRefree().deleteTourRefree()
const deleteref=async (row:MinUser)=>{
  await refreDeleteREQ.fetchREQ(tour_id , row.id)
  // if (refreDeleteREQ.status.value=="success"){
  // }
}
</script>

<style></style>