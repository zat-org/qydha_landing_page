<template>
  <UCard>
    <template #header>
      <h1 class="text-2xl font-bold">الطاولات</h1>
    </template>
    <UTable :data="tables" :columns="cols">
      <template #actions-cell="{ row }">
        <UButtonGroup>
          <UButton color="warning" @click="openUpdateModal(row.original)">
            <IconSetting class="text-lg" />
          </UButton>


        </UButtonGroup>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-between ">
        <!-- <UButton label="add" @click="openAddModal" /> -->
        <UButton label="عودة" color="error" @click="navigateTo('/tournament/' + tour_id)" />

      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { ITable } from '~/models/Table';
import UpdateModal from './UpdateModal .vue';
const overlay = useOverlay()
const route = useRoute()
const tour_id = route.params.id.toString()
const getTableREQ = await useTournamentTable().getTable()
await getTableREQ.fetchREQ(tour_id)
const tables = computed(() => {
  return [
    {
      id: '1',
      name: 'طاولة 1',
      state: 'active',
      team1: "A|B",
      team2: "C|D",
      refree: "Refree1",
      tournamentId: tour_id
    },
    {
      id: '2',
      name: 'طاولة 2',
      state: 'active',
      team1: "E|F",
      team2: "G|H",
      refree: "Refree2",
      tournamentId: tour_id
    },
    {
      id: '3',
      name: 'طاولة 3',
      state: 'active',
      team1: "I|J",
      team2: "K|L",
      refree: "Refree3",
      tournamentId: tour_id
    },

  ]
  return getTableREQ.data.value?.data
})

const cols = [
  { accessorKey: 'name', header: 'الاسم ' },
  { accessorKey: 'state', header: 'الحالة' },
  { accessorKey: 'team1', header: 'الفريق الاول' },
  { accessorKey: 'team2', header: 'الفريق الثاني' },
  { accessorKey: 'refree', header: 'الحكم' },
  { accessorKey: 'actions', header: '# ' }
]
const deleteREQ = await useTournamentTable().deleteTable()
const deleteTable = async (row: ITable) => {
  await deleteREQ.fetchREQ(tour_id, row.id)
}
const openUpdateModal = (row: ITable) => {
  const data = tables.value?.find(t => t.id == row.id)
  if (data) {
    overlay.create(UpdateModal, { props: { table: data } }).open()
  }
}
</script>

<style></style>