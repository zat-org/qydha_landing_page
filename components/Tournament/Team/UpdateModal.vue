<template>
 <UModal prevent-close>
  <UCard> 
    <template #header>
      update team name 
    </template>
    <UTabs :items="items"> 
      <template #name="{item}">
        <UpdateName :team="team" ref="updateNameComponent"></UpdateName>
      </template>
    </UTabs>
    <template #footer>
      <div class="flex justify-between items-center ">
        <UButton label="save"  @click="submitForm" />
        <UButton label="close" color="error" @click="emit('close')" />

      </div>
      </template>
  </UCard>
 </UModal>
</template>

<script lang="ts" setup>
import { string ,object } from 'yup';
import UpdateName from './UpdateName.vue'
import type { ITeam } from '~/models/tournamentTeam';
const emit = defineEmits(['close'])
const updateNameComponent =ref()
const tabIndex=ref(0)
const indexChange= (index:number)=>{
  tabIndex.value = index 
}
const props = defineProps<{team:ITeam}>()
const items=[
  {key:'name',label:'name',slot:"name"}
]
const submitForm =()=>{
  if(tabIndex.value== 0 ){
    updateNameComponent.value.submitNameForm()
  }

}
</script>

<style>

</style>