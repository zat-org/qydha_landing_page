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
          <UFormField label="permissions">
            <USelectMenu v-model="state.permissions" :items="permissions" multiple class="w-full" />
          </UFormField>
        </UForm>
      </template>
      <template #footer>
        <div class="flex justify-between items-center gap-4">
          <UButton label="close" color="error" @click="emit('close')" />
          <UButton label='update' color="success" @click="AddForm?.submit()" />

        </div>
      </template>
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
    toast.add({ title: 'update done succefuly' })
    emit('close')
  }
}
</script>

<style></style>