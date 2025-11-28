<template>

  <UModal class="h-[80vh]" title="تعديل المباراة" description="تعديل المباراة">

    <template #body>
      <UForm :state="state" :scheam="schema" @submit="onSubmit" class="flex flex-col gap-5 " ref="form">
        <UFormField label="الحكم" name="refereeId" :ui="{ error: 'm-0' }" class="w-full">
          <UInputMenu v-model="state.refereeId" :items="Refres" label-key="username" value-key="id"
            :search-attributes="['username']" class="w-full" />
        </UFormField>
        <UFormField label="الطاولة" name="tableId" class="w-full">
          <UInputMenu v-model="state.tableId" :items="Tables" label-key="name" value-key="id"
            :search-attributes="['name']" :popper="{ placement: 'left-end' }" class="w-full" />
        </UFormField>
        <UFormField name="startAt" label="تبداء" class="grow">
          <AsyncDatePicker v-model="state.startAt" :enable-time-picker="false" dir="ltr" position="right" />
        </UFormField>

        <UFormField name="roundName" label="اسم الجولة">
          <UInput v-model="state.roundName" />
        </UFormField>

      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between items-center w-full" v-if="match.themTeamId && match.usTeamId">
        <UButton label="حفظ" @click="form?.submit()" :loading="updateREQ.status.value == 'pending'" />

        <UDropdownMenu :items="withdrawItems" :popper="{ placement: 'bottom-end' }"
          v-if="match.state.toLowerCase() == 'created'" :ui="{ content: 'w-[300px]' }">
          <UButton color="error" label="انسحاب" trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdownMenu>
        <UButton v-else-if="privilege == Privilege.Admin || privilege == Privilege.Owner" color="error"
          label="اعادة الضبط" @click="onReset" />
      </div>

    </template>

  </UModal>

</template>
<script lang="ts" setup>
// refre and table 

const form = useTemplateRef('form')
import { object, string } from "yup"
import type { Match } from "~/models/group";
import type { IMatchUpdate } from "~/models/match";
import { Privilege } from "~/models/user";
import { useMyAuthStore } from "~/store/Auth";
const props = defineProps<{ match: Match }>()
console.log(props.match)
const userStore = useMyAuthStore()
const { permissions, privilege } = storeToRefs(userStore)
const { getTables } = useTable()
const { getRefres } = useRefre()
const { updateMatch, updateMatchState } = useMatch()
const route = useRoute()
const emit = defineEmits(['close'])
const toast = useToast()
const tour_id = route.params.id.toString()
const tableREQ = await getTables()
const refresREQ = await getRefres()
await Promise.all([tableREQ.fetchREQ(tour_id), refresREQ.fetchREQ(tour_id)])
// tableREQ.fetchREQ(tour_id)
// refresREQ.fetchREQ(tour_id)
const Tables = computed(() => {
  if (tableREQ.status.value == "success" && tableREQ.data.value) {
    return tableREQ.data.value.data
  } else {
    return []
  }
})

const Refres = computed(() => {
  if (refresREQ.status.value == "success" && refresREQ.data.value) {
    return refresREQ.data.value.data
  } else {
    return []
  }
})


const schema = object({
  refereeId: string().nullable(),
  tableId: string().nullable(),
  startAt: string().nullable(),
  roundName: string(),
})
const state = reactive<IMatchUpdate>({
  refereeId: props.match.referee ? props.match.referee.id : undefined,
  tableId: props.match.tableId ?? undefined,
  startAt: new Date(props.match.startAt),
  roundName: props.match.roundName,
  isMarked: props.match.isMarked
})


const updateREQ = await updateMatch()
const onSubmit = async () => {
  state.startAt = new Date(state.startAt).toISOString()
  console.log(state.startAt)
  console.log(tour_id, props.match.id, state)
  await updateREQ.fetchREQ(tour_id, props.match.id, state)
  if (updateREQ.status.value == "success") {
    toast.add({ title: "update done" })
    emit('close')
  }
}

// withdraw dropdown 
const MatchStateREQ = await updateMatchState()
const withdrawUS = async () => {
  console.log(props.match.qydhaGameId)
  await MatchStateREQ.fetchWithdrawREQ(props.match.qydhaGameId, "Us")
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const withdrawThem = async () => {
  await MatchStateREQ.fetchWithdrawREQ(props.match.qydhaGameId, "Them")
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const withdrawBoth = async () => {
  await MatchStateREQ.fetchWithdrawREQ(props.match.qydhaGameId, "All")
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const onReset = async () => {
  await MatchStateREQ.fetchRestREQ(props.match.qydhaGameId)
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const withdrawItems = [[{ label: ` انسحاب  ${props.match.usTeamName}`, onSelect: () => withdrawUS() }, { label: ` انسحاب  ${props.match.themTeamName}`, onSelect: () => withdrawThem() }, { label: 'انسحاب كلا الفريقين', onSelect: () => withdrawBoth() }]]


</script>

<style></style>