<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
      تعديل صلاحيات مدير
      </template>
      <UForm :state="state" :schema="schema" ref="moderatorForm" @submit="onSubmit">
     
        <UFormField name="permissions" label="الصلاحيات">
          <USelectMenu v-model="state.permissions" :options="permission" multiple />
        </UFormField>
      </UForm>

      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="اضافة " @click="moderatorForm?.submit()" />
          <UButton color="red" label="اغلاق" @click="emit('close')" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { IModerator, IModeratorCreate, IModeratorUpdate } from '~/models/tournamentModeratorr';
import { array, object, string } from "yup"

const props=defineProps <{moderator:IModerator}>()

const route = useRoute()
const tour_id = route.params.id.toString()

const emit = defineEmits(['close'])
const permissionGetREQ = await useTournamentModerator().getModeratorpermissions()

const permission = computed(() => {
  if (permissionGetREQ.data.value)
    return permissionGetREQ.data.value.data.permissions
})

const moderatorForm = ref()
const state = reactive<IModeratorUpdate>({

  permissions: props.moderator.permissions
})
const schema = object({

  permissions: array().of(string()).min(1, "برجاء اختيار صلاحية واحدة علي الاقل")
})
const addModeratorREQ = await useTournamentModerator().updateModerator()
const onSubmit = async () => {
  await addModeratorREQ.fetchREQ(tour_id,props.moderator.user.id, state)
  if (addModeratorREQ.status.value == "success") {
    emit('close')
  }
}
</script>

<style></style>