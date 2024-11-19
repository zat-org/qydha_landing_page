<template>
  <UCard :ui="{ base: 'flex flex-col h-full ', body: { base: 'grow flex flex-col  justify-between' } }">
    <template #header>
      <p>
        {{ getTourREQ.data.value?.data.name }}
        /
        الفرق
      </p>
    </template>

    <UTable :rows="teams" :columns="columns" :ui="{ td: { padding: ' py-1 px-2' }, th: { padding: ' py-1 px-2' } }">
      <template #players-data="{ row }">
        <div class="flex  justify-start items-start gap-2 ">
          <UBadge v-for="player of row.players" size="lg" color="gray">
            <div class="flex items-center justify-between  gap-2">
              <p>{{ player.name }}</p>
              <IconDelete class="text-2xl text-red-500  cursor-pointer " @click="removePlayer(row, player.id)" />
            </div>
          </UBadge>

        </div>
      </template>
      <template #actions-data="{ row }">
        <UButtonGroup>
          <UButton icon="material-symbols:delete" color="red" @click="deleteTeam(row)" />
          <UButton icon="material-symbols:settings" color="yellow" @click="openUpdateModal(row)" />
          <UButton @click="openAddPlayerModal(row.id)">
            <template #leading>
              <IconAddUser class="text-xl" />
            </template>
          </UButton>
        </UButtonGroup>
      </template>
    </UTable>
    <UPagination v-model="page"  :page-count="10" :total="total" class="mx-auto" />
    <template #footer>
      <div class="flex justify-between items-center ">
        <UButton label="اضافة" @click="openAddModal" />
        <UButton label="عودة " color="red" @click="navigateTo('/tournament/' + tour_id)" />
      </div>
    </template>

  </UCard>
</template>

<script lang="ts" setup>
import type { IPlayer, ITeam } from '~/models/tournamentTeam';
import AddModal from './AddModal.vue';
import UpdateModal from './UpdateModal.vue';
import AddPlayerModal from './AddPlayerModal.vue';

const route = useRoute()
const modal = useModal()
const tour_id = route.params.id.toString()

const openAddModal = () => {
  modal.open(AddModal)
}

const getTourREQ = await useTournament().getTourById()
await getTourREQ.fetchREQ(+tour_id)
if (getTourREQ.status.value == "error") {
  navigateTo('/tournament')
}

const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams()
await getTeamsREQ.fetchREQ(tour_id)

const page  = ref(getTeamsREQ.data.value?.data.currentPage!)
const total = ref(getTeamsREQ.data.value?.data.totalCount!)

const teams = computed(() => {
  if (getTeamsREQ.data.value)
    return getTeamsREQ.data.value.data.items
})

watch (page ,async(newValue,oldvalue)=>{
    await getTeamsREQ.fetchREQ(tour_id,page.value)
    total.value = getTeamsREQ.data.value?.data.totalCount!
  })
const columns = [
  { label: 'الاسم', key: 'name' },
  { label: 'الاعبين', key: 'players' },
  { label: '#', key: 'actions' },
]

const delteTeamREQ = await useTourrnamentTeam().deleteTourTeam()
const deleteTeam = async (row: ITeam) => {
  await delteTeamREQ.fetchREQ(tour_id, row.id.toString())
}

const openUpdateModal = (row: ITeam) => {
  modal.open(UpdateModal, { team: row })
}



const openAddPlayerModal = (team_id: number) => {
  modal.open(AddPlayerModal, { team_id: team_id.toString() })
}


const deleteREQ = await useTourrnamentTeam().removePlayerFromTeam()
const removePlayer = async (row: ITeam, player_id: number) => {
  await deleteREQ.fetchREQ(row.tournamentId.toString(), row.id.toString(), player_id.toString())
}
</script>

<style></style>