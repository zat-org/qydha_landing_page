<template>
  <div v-if="!tour">
    <div class="flex items-center justify-center h-full">
      <UProgress indeterminate />
    </div>
  </div>
  <UCard v-else :ui="{ root: 'flex flex-col h-full ', body: 'grow flex flex-col  justify-between' }">
    <template #header>
      <div class="flex items-center justify-between">
        <p>
          {{ tour.title }}
          /
          الفرق
        </p>
        <div class="flex items-center justify-start gap-2">
          <UButton 
              label="إضافة فريق" 
              icon="i-heroicons-plus" 
              color="primary" 
              @click="openDrawer('add')"
            />
        
        </div>
      </div>
    </template>

    <UTable :data="teams" :columns="columns">
      <template #players-cell="{ row }">
        <div class="flex  justify-start items-start gap-2 ">
          <div v-for="player of row.original.players" class="flex items-center justify-between  gap-2">
            <div class="flex items-center justify-between  gap-2 bg-gray-100 dark:bg-gray-800 px-4  py-2 rounded-md">
              <p>{{ player.name }}</p>

              <UIcon name="i-lucide-x" class="text-2xl text-red-500  cursor-pointer "
                @click="removePlayer(row.original,player.id)" />
            </div>
          </div>

        </div>
      </template>
      <template #actions-cell="{ row }">
        <UButtonGroup>
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
    <template #footer>
      <div class="flex justify-between items-center ">
        <UButton label="عودة " color="error" @click="navigateTo('/tournament/' + tour_id)" />
      </div>
    </template>

  </UCard>

  <!-- Single Drawer with Dynamic Content -->
  <UDrawer 
    v-model:open="isDrawerOpen" 
    direction="left"
    :handle="false" 
    :title="drawerConfig.title" 
    :description="drawerConfig.description"
    class="drawer-responsive"
  >
    <template #content>
      <div class="flex-1 p-3 sm:p-4 md:p-6 min-h-0 min-w-96 ">
        <!-- Dynamic content based on drawer mode -->
        <TournamentTeamAddForm 
          v-if="drawerMode === 'add'" 
          ref="teamForm" 
          @close="closeDrawer" 
        />
        <TournamentTeamUpdateForm 
          v-else-if="drawerMode === 'update'" 
          :team="selectedTeam!"
          ref="updateForm" 
          @close="closeDrawer" 
        />
        <TournamentTeamAddPlayerForm 
          v-else-if="drawerMode === 'addPlayer'" 
          :teamId="selectedTeamId!.toString()"
          ref="addPlayerForm" 
          @close="closeDrawer" 
        />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { KeepAlive } from 'vue';
import type { IPlayer, ITeam } from '~/models/tournamentTeam';

const route = useRoute()
const tour_id = route.params.id.toString()

const getTourREQ = await useTournament().getSingelTournament(tour_id)

const tour = computed(() => {
 if (getTourREQ.data.value)
    return getTourREQ.data.value.data.tournament
})

const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams()
await getTeamsREQ.fetchREQ(tour_id)

const page = ref(getTeamsREQ.data.value?.data.currentPage!)
const total = ref(getTeamsREQ.data.value?.data.totalCount!)

// Drawer state management
const isDrawerOpen = ref(false)
const drawerMode = ref<'add' | 'update' | 'addPlayer' | null>(null)
const selectedTeam = ref<ITeam | null>(null)
const selectedTeamId = ref<number | null>(null)
const teamForm = ref()
const updateForm = ref()
const addPlayerForm = ref()

// Drawer configuration based on mode
const drawerConfig = computed(() => {
  switch (drawerMode.value) {
    case 'add':
      return {
        title: 'إضافة فريق جديد',
        description: 'إضافة فريق جديد'
      }
    case 'update':
      return {
        title: 'تعديل الفريق',
        description: 'تعديل بيانات الفريق'
      }
    case 'addPlayer':
      return {
        title: 'إضافة لاعب للفريق',
        description: 'إضافة لاعب جديد للفريق'
      }
    default:
      return {
        title: '',
        description: ''
      }
  }
})

// Open drawer with different modes
const openDrawer = (mode: 'add' | 'update' | 'addPlayer', data?: any) => {
  drawerMode.value = mode
  
  if (mode === 'update' && data) {
    selectedTeam.value = data
  } else if (mode === 'addPlayer' && data) {
    selectedTeamId.value = data
  }
  
  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  drawerMode.value = null
  selectedTeam.value = null
  selectedTeamId.value = null
  
  // Refresh teams list after any operation
  // getTeamsREQ.fetchREQ(tour_id, page.value)
  // total.value = getTeamsREQ.data.value?.data.totalCount!
}

const teams = computed(() => {
  if (getTeamsREQ.data.value)
    return getTeamsREQ.data.value.data.items
})

watch(page, async (newValue, oldvalue) => {
  await getTeamsREQ.fetchREQ(tour_id, page.value)
  total.value = getTeamsREQ.data.value?.data.totalCount!
})

const columns = [
  { header: 'الاسم', accessorKey: 'name' },
  { header: 'الاعبين', accessorKey: 'players' },
  { header: '#', id: 'actions' },
]

const delteTeamREQ = await useTourrnamentTeam().deleteTourTeam()
const deleteTeam = async (row: ITeam) => {
  const selectedteam = teams.value?.find(t => t.id == row.id)
  if (selectedteam) {
    await delteTeamREQ.fetchREQ(tour_id, selectedteam.id.toString())
    // Refresh teams list after deletion
    getTeamsREQ.fetchREQ(tour_id, page.value)
    total.value = getTeamsREQ.data.value?.data.totalCount!
  }
}

const openUpdateModal = (row: ITeam) => {
  openDrawer('update', row)
}

const openAddPlayerModal = (team_id: number) => {
  openDrawer('addPlayer', team_id)
}

const deleteREQ = await useTourrnamentTeam().removePlayerFromTeam()
const removePlayer = async (row: ITeam, player_id:  string) => {
  await deleteREQ.fetchREQ(tour_id, row.id.toString(), player_id)
  // Refresh teams list after removing player
}

</script>

<style scoped>
/* Responsive drawer styles */
:deep(.drawer-responsive) {
  width: 100%;
  max-height: 100vh;
  height: 100%;
}

/* Ensure drawer content takes full height and is scrollable */
:deep(.drawer-responsive [data-content]) {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
}

@media (min-width: 640px) {
  :deep(.drawer-responsive) {
    width: 24rem; /* sm:w-96 */
    max-height: 100vh;
  }
}

@media (min-width: 768px) {
  :deep(.drawer-responsive) {
    width: 500px; /* md:w-[500px] */
  }
}

@media (min-width: 1024px) {
  :deep(.drawer-responsive) {
    width: 600px; /* lg:w-[600px] */
  }
}

@media (min-width: 1280px) {
  :deep(.drawer-responsive) {
    width: 700px; /* xl:w-[700px] */
  }
}

/* Make drawer full width on mobile */
@media (max-width: 639px) {
  :deep(.drawer-responsive) {
    width: 100% !important;
    max-height: 90vh;
  }
}
</style>