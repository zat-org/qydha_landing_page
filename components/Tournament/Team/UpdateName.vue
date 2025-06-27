<template>
  <div>
    <UForm :state="state" :schema="schema" @submit="onSubmit" ref="updateTeamNameForm">
      <UFormField name="name" label="name">
          <UInput v-model="state.name" />
      </UFormField>

    </UForm>    
  </div>
</template>

<script lang="ts" setup>

import { string ,object } from 'yup';
import type { ITeam } from '~/models/tournamentTeam';
const updateTeamNameForm =ref()
const props = defineProps<{team:ITeam }>()
const state = reactive({
  name:props.team.name
})
const emit = defineEmits(['close'])
const schema = object({
  name:string()
}) 

const submitNameForm = ()=>{
  updateTeamNameForm.value!.submit()
}
const toast  =useToast()
defineExpose({submitNameForm})
const updateREQ =  await useTourrnamentTeam().updateTourTeamName()
const onSubmit=async()=>{
 
  await  updateREQ.fetchREQ(props.team.tournamentId.toString(),props.team.id.toString(),state)
  if(updateREQ.status.value="success"){
    toast.add({title:"update done"})
  }
}

</script>

<style>

</style>