<template>
  <div v-if="!tour">
    <div class="flex items-center justify-center h-full">
      <UProgress indeterminate />
    </div>
  </div>
  <UCard v-else :ui="{ root: 'flex flex-col h-full ', body: 'grow flex flex-col  justify-between' }">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
        <UButton
          v-if="!embedded"
          icon="i-heroicons-arrow-right"
          label="عوده"
          variant="ghost"
          color="neutral"
          @click="router.back()"
        />
        
        <h1 class="text-2xl font-bold">     
          {{ tour.title }}
          /
          <span class="text-gray-500">الفرق</span>
          ({{ teamsNumber }})
        </h1>
        </div>
      
        <div class="flex items-center justify-start gap-2">
          <!-- <UButton label="قبول ملف Excel" icon="i-heroicons-document-arrow-up" color="success"
          :loading="importTeamsFromExcelREQ.result.status.value == 'pending'"
            @click="() => openExcelDialog()" /> -->

          <UButton label="إضافة فريق" icon="i-heroicons-plus" color="primary" @click="openDrawer('add')" />
      </div>
      </div>
    </template>

    <UTable :data="teams" :columns="columns" :key="tablekey">
      <template #players-cell="{ row }">
        <div class="flex  justify-start items-start gap-2 ">
          <div v-for="player of row.original.players" class="flex items-center justify-between  gap-2"
            :key="player.toString()">
            <div class="flex items-center justify-between  gap-2 bg-gray-100 dark:bg-gray-800 px-4  py-2 rounded-md">
              <p> {{ player.qydhaUserData?.username ?? player.name }}</p>
              <div v-if="isTeamNotJoinRequest(row.original)">
                <UIcon name="i-lucide-x" class="text-xl text-red-500  cursor-pointer "
                  @click="removePlayer(row.original, player.id)" />
                <UIcon name="i-material-symbols:settings" class="text-xl text-warning-500  cursor-pointer "
                  @click="openUpdatePlayerModal(row.original, player)" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #actions-cell="{ row }">

        <UButtonGroup v-if="isTeamNotJoinRequest(row.original)">
          <UButton icon="material-symbols:delete" color="error" @click="deleteTeam(row.original)" />
          <UButton icon="material-symbols:settings" color="warning" @click="openUpdateModal(row.original)" />
          <UButton @click="openAddPlayerModal(row.original.id)" v-if="row.original.players.length < 2">
            <template #leading>
              <IconAddUser class="text-xl" />
            </template>
          </UButton>
        </UButtonGroup>
      </template>
    </UTable>
    <UPagination v-model:page="page" :page-count="10" :total="total" class="mx-auto" />
  </UCard>

  <UDrawer v-model:open="isDrawerOpen" direction="left" :handle="false" :title="drawerConfig.title"
    :description="drawerConfig.description" class="drawer-responsive">
    <template #content>
      <div class="flex-1 p-3 sm:p-4 md:p-6 min-h-0 min-w-96 ">
        <TournamentTeamAddForm v-if="drawerMode === 'add'" @close="closeDrawer" />
        <TournamentTeamUpdateForm v-else-if="drawerMode === 'update'" :team="selectedTeam!" @close="closeDrawer" />
        <TournamentTeamAddPlayerForm v-else-if="drawerMode === 'addPlayer'" :teamId="selectedTeamId!.toString()"
          ref="addPlayerForm" @close="closeDrawer" />
        <TournamentTeamUpdatePlayerForm v-else-if="drawerMode === 'updatePlayer'" :player="selectedPlayer!"
          @close="closeDrawer" />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { ConfirmationModal } from '#components';
import type { DetailTournament } from '~/features/tournament/models/tournament';
import type { IPlayer, ITeam } from '~/features/tournament/models/tournamentTeam';
import TournamentTeamAddForm from '~/features/tournament/teams/components/AddForm.vue';
import TournamentTeamUpdateForm from '~/features/tournament/teams/components/UpdateForm.vue';
import TournamentTeamAddPlayerForm from '~/features/tournament/teams/components/AddPlayerForm.vue';
import TournamentTeamUpdatePlayerForm from '~/features/tournament/teams/components/UpdatePlayerForm.vue';
import { useTournamentEmbedded } from '~/features/tournament/core/components/TournamentGet/useTournamentGetWorkspace';

