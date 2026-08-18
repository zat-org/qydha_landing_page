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

    <div class="mb-4 max-w-xs">
      <UFormField label="المكان">
        <USelect
          v-model="selectedPlaceId"
          :items="placeItems"
          placeholder="اختر المكان"
        />
      </UFormField>
    </div>

    <!-- Loading State -->
    <div v-if="getPlacesREQ.pending.value || getTableREQ.pending.value" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
        <p class="text-gray-500 dark:text-gray-400">جاري تحميل الطاولات...</p>
      </div>
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="getPlacesREQ.error.value || getTableREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="خطأ في تحميل الطاولات"
      :description="(getPlacesREQ.error.value || getTableREQ.error.value)?.message || 'حدث خطأ أثناء تحميل البيانات'"
      class="mb-4"
    >
      <template #actions>
        <UButton 
          color="error" 
          variant="soft" 
          label="إعادة المحاولة"
          @click="retryLoad"
        />
      </template>
    </UAlert>

    <div v-else-if="!selectedPlaceId" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-heroicons-map-pin" class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-2">اختر مكاناً لعرض طاولاته</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!tables || tables.length === 0" class="flex flex-col items-center justify-center py-12">
      <UIcon name="i-heroicons-table-cells" class="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
      <p class="text-lg text-gray-500 dark:text-gray-400 mb-2">لا توجد طاولات</p>
      <p class="text-sm text-gray-400 dark:text-gray-500 mb-4">ابدأ بإضافة طاولة جديدة</p>
      <UButton 
        v-if="canAddTable"
        label="إضافة طاولة" 
        color="primary"
        icon="i-heroicons-plus-circle"
        @click="openAddModal"
      />
    </div>

    <!-- Table Data -->
    <UTable 
      v-else
      :data="tables" 
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
            v-if="(row.original.connectedGamesCount ?? 0) === 0"
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
import ConfirmModal from '~/components/ConfirmationModal.vue';
import { canMutateTournamentPlaces } from '~/features/tournament/places/utils';

const overlay = useOverlay()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const tour_id = route.params.id.toString()
const tourREQ = await useSingleTournament().getSingelTournament(tour_id)

const getPlacesREQ = useTournamentPlacesApi().getPlaces(tour_id)
const selectedPlaceId = ref((route.query.placeId as string) || '')
const getTableREQ = useTournamentTable().getTable(tour_id, selectedPlaceId)

const canAddTable = computed(() => {
  return (
    !!selectedPlaceId.value &&
    canMutateTournamentPlaces(tourREQ.data.value?.tournament?.detailedState)
  )
})

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

const places = computed(() => getPlacesREQ.data.value || [])

const placeItems = computed(() =>
  places.value.map((p) => ({
    label:
      p.type === 'FinalStagePlace'
        ? `${p.locationDescription} (نهائي)`
        : p.locationDescription,
    value: p.id,
  })),
)

watch(
  places,
  (list) => {
    if (!list.length) return
    const fromQuery = route.query.placeId?.toString()
    if (fromQuery && list.some((p) => p.id === fromQuery)) {
      selectedPlaceId.value = fromQuery
      return
    }
    if (!selectedPlaceId.value || !list.some((p) => p.id === selectedPlaceId.value)) {
      selectedPlaceId.value = list[0]!.id
    }
  },
  { immediate: true },
)

watch(selectedPlaceId, (id) => {
  if (!id) return
  if (route.query.placeId !== id) {
    void router.replace({ query: { ...route.query, placeId: id } })
  }
})

const tables = computed(() => getTableREQ.data.value || [])
const tablesNumber = computed(() => tables.value?.length || 0)

const cols = [
  { accessorKey: 'name', header: 'الاسم' },
  { accessorKey: 'actions', header: 'الإجراءات' },
]

function retryLoad() {
  void getPlacesREQ.refresh()
  void getTableREQ.refresh()
}

const deleteREQ = useTournamentTable().deleteTable()
const confirmModal = overlay.create(ConfirmModal )
const confirmDelete = async (row: ITable) => {
  const instance = confirmModal.open( {message: `هل أنت متأكد من حذف الطاولة "${row.name}"؟`} )
  const confirmed = await instance.result
  if (!confirmed) return

  await deleteREQ.fetchREQ(tour_id, selectedPlaceId.value, row.id)
  
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

const updateTableREQ = useTournamentTable().updateTable()
const openUpdateModal = (row: ITable) => {
  overlay.create(UpdateModal, { props: { table: row } }).open()
}

const addTableREQ = useTournamentTable().addTable()
const openAddModal = () => {
  if (!selectedPlaceId.value) return
  overlay.create(AddModal, { props: { tourId: tour_id, placeId: selectedPlaceId.value } }).open()
}
</script>
