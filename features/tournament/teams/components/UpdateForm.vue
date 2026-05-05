<template>
  <UCard :ui="{ root: 'w-full space-y-2 p-1' }">
    <UForm :state="state" :schema="schema" @submit="onSubmit" ref="updateTeamForm">
      <UFormField name="name" label="اسم الفريق"><UInput v-model="state.name" :disabled="pending" /></UFormField>
    </UForm>
    <template #footer>
      <div class="flex justify-between">
        <UButton label="حفظ" color="primary" :loading="pending" :disabled="pending" @click="updateTeamForm?.submit()" />
        <UButton label="إلغاء" color="error" variant="ghost" :disabled="pending" @click="emit('close')" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { string, object } from 'yup';
import type { ITeam } from '~/features/tournament/models/tournamentTeam';
const updateTeamForm = ref()
const props = defineProps<{ team: ITeam }>()
const emit = defineEmits(['close'])
const state = reactive({ name: props.team.name })
const schema = object({ name: string().required("برجاء ادخال اسم الفريق").min(4, "يجب ان يكون الاسم اكبر من 4 احرف") })
const toast = useToast()
const updateREQ = await useTourrnamentTeam().updateTourTeamName()
const pending = computed(() => updateREQ.status.value === "pending")
const onSubmit = async () => { await updateREQ.fetchREQ(props.team.tournamentId.toString(), props.team.id.toString(), state); if (updateREQ.status.value == "success") { toast.add({ title: "تم التحديث بنجاح" }); emit('close') } }
</script>
