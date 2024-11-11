<template>
  <UModal>
    <UCard>
      <UForm :state="state" :schema="schema" ref="AddTableForm" @submit="onSubmit">
        <UFormGroup name="name" label="name">
          <UInput v-model="state.name" />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center ">
          <UButton label="add" @click="AddTableForm?.submit()" />
          <UButton label="close" color="red" @click="modal.close()" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { ITableCreate } from '~/models/Table';
import { object, string } from 'yup'
import { type Form } from "#ui/types"
const modal = useModal()
const toast = useToast()
const route = useRoute()
const tour_id = route.params.id.toString()

const AddTableForm = ref<Form<ITableCreate>>()

const state = reactive<ITableCreate>({ name: "" })
const schema = object({
  name: string().required()
})
const AddREQ = await useTournamentTable().addTable()
const onSubmit = async () => {
  await AddREQ.fetchREQ(tour_id, state)
  if (AddREQ.status.value == "success") {
    toast.add({ title: 'add table done successfully ' })
    modal.close()
  }
}
</script>


<style></style>