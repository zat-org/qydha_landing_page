<template>
  <UCard :ui="{ base: 'h-full flex flex-col  ', body: { base: 'grow ' } }">
    <template #header>
      <p>
        {{ tourREQ.data.value?.data.name }}
        /
        المديرين
      </p>
    </template>
    <UTable :data="moderators" >
      <template #action-data="{row}">
        <UButtonGroup>
          <UButton icon="material-symbols:settings" color="yellow" @click="openUpdateModal(row)" />
          <UButton icon="material-symbols:delete" color="red" @click="onDeleteModerator(row)" />

        </UButtonGroup>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-between items-centerr ">
        <UButton label="اضافة" @click="AddModerator" />
        <UButton label="عودة" color="red" @click="navigateTo('/tournament/' + tour_id)" />

      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>

import type { IModerator, IModeratorCreate } from '~/models/tournamentModeratorr';
import AddModal from './AddModal.vue';
import EditModal from './EditModal.vue';
const route = useRoute()
const overlay = useOverlay()
const tour_id = route.params.id.toString()
const tourREQ = await useTournament().getTourById()
await tourREQ.fetchREQ(+tour_id)
if (tourREQ.status.value == "error") {
  navigateTo('/tournament')
}
const moderatorsGetREQ =await useTournamentModerator().getAllmoderators()
await moderatorsGetREQ.fetchREQ(tour_id)

const moderators = computed(() => {
  if (moderatorsGetREQ.status.value=="success"){
    return moderatorsGetREQ.data.value?.data
  }
  
})
const cols = [
  { key: 'user.username', label: 'الاسم' },
  { key: 'user.phone', label: 'الهاتف' },
  { key: 'action', label: '#' },

]


const AddModerator = () => {
  overlay.create(AddModal).open()
}

const openUpdateModal = (row:IModerator) => {
  overlay.create(EditModal,{props:{moderator:row}}).open()
}
const deletModeratorREQ = await useTournamentModerator().deleteModerator()
const onDeleteModerator = async (row: IModerator) => {
  await deletModeratorREQ.fetchREQ(tour_id, row.user.id)
}
</script>

<style></style>