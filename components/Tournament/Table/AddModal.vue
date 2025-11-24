<template>
  <UModal title="إضافة طاولة جديدة" prevent-close description="أدخل معلومات الطاولة الجديدة">
    <template #body>
      <UForm 
        :state="state" 
        :schema="schema" 
        ref="AddTableForm" 
        @submit="onSubmit" 
        class="space-y-4"
      >
        <UFormField name="name" label="اسم الطاولة">
          <UInput 
            v-model="state.name" 
            placeholder="أدخل اسم الطاولة"
            trailing-icon="i-heroicons-table-cells"
            :disabled="AddREQ.status.value === 'pending'"
          />
        </UFormField>

        <UAlert
          v-if="AddREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="AddREQ.error.value?.message || 'حدث خطأ أثناء إضافة الطاولة'"
        />
      </UForm>
    </template>

    <template #footer>
      <div class="flex gap-2 justify-between items-center">
        <UButton 
          label="إضافة" 
          color="primary"
          icon="i-heroicons-plus-circle"
          :loading="AddREQ.status.value === 'pending'"
          @click="AddTableForm?.submit()" 
        />
        <UButton 
          label="إلغاء" 
          color="error" 
          variant="soft"
          :disabled="AddREQ.status.value === 'pending'"
          @click="emit('close')" 
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { ITableCreate } from '~/models/Table';
import { object, string } from 'yup'

const props = defineProps<{
  tourId: string
}>()

const emit = defineEmits(['close'])
const toast = useToast()

const AddTableForm = ref<any>()

const state = reactive<ITableCreate>({ name: "" })
const schema = object({
  name: string().required('اسم الطاولة مطلوب')
})

const AddREQ = useTournamentTable().addTable()

const onSubmit = async () => {
  if (!props.tourId) {
    toast.add({
      title: 'خطأ',
      description: 'معرف البطولة غير متوفر',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
    return
  }
  
  await AddREQ.fetchREQ(props.tourId, state)
  
  if (AddREQ.status.value === "success") {
    toast.add({ 
      title: 'تمت الإضافة بنجاح',
      description: `تم إضافة الطاولة "${state.name}" بنجاح`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
    // Reset form
    state.name = ""
    emit('close')
  } else if (AddREQ.status.value === "error") {
    toast.add({
      title: 'خطأ في الإضافة',
      description: AddREQ.error.value?.message || 'حدث خطأ أثناء إضافة الطاولة',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }
}
</script>

<style></style>