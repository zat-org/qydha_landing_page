<template>
  <UCard class="h-full flex flex-col">
    <template #header>
      <p>
        {{ tourREQ.data.value?.data.tournament.title }}
        /
        المديرين
      </p>
    </template>
    <UTable :data="moderators" >
      <template #action-data="{ row }">
        <UFieldGroup>
          <UButton icon="material-symbols:settings" color="warning" @click="openUpdateModal(row.original)" />
          <UButton icon="material-symbols:delete" color="error" @click="onDeleteModerator(row.original)" />

        </UFieldGroup>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-between items-centerr ">
        <UButton label="اضافة" @click="AddModerator" />
        <UButton label="عودة" color="error" @click="navigateTo('/tournament/' + tour_id)" />

      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>

import type { IModerator, IModeratorCreate } from '~/features/tournament/models/tournamentModeratorr';
import AddModal from './AddModal.vue';
import EditModal from './EditModal.vue';
const route = useRoute()
const overlay = useOverlay()
const tour_id = route.params.id.toString()
const tourREQ = await useTournament().getSingelTournament(tour_id)
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