const tablekey = ref(Date.now())
const router = useRouter()
const route = useRoute()
const embedded = useTournamentEmbedded()
const tour_id = route.params.id.toString()
const toast = useToast()




const tournamentDashboardKey = `getSingelTournament-${tour_id}` as const
const { data: tournamentDashboardData } = useNuxtData<{ data: DetailTournament }>(tournamentDashboardKey)

const getTourREQ = await useTournament().getSingelTournament(tour_id, { immediate: false })

if (!tournamentDashboardData.value?.data?.tournament) {
  await getTourREQ.refresh()
}

const tour = computed(() => tournamentDashboardData.value?.data.tournament)
const page = ref(1)

const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams()
await getTeamsREQ.fetchREQ(tour_id, page.value)

const total = computed(() => getTeamsREQ.data.value?.data.totalCount!)
const isDrawerOpen = ref(false)
const drawerMode = ref<'add' | 'update' | 'addPlayer' | 'updatePlayer' | null>(null)
const selectedTeam = ref<ITeam | null>(null)
const selectedPlayer = ref<IPlayer | null>(null)
const selectedTeamId = ref<number | null>(null)
const overlay = useOverlay()

const drawerConfig = computed(() => {
  switch (drawerMode.value) {
    case 'add': return { title: 'إضافة فريق جديد', description: 'إضافة فريق جديد' }
    case 'update': return { title: 'تعديل الفريق', description: 'تعديل بيانات الفريق' }
    case 'addPlayer': return { title: 'إضافة لاعب للفريق', description: 'إضافة لاعب جديد للفريق' }
    case 'updatePlayer': return { title: 'تعديل اللاعب', description: 'تعديل بيانات اللاعب' }
    default: return { title: '', description: '' }
  }
})

const openDrawer = (mode: 'add' | 'update' | 'addPlayer' | 'updatePlayer', data?: any) => {
  drawerMode.value = mode
  if (mode === 'update' && data) selectedTeam.value = data
  else if (mode === 'addPlayer' && data) selectedTeamId.value = data
  else if (mode === 'updatePlayer' && data) selectedPlayer.value = data.player
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  drawerMode.value = null
  selectedTeam.value = null
  selectedTeamId.value = null
  tablekey.value = Date.now()
}

const teams = computed(() => getTeamsREQ.data.value?.data.items)
const teamsNumber = computed(() => getTeamsREQ.data.value?.data.totalCount!)

watch(page, async () => {
  await getTeamsREQ.fetchREQ(tour_id, page.value)
})

const columns = [
  { header: 'الاسم', accessorKey: 'name' },
  { header: 'الاعبين', accessorKey: 'players' },
  { header: '#', id: 'actions' },
]
const ConfiemationModal = overlay.create(ConfirmationModal)
const delteTeamREQ = await useTourrnamentTeam().deleteTourTeam()
const deleteTeam = async (row: ITeam) => {
  const selectedteam = teams.value?.find(t => t.id == row.id)
  if (selectedteam) {
    const instance = ConfiemationModal.open({ message: `هل أنت متأكد من حذف الفريق "${selectedteam.name}"?` })
    if (await instance.result) {
      await delteTeamREQ.fetchREQ(tour_id, selectedteam.id.toString())
    }
  }
}

const openUpdateModal = (row: ITeam) => openDrawer('update', row)
const openAddPlayerModal = (team_id: number) => openDrawer('addPlayer', team_id)
const openUpdatePlayerModal = (row: ITeam, player: IPlayer) => openDrawer('updatePlayer', { team: row, player: player })

const deleteREQ = await useTourrnamentTeam().removePlayerFromTeam()
const removePlayer = async (row: ITeam, player_id: string) => {
  const selectedplayer = row.players.find(p => p.id == player_id)
  if (selectedplayer) {
    const instance = ConfiemationModal.open({ message: `هل أنت متأكد من  جعل الاعب  "${selectedplayer.name}" لاعب حر بدلا من لاعب في الفريق "${row.name}"?` })
    if (await instance.result) {
      await deleteREQ.fetchREQ(tour_id, row.id.toString(), player_id)
    }
  }
}

const isTeamNotJoinRequest =(team: ITeam) => {
  return team.teamJoinRequestId == null
}
</script>

<style scoped></style>
