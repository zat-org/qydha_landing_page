<template>
  <UCard :ui="{ base: 'h-full flex flex-col ', body: { base: 'grow ' } }">
    <template #header>
      tables
    </template>
    <UTable :data="tables"  :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }">
      <template #actions-data="{ row }">
        <UButtonGroup>
          <UButton color="yellow" @click="openUpdateModal(row)">
            <IconSetting class="text-lg" />
          </UButton>
          <UButton color="red" @click="deleteTable(row)">
            <IconDelete class="text-lg" />
          </UButton>

        </UButtonGroup>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-between ">
        <UButton label="add" @click="openAddModal" />
        <UButton label="back" color="red" @click="navigateTo('/tournament/' + tour_id)" />

      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { ITable } from '~/models/Table';
import AddModal from './AddModal.vue';
import UpdateModal from './UpdateModal .vue';


const route = useRoute()
const tour_id = route.params.id.toString()
const overlay = useOverlay()
const getTableREQ = await useTournamentTable().getTable()
await getTableREQ.fetchREQ(tour_id)
const tables = computed(() => {
  return getTableREQ.data.value?.data
})
const openAddModal = () => {
  modal.open(AddModal)
}
const cols = [
  { key: 'name', label: 'الاسم ' }
  , { key: 'actions', label: '# ' }
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