<template>
  <UCard :ui="{base:'flex flex-col h-full ' ,body:{base:'grow'}}">
    <template #header>
      <p>
        {{getTourREQ.data.value?.data.name}}
        /
        الفرق
      </p>
    </template>
    
    <UTable :rows="teams" :columns="columns" :ui="{td:{padding:'p-2'}}">
      <template #players-data ="{row}">
        <div class="flex flex-col gap-1 justify-start items-start ">
          <UBadge :label="row.players.map(p =>{return  p.name}).join(' | ') +' - '+ row.id" size="lg" color="gray" />
        </div>
      </template>
      <template #actions-data ="{row}">
        <UButtonGroup >
          <UButton icon="material-symbols:delete" color="red"  @click="deleteTeam(row)"/> 
          <UButton icon="material-symbols:settings" color="yellow"  @click="openUpdateModal(row)"/> 
      
        </UButtonGroup>
      </template>
    </UTable>

    <template #footer>
      <div class="flex justify-between items-center ">
        <UButton  label="اضافة" @click="openAddModal"/>
        <UButton label="عودة " color="red" @click="navigateTo('/tournament/'+tour_id)"/>
      </div> 
    </template>

  </UCard>
</template>

<script lang="ts" setup>
import type { ITeam } from '~/models/tournamentTeam';
import AddModal from './AddModal.vue';
import UpdateModal from './UpdateModal.vue';

const route =useRoute()
const modal =useModal()
const tour_id = route.params.id.toString()

const openAddModal =()=>{
  modal.open(AddModal)
}

const getTourREQ = await useTournament().getTourById()
await getTourREQ.fetchREQ(+tour_id)
if (getTourREQ.status.value == "error"){
  navigateTo('/tournament')
}

const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams()
await getTeamsREQ.fetchREQ(tour_id)


const teams =computed(()=>{
  if (getTeamsREQ.data.value)
 return  getTeamsREQ.data.value.data
})
const columns = [
  {label:'الاسم',key:'name'},
  {label:'الاعبين',key:'players'},
  {label:'#',key:'actions'},

]

const delteTeamREQ =await  useTourrnamentTeam().deleteTourTeam()
const deleteTeam =async(row:ITeam)=>{
  await delteTeamREQ.fetchREQ(tour_id,row.id.toString()) 
}

const openUpdateModal =(row:ITeam)=>{
modal.open(UpdateModal,{team:row})
}

</script>

<style>

</style>