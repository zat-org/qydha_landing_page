<template>
 <UModal prevent-close>
  <UCard> 
    <template #header>
      update team name 
    </template>
    <UTabs :items="items"> 
      <template #name="{item}">
        <UpdateName :name="team.name" ref="updateNameComponent"></UpdateName>
      </template>
    </UTabs>
    <template #footer>
      <div class="flex justify-between items-center ">
        <UButton label="save"   />
        <UButton label="close" @click="modal.close()" />

      </div>
      </template>
  </UCard>
 </UModal>
</template>

<script lang="ts" setup>
import { string ,object } from 'yup';
import UpdateName from './UpdateName.vue'
import type { ITeam } from '~/models/tournamentTeam';
const modal =useModal()
const tabIndex=ref(0)
const indexChange= (index:number)=>{
  tabIndex.value = index 
}
const props = defineProps<{team:ITeam}>()
const items=[
  {key:'name',label:'name',slot:"name"}
]
</script>

<style>

</style>