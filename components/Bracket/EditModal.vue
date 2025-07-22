<template>

  <UModal>
    
      <template #header>

      </template>
      <template #body >
        <UForm :state="state" :scheam="schema" @submit="onSubmit" class="flex flex-col gap-5">
          <UFormField label="الحكم" name="refereeId" :ui="{ error: 'm-0' }">
            <UInputMenu v-model="state.refereeId" :options="Refres" value-attribute="id" option-attribute="username"
              :search-attributes="['username']" :popper="{placement:'left-end'}" />
          </UFormField>
          <UFormField label="الطاولة" name="tableId">
            <UInputMenu v-model="state.tableId" :options="Tables" value-attribute="id" option-attribute="name"
              :search-attributes="['name']"  :popper="{placement:'left-end'}"/>
          </UFormField>
          <UFormField name="startAt" label="تبداء" class="grow">
            <VueDatePicker v-model="state.startAt" :enable-time-picker="false" dir="ltr" position="right" />
          </UFormField>

          <UFormField name="roundName" label="اسم الجولة">
            <UInput v-model="state.roundName" />
          </UFormField>

          <UButton label="حفظ" type="submit" class="w-1/2 mx-auto" block />
        </UForm>
      </template>
      <template #footer>
        <div v-if="match.themTeamId && match.usTeamId">

          <UDropdown :items="withdrawItems" :popper="{ placement: 'bottom-end' }"
            v-if="match.state.toLowerCase() == 'created'" :ui="{ width: 'w-[300px]' }">
            <UButton color="error" label="انسحاب" trailing-icon="i-heroicons-chevron-down-20-solid" />
          </UDropdown>
          <UButton v-else-if="privilege == Privilege.Admin || privilege == Privilege.Owner" color="error"
            label="اعادة الضبط" @click="onReset" />
        </div>

      </template>
   
  </UModal>

</template>
<script lang="ts" setup>
// refre and table 
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


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
tableREQ.fetchREQ(tour_id)
refresREQ.fetchREQ(tour_id)
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
  startAt:new Date( props.match.startAt),
  roundName: props.match.roundName,
  isMarked: props.match.isMarked
})


const updateREQ = await updateMatch()
const onSubmit = async () => {
  state.startAt = new Date(state.startAt).toISOString()
  console.log(state.startAt)
  await updateREQ.fetchREQ(tour_id, props.match.id.toString(), state)
  if (updateREQ.status.value == "success") {
    toast.add({ title: "update done" })
    emit('close')
  }
}

// withdraw dropdown 
const MatchStateREQ = await updateMatchState()
const withdrawUS = async () => {
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
const withdrawItems = [[{ label: ` انسحاب  ${props.match.usTeamName}`, click: withdrawUS }, { label: ` انسحاب  ${props.match.themTeamName}`, click: withdrawThem }, { label: 'انسحاب كلا الفريقين', click: withdrawBoth }]]


</script>

<style></style>