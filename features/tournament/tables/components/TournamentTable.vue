<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-right" label="عوده" variant="ghost" color="neutral"
            @click="navigateTo(`/tournament/${tour_id}`)" />
          <h1 class="text-2xl font-bold">     
          <span>الطاولات</span>
          ({{ tablesNumber }})
        </h1>
        </div>
        <UButton 
          v-if="canAddTable"
          label="إضافة طاولة" 
          color="primary" 
          icon="i-heroicons-plus-circle"
          :loading="addTableREQ.status.value=='pending'"
          @click="openAddModal"
        />
      </div>
    </template>

    <div v-if="hasPlaces" class="mb-4 max-w-xs">
      <UFormField label="تصفية حسب المكان">
        <USelect
          v-model="placeFilter"
          :items="placeFilterItems"
          placeholder="كل الأماكن"
        />
      </UFormField>
    </div>

    <!-- Loading State -->
    <div v-if="getTableREQ.pending.value" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
        <p class="text-gray-500 dark:text-gray-400">جاري تحميل الطاولات...</p>
      </div>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="getTableREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="خطأ في تحميل الطاولات"
      :description="getTableREQ.error.value?.message || 'حدث خطأ أثناء تحميل البيانات'"
      class="mb-4"
    >
      <template #actions>
        <UButton 
          color="error" 
          variant="soft" 
          label="إعادة المحاولة"
          @click="getTableREQ.refresh()"
        />
      </template>
    </UAlert>

    <!-- Empty State -->
    <div v-else-if="!tableRows || tableRows.length === 0" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-heroicons-table-cells" class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-2">لا توجد طاولات</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">ابدأ بإضافة طاولة جديدة</p>
      <UButton 
        label="إضافة طاولة" 
        color="primary"
        icon="i-heroicons-plus-circle"
        @click="openAddModal"
      />
    </div>

    <!-- Table Data -->
    <UTable 
      v-else
      :data="tableRows" 
      :columns="cols"
      :loading="getTableREQ.status.value === 'pending'"
      class="w-full"
    >
      <template #actions-cell="{ row }">
        <UFieldGroup>
          <UButton 
            color="warning" 
            icon="i-heroicons-pencil-square"
            @click="()=>openUpdateModal(row.original)"
            :loading="updateTableREQ.status.value === 'pending'"
          >
            تعديل
          </UButton>
          <UButton 
            color="error" 
            icon="i-heroicons-trash"
            @click="()=>confirmDelete(row.original)"
            :loading="deleteREQ.status.value === 'pending'"
            v-if="row.original.connectedGamesCount === 0"
          >
            حذف
          </UButton>
        </UFieldGroup>
      </template>
    </UTable>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <span v-if="tables && tables.length > 0">
            إجمالي الطاولات: <span class="font-semibold">{{ tables.length }}</span>
          </span>
        </div>
        
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { ITable } from '~/features/tournament/models/Table';
import UpdateModal from './UpdateModal.vue';
import AddModal from './AddModal.vue';
import { TournamentDetailedState } from '~/features/tournament/models/tournament';
import { useTournamentPlaces } from '~/features/tournament/composables/useTournamentPlaces';
const overlay = useOverlay()
const route = useRoute()
const toast = useToast()
const tour_id = route.params.id.toString()
const tourREQ = await useSingleTournament().getSingelTournament(tour_id)

const tour = computed(() => {
  if (tourREQ.data.value)
    return tourREQ.data.value.tournament
})

const { placeLabel, hasPlaces } = useTournamentPlaces(() => tourREQ.data.value)

const canAddTable = computed(() => {
  return tour.value?.detailedState!=TournamentDetailedState.Finished
})

// Get tables
const getTableREQ = useTournamentTable().getTable(tour_id)
// await getTableREQ.fetchREQ(tour_id)

// Watch for errors on initial load
watch(() => getTableREQ.status.value, (status) => {
  if (status === 'error') {
    toast.add({
      title: 'خطأ في تحميل الطاولات',
      description: getTableREQ.error.value?.message || 'حدث خطأ أثناء تحميل البيانات',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }
})

// Tables data
const tables = computed(() => {
  return getTableREQ.data.value || []
})
const tablesNumber = computed(() => {
  return tables.value?.length || 0
})

const placeFilter = ref<string | null>(null)
const placeFilterItems = computed(() => [
  { label: 'كل الأماكن', value: null },
  ...((tourREQ.data.value?.tournament.qualificationStagePlaces ?? []).map((p) => ({
    label: p.locationDescription,
    value: p.id,
  }))),
])

const filteredTables = computed(() => {
  if (!placeFilter.value) return tables.value
  return tables.value.filter((t) => t.placeId === placeFilter.value)
})

// Table columns
const cols = computed(() => {
  const base = [
    { accessorKey: 'name', header: 'الاسم' },
  ]
  if (hasPlaces.value) {
    base.push({ accessorKey: 'placeLabel', header: 'المكان' })
  }
  base.push({ accessorKey: 'actions', header: 'الإجراءات' })
  return base
})

const tableRows = computed(() =>
  filteredTables.value.map((t) => ({
    ...t,
    placeLabel: placeLabel(t.placeId),
  })),
)

// Delete table
const deleteREQ = useTournamentTable().deleteTable()
import ConfirmModal from '~/components/ConfirmationModal.vue';
const confirmModal = overlay.create(ConfirmModal )
const confirmDelete = async (row: ITable) => {
  const instance = confirmModal.open( {message: `هل أنت متأكد من حذف الطاولة "${row.name}"؟`} )
  const confirmed = await instance.result
  if (!confirmed) return

  await deleteREQ.fetchREQ(tour_id, row.id)
  
  if (deleteREQ.status.value === 'success') {
    toast.add({
      title: 'تم الحذف بنجاح',
      description: `تم حذف الطاولة "${row.name}" بنجاح`,
      color: 'success',
      icon: 'i-heroicons-check-circle'
    })
  } else if (deleteREQ.status.value === 'error') {
    toast.add({
      title: 'خطأ في الحذف',
      description: deleteREQ.error.value?.message || 'حدث خطأ أثناء حذف الطاولة',
      color: 'error',
      icon: 'i-heroicons-exclamation-triangle'
    })
  }
}

// Update table
const updateTableREQ = useTournamentTable().updateTable()
const openUpdateModal = (row: ITable) => {
  const data = tables.value?.find(t => t.id === row.id)
  if (data) {
    overlay.create(UpdateModal, { props: { table: data } }).open()
    // Data will be refreshed automatically via refreshAppData in the composable
  }
}

// Add table
const addTableREQ = useTournamentTable().addTable()
const openAddModal = () => {
  overlay.create(AddModal, { props: { tourId: tour_id } }).open()
  // Data will be refreshed automatically via refreshAppData in the composable
}

// Refresh tables manually if needed

</script>

<style scoped>
/* Add any custom styles if needed */
</style>
