<template>
  <UModal>
    <UCard>
      <UForm :state="state" :schema="schema" ref="AddTableForm" @submit="onSubmit">
        <UFormField name="name" label="name">
          <UInput v-model="state.name" />
        </UFormField>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center ">
          <UButton label="add" @click="AddTableForm?.submit()" />
          <UButton label="close" color="red" @click="emit('close')" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { ITableCreate } from '~/models/Table';
import { object, string } from 'yup'
const emit = defineEmits(['close'])
const toast = useToast()
const route = useRoute()
const tour_id = route.params.id.toString()

const AddTableForm = ref<any>()

const state = reactive<ITableCreate>({ name: "" })
const schema = object({
  name: string().required()
})
const AddREQ = await useTournamentTable().addTable()
const onSubmit = async () => {
  await AddREQ.fetchREQ(tour_id, state)
  if (AddREQ.status.value == "success") {
    toast.add({ title: 'add table done successfully ' })
    emit('close')
  }
}
</script>


<style></style>