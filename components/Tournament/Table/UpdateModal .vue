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
          <UButton label="update" @click="AddTableForm?.submit()" />
          <UButton label="close" color="red" @click="modal.close()" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { ITable, ITableCreate } from '~/models/Table';
import { object, string } from 'yup'
import { type Form } from "#ui/types"
const props = defineProps<{table:ITable}>()
console.log(props.table.name)
const modal = useModal()
const toast = useToast()
const route = useRoute()
const tour_id = route.params.id.toString()

const AddTableForm = ref<Form<ITableCreate>>()

const state = reactive<ITableCreate>({ name: props.table.name })
const schema = object({
  name: string().required()
})
const UpdateREQ = await useTournamentTable().updateTable()
const onSubmit = async () => {
  await UpdateREQ.fetchREQ(tour_id,props.table.id ,state)
  if (UpdateREQ.status.value == "success") {
    toast.add({ title: 'update table done successfully ' })
    modal.close()
  }
}
</script>


<style></style>