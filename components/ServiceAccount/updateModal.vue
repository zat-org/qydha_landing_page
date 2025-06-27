<template>
  <UModal prevent-close>
    <UCard :ui="{ base: 'flex flex-col ', body: { base: 'grow ' } }">
      <template #header>
        <h1>Add new Account </h1>
      </template>
      <UForm :state="state" :schema="schema" ref="AddForm" @submit="onSubmit">
        <UFormField label="name" name="name">
          <UInput v-model="state.name"></UInput>
        </UFormField>
        <UFormField label="description" name="description">
          <UInput v-model="state.description"></UInput>
        </UFormField>
        <UFormField label="permissions">
          <USelectMenu v-model="state.permissions" :options="permissions" multiple />
        </UFormField>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="close" color="red" @click="emit('close')" />
          <UButton label='update' color="green" @click="AddForm?.submit()" />

        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup'
import type { IServiceAccount, IServiceAccountCreate } from '~/models/serviceAccount';
const emit = defineEmits(['close'])
const toast = useToast()
const props = defineProps<{ serviceAccount: IServiceAccount }>()

const AddForm = ref<HTMLFormElement>()
const state = reactive<IServiceAccountCreate>({
  name: props.serviceAccount.name,
  description: props.serviceAccount.description,
  permissions: props.serviceAccount.permissions
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
const updateREQ = await useServiceAccount().updateServiceAccount()
const onSubmit = async () => {
  await updateREQ.fetchREQ(props.serviceAccount.id, state)
  if (updateREQ.status.value == 'success') {
    refreshNuxtData('getServiceAccounts')
    toast.add({ title: 'add ing done succefuly' })
    emit('close')
  }
}
</script>

<style></style>