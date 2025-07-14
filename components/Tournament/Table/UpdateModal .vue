<template>
  <UModal title="تعديل طاولة" prevent-close description="تعديل طاولة">
    <template #body>
      <UForm :state="state" :schema="schema" ref="UpdateTableForm" @submit="onSubmit" class="space-y-2">
        <UFormField name="status" label="الحالة">
          <USelect :items="statusOption" v-model="state.name" />
        </UFormField>
        <UFormField name="refree" label="الحكم ">
        <UInput></UInput>  
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex gap-2  justify-between items-center ">
        <UButton label="حفظ" @click="UpdateTableForm?.submit()" />
        <UButton label="اغلاق" color="error" @click="emit('close')" />
      </div>
    </template>

  </UModal>
</template>

<script lang="ts" setup>
import type { ITable, ITableCreate } from '~/models/Table';
import { object, string } from 'yup'
const props = defineProps<{ table: ITable }>()
const emit = defineEmits(['close'])
const toast = useToast()
const route = useRoute()
const tour_id = route.params.id.toString()

const UpdateTableForm = ref<any>()

const statusOption = [
  " لاتوجد مبارة ",
  "المبارة مستمرة ",
  "انسحاب الفريق الاول",
  "انسحاب الفريق الثاني",
  "انتهى المباراة",
  "فوز الفريق الاول",
  "فوز الفريق الثاني",
]
const state = reactive<ITableCreate>({ name: props.table.name })
const schema = object({
  name: string().required()
})
const UpdateREQ = await useTournamentTable().updateTable()
const onSubmit = async () => {
  await UpdateREQ.fetchREQ(tour_id, props.table.id, state)
  if (UpdateREQ.status.value == "success") {
    toast.add({ title: 'update table done successfully ' })
    emit('close')
  }
}
</script>


<style></style>