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

        <UFormField
          v-if="hasPlaces"
          name="placeId"
          label="مكان التصفيات"
          required
        >
          <USelect
            v-model="state.placeId"
            :items="placeOptions"
            placeholder="اختر المكان"
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
import type { ITableCreate } from '~/features/tournament/models/Table';
import { object, string } from 'yup'
import { useTournamentPlaces } from '~/features/tournament/composables/useTournamentPlaces'

const props = defineProps<{
  tourId: string
}>()

const emit = defineEmits(['close'])
const toast = useToast()

const AddTableForm = ref<any>()

const tourREQ = await useSingleTournament().getSingelTournament(props.tourId)
const { placeOptions, hasPlaces, places } = useTournamentPlaces(
  () => tourREQ.data.value,
)

const state = reactive<ITableCreate>({
  name: '',
  placeId: places.value[0]?.id ?? '',
})

watch(
  places,
  (list) => {
    if (list.length && !state.placeId) {
      state.placeId = list[0]!.id
    }
  },
  { immediate: true },
)

const schema = computed(() =>
  object({
    name: string().required('اسم الطاولة مطلوب'),
    placeId: hasPlaces.value
      ? string().required('مكان التصفيات مطلوب')
      : string().nullable(),
  }),
)

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

  if (hasPlaces.value && !state.placeId) {
    toast.add({
      title: 'مكان مطلوب',
      description: 'اختر مكان التصفيات للطاولة',
      color: 'warning',
    })
    return
  }
  
  await AddREQ.fetchREQ(props.tourId, {
    name: state.name,
    ...(state.placeId ? { placeId: state.placeId } : {}),
  })
  
  if (AddREQ.status.value === "success") {
    toast.add({ 
      title: 'تمت الإضافة بنجاح',
      description: `تم إضافة الطاولة "${state.name}" بنجاح`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
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
