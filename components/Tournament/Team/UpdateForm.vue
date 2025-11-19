<template>
  <UCard :ui="{ root: 'w-full space-y-2 p-1' }">
    <UForm :state="state" :schema="schema" @submit="onSubmit" ref="updateTeamForm">
      <UFormField name="name" label="اسم الفريق">
        <UInput 
          v-model="state.name" 
          placeholder="أدخل اسم الفريق"
          :disabled="pending"
          trailing-icon="i-heroicons-pencil"
          size="md"
        />
      </UFormField>
    </UForm>
    
    <template #footer>
      <div class="flex justify-between">
        <UButton 
          label="حفظ" 
          icon="i-heroicons-check" 
          color="primary" 
          :size="'md'" 
          :loading="pending"
          :disabled="pending" 
          @click="updateTeamForm?.submit()"
          class="w-full sm:w-auto order-2 sm:order-1 text-xs sm:text-sm md:text-base py-2 sm:py-2.5" 
        />
        <UButton 
          label="إلغاء" 
          icon="i-heroicons-x-mark" 
          color="error" 
          variant="ghost" 
          :size="'md'"
          :disabled="pending" 
          @click="emit('close')"
          class="w-full sm:w-auto order-1 sm:order-2 text-xs sm:text-sm md:text-base py-2 sm:py-2.5" 
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { string, object } from 'yup';
import type { ITeam } from '~/models/tournamentTeam';

const updateTeamForm = ref()
const props = defineProps<{ team: ITeam }>()
const emit = defineEmits(['close'])

const state = reactive({
  name: props.team.name
})

const schema = object({
  name: string().required("برجاء ادخال اسم الفريق").min(4, "يجب ان يكون الاسم اكبر من 4 احرف")
})

const toast = useToast()
const updateREQ = await useTourrnamentTeam().updateTourTeamName()
const pending = computed(() => updateREQ.status.value === "pending")

const onSubmit = async () => {
  await updateREQ.fetchREQ(props.team.tournamentId.toString(), props.team.id.toString(), state)
  if (updateREQ.status.value == "success") {
    toast.add({ title: "تم التحديث بنجاح" })
    emit('close')
  }
}
</script>

<style scoped></style>

