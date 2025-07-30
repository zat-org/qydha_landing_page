<template>
  <UModal prevent-close>
    <template #header>
      <h1>Add new Account </h1>
    </template>
    <template #body>
      <UForm :state="state" :schema="schema" ref="AddForm" @submit="onSubmit">
        <UFormField label="name" name="name">
          <UInput v-model="state.name"></UInput>
        </UFormField>
        <UFormField label="description" name="description">
          <UInput v-model="state.description"></UInput>
        </UFormField>
        <UFormField label="permissions " class="w-full">
          <USelectMenu v-model="state.permissions" :items="permissions" multiple class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between items-center">
        <UButton label="close" color="error" @click="emit('close')" />
        <UButton label='add' color="success" @click="AddForm?.submit()" />

      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup'
import type { IServiceAccountCreate } from '~/models/serviceAccount';
const emit = defineEmits(['close'])
const toast = useToast()

const AddForm = ref<HTMLFormElement>()
const state = reactive<IServiceAccountCreate>({
  name: '', description: '', permissions: []
})
const schema = object({
  name: string().required(),
  description: string(),
  permissions: array().of(string()).min(1, "select permission")
})
const permissionREQ = await useServiceAccount().getPermissions()
const permissions = computed(() => {
  return permissionREQ.data.value?.data.permissions
})
const addREQ = await useServiceAccount().addServiceAccount()
const onSubmit = async () => {
  await addREQ.fetchREQ(state)
  if (addREQ.status.value == 'success') {
    refreshNuxtData('getServiceAccounts')
    toast.add({ title: 'add ing done succefuly' })
    emit('close')
  }
}
</script>

<style></style>