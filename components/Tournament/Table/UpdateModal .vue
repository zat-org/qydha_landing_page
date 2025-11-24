<template>
  <UModal title="تعديل طاولة" prevent-close :description="`تعديل معلومات الطاولة: ${props.table.name}`">
    <template #body>
      <UForm 
        :state="state" 
        :schema="schema" 
        ref="UpdateTableForm" 
        @submit="onSubmit" 
        class="space-y-4"
      >
        <UFormField name="name" label="اسم الطاولة">
          <UInput 
            v-model="state.name" 
            placeholder="أدخل اسم الطاولة"
            trailing-icon="i-heroicons-table-cells"
            :disabled="UpdateREQ.status.value === 'pending'"
          />
        </UFormField>

        <UAlert
          v-if="UpdateREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="UpdateREQ.error.value?.message || 'حدث خطأ أثناء تحديث الطاولة'"
        />
      </UForm>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-between items-center">
        <UButton 
          label="حفظ التغييرات" 
          color="primary"
          icon="i-heroicons-check-circle"
          :loading="UpdateREQ.status.value === 'pending'"
          @click="UpdateTableForm?.submit()" 
        />
        <UButton 
          label="إلغاء" 
          color="error" 
          variant="soft"
          :disabled="UpdateREQ.status.value === 'pending'"
          @click="emit('close')" 
        />
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

const state = reactive<ITableCreate>({ name: props.table.name })
const schema = object({
  name: string().required('اسم الطاولة مطلوب')
})

const UpdateREQ = useTournamentTable().updateTable()

const onSubmit = async () => {
  await UpdateREQ.fetchREQ(tour_id, props.table.id, state)
  
  if (UpdateREQ.status.value === "success") {
    toast.add({ 
      title: 'تم التحديث بنجاح',
      description: `تم تحديث الطاولة "${state.name}" بنجاح`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    emit('close')
  } else if (UpdateREQ.status.value === "error") {
    toast.add({
      title: 'خطأ في التحديث',
      description: UpdateREQ.error.value?.message || 'حدث خطأ أثناء تحديث الطاولة',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }
}
</script>

<style></style>