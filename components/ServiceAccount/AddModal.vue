<template>
  <UModal prevent-close>
    <UCard :ui="{ base: 'flex flex-col ', body: { base: 'grow ' } }">
      <template #header>
        <h1>Add new Account </h1>
      </template>
      <UForm :state="state" :schema="schema" ref="AddForm" @submit="onSubmit">
        <UFormGroup label="name" name="name">
          <UInput v-model="state.name"></UInput>
        </UFormGroup> 
        <UFormGroup label="description" name="description">
          <UInput v-model="state.description"></UInput>
        </UFormGroup>
        <UFormGroup label="permissions">
          <USelectMenu v-model="state.permissions" :options="permissions" multiple />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="close" color="red" @click="modal.close()" />
          <UButton label='add' color="green" @click="AddForm?.submit()" />

        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup'
import type { IServiceAccountCreate } from '~/models/serviceAccount';
const modal = useModal()
const toast = useToast()

const AddForm = ref<HTMLFormElement>()
const state = reactive<IServiceAccountCreate>({
  name: '', description: '', permissions: []
})
const schema = object({
  name: string().required(),
  description: string(),
  permissions: array().of(string()).min(1,"select permission")
})
const permissionREQ = await useServiceAccount().getPermissions()
const permissions = computed(() => {
  return permissionREQ.data.value?.data.permissions
})
const addREQ = await useServiceAccount().addServiceAccount()
const onSubmit =async()=>{
  await addREQ.fetchREQ(state)
  if ( addREQ.status.value=='success'){
    refreshNuxtData('getServiceAccounts')
    toast.add({title:'add ing done succefuly'})
    modal.close()
  }
}
</script>

<style></style>