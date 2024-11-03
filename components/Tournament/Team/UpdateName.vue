<template>
  <div>
    <UForm :state="state" :schema="schema" @submit="onSubmit" ref="updateTeamForm">
      <UFormGroup name="name" label="name">
          <UInput v-model="state.name" />
      </UFormGroup>

    </UForm>    
  </div>
</template>

<script lang="ts" setup>

import { string ,object } from 'yup';
import {type Form} from '#ui/types'
const updateTeamForm =ref<Form<{name:string}>>()
const props = defineProps<{name:string }>()
const state = reactive({
  name:props.name
})
const modal=useModal()
const schema = object({
  name:string()
}) 
const onSubmit=()=>{
  console.log(state)
}


</script>

<style>

</style>