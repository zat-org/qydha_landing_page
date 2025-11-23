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
          <UButton label="قبول ملف Excel" icon="i-heroicons-document-arrow-up" color="success"
          :loading="importTeamsFromExcelREQ.result.status.value == 'pending'"
            @click="() => openExcelDialog()" />



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
              <p>{{ player.name }}</p>

              <UIcon name="i-lucide-x" class="text-xl text-red-500  cursor-pointer "
                @click="removePlayer(row.original, player.id)" />
              <UIcon name="i-material-symbols:settings" class="text-xl text-warning-500  cursor-pointer "
                @click="openUpdatePlayerModal(row.original, player)" />
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
        <UButton label="إضافة فريق إلى المجموعة النهائية" color="primary" @click="()=>addTeamToFinalGroup()" />
        <UButton label="عودة " color="error" @click="navigateTo('/tournament/' + tour_id)" />
      </div>
    </template>

  </UCard>

  <!-- Single Drawer with Dynamic Content -->
  <UDrawer v-model:open="isDrawerOpen" direction="left" :handle="false" :title="drawerConfig.title"
    :description="drawerConfig.description" class="drawer-responsive">
    <template #content>
      <div class="flex-1 p-3 sm:p-4 md:p-6 min-h-0 min-w-96 ">
        <!-- Dynamic content based on drawer mode -->
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
import { useFileDialog } from '@vueuse/core'
import type { IPlayer, ITeam } from '~/models/tournamentTeam';
const tablekey = ref(Date.now())
const route = useRoute()
const tour_id = route.params.id.toString()
const toast = useToast()
const { files, open: openExcelDialog, reset, onCancel, onChange } = useFileDialog({
  accept: '.xlsx,.xls,.csv',
  directory: false, 
})

const importTeamsFromExcelREQ = await useTourrnamentTeam().imprtTeamsFromExcel()
onChange(async (file: FileList | null) => {
  if (file) {
    const selectedFile = file[0]
    await importTeamsFromExcelREQ.fetchREQ(tour_id, selectedFile)
    if (importTeamsFromExcelREQ.result.status.value == "success") {
      toast.add({ title: "تم استيراد الفرق بنجاح", color: "success" })
    } else {
      const error = (importTeamsFromExcelREQ.result.error.value?.data as any).data.message
      console.log(error)
      toast.add({ title: error, color: "error" })
    }
  }
})


const getTourREQ = await useTournament().getSingelTournament(tour_id)

const tour = computed(() => {
  if (getTourREQ.data.value)
    return getTourREQ.data.value.data.tournament
})

const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams()
await getTeamsREQ.fetchREQ(tour_id)

const page = ref(1)

const total = computed(() => getTeamsREQ.data.value?.data.totalCount!)
// Drawer state management
const isDrawerOpen = ref(false)
const drawerMode = ref<'add' | 'update' | 'addPlayer' | 'updatePlayer' | null>(null)
const selectedTeam = ref<ITeam | null>(null)
const selectedPlayer = ref<IPlayer | null>(null)
const selectedTeamId = ref<number | null>(null)
// const teamForm = ref()
// const updateForm = ref()
// const addPlayerForm = ref()
const overlay = useOverlay()


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
    case 'updatePlayer':
      return {
        title: 'تعديل اللاعب',
        description: 'تعديل بيانات اللاعب'
      }
    default:
      return {
        title: '',
        description: ''
      }
  }
})


// Open drawer with different modes
const openDrawer = (mode: 'add' | 'update' | 'addPlayer' | 'updatePlayer', data?: any) => {
  drawerMode.value = mode
  if (mode === 'update' && data) {
    selectedTeam.value = data
  } else if (mode === 'addPlayer' && data) {
    selectedTeamId.value = data
  } else if (mode === 'updatePlayer' && data) {
    selectedPlayer.value = data.player
  }

  isDrawerOpen.value = true
}

const closeDrawer = () => {
  isDrawerOpen.value = false
  drawerMode.value = null
  selectedTeam.value = null
  selectedTeamId.value = null
  tablekey.value = Date.now()

}

const teams = computed(() => {
  if (getTeamsREQ.data.value)
    return getTeamsREQ.data.value.data.items
})

watch(page, async (newValue, oldvalue) => {
  await getTeamsREQ.fetchREQ(tour_id, page.value)
  // total.value = getTeamsREQ.data.value?.data.totalCount!
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
      // Refresh teams list after deletion
      //  await getTeamsREQ.fetchREQ(tour_id, page.value)
      //  total.value = getTeamsREQ.data.value?.data.totalCount!
    }
  }
}

const openUpdateModal = (row: ITeam) => {
  openDrawer('update', row)
}

const openAddPlayerModal = (team_id: number) => {
  openDrawer('addPlayer', team_id)
}

const openUpdatePlayerModal = (row: ITeam, player: IPlayer) => {
  console.log(row, player)
  openDrawer('updatePlayer', { team: row, player: player })
}


const deleteREQ = await useTourrnamentTeam().removePlayerFromTeam()
const removePlayer = async (row: ITeam, player_id: string) => {
  const selectedplayer = row.players.find(p => p.id == player_id)
  if (selectedplayer) {
    const instance = ConfiemationModal.open({ message: `هل أنت متأكد من  جعل الاعب  "${selectedplayer.name}" لاعب حر بدلا من لاعب في الفريق "${row.name}"?` })
    if (await instance.result) {
      await deleteREQ.fetchREQ(tour_id, row.id.toString(), player_id)
      // Refresh teams list after removing player
    }
  }
}

const addTeamToFinalGroupREQ =  useTournamentGroup().addTeamsToFinalGroup()
const addTeamToFinalGroup = async () => {
  const instance = ConfiemationModal.open({ message: `هل أنت متأكد من إضافة الفريق إلى المجموعة النهائية؟ لن تستطيع اضافة فرق  اخري ` })
  if (await instance.result) {
    await addTeamToFinalGroupREQ.fetchREQ(tour_id)
    if (addTeamToFinalGroupREQ.result.status.value == "success") {
      toast.add({ title: "تم اضافة الفرق إلى المجموعة النهائية بنجاح", color: "success" })
    } else {
      const error = (addTeamToFinalGroupREQ.result.error.value?.data as any).data.message
      console.log(error)
      toast.add({ title: error, color: "error" })
    }
  }
}
</script>

<style scoped></style>