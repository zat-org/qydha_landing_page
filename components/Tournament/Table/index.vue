<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">الطاولات</h1>
        <UButton 
          label="إضافة طاولة" 
          color="primary" 
          icon="i-heroicons-plus-circle"
          :loading="addTableREQ.status.value=='pending'"
          @click="openAddModal"
        />
      </div>
    </template>

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
    <div v-else-if="!tables || tables.length === 0" class="flex flex-col items-center justify-center py-12">
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
      :data="tables" 
      :columns="cols"
      :loading="getTableREQ.status.value === 'pending'"
      class="w-full"
    >
      <template #actions-cell="{ row }">
        <UButtonGroup>
          <UButton 
            color="warning" 
            icon="i-heroicons-pencil-square"
            @click="openUpdateModal(row.original)"
            :loading="updateTableREQ.status.value === 'pending'"
          >
            تعديل
          </UButton>
          <UButton 
            color="error" 
            icon="i-heroicons-trash"
            @click="confirmDelete(row.original)"
            :loading="deleteREQ.status.value === 'pending'"
          >
            حذف
          </UButton>
        </UButtonGroup>
      </template>
    </UTable>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <span v-if="tables && tables.length > 0">
            إجمالي الطاولات: <span class="font-semibold">{{ tables.length }}</span>
          </span>
        </div>
        <UButton 
          label="عودة" 
          color="error" 
          icon="i-heroicons-arrow-right"
          @click="navigateTo('/tournament/' + tour_id)" 
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { ITable } from '~/models/Table';
import UpdateModal from './UpdateModal .vue';
import AddModal from './AddModal.vue';

const overlay = useOverlay()
const route = useRoute()
const toast = useToast()
const tour_id = route.params.id.toString()

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
  return getTableREQ.data.value?.data || []
})

// Table columns
const cols = [
  { accessorKey: 'name', header: 'الاسم' },
  { accessorKey: 'actions', header: 'الإجراءات' }
]

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
    // Data will be refreshed automatically via refreshNuxtData in the composable
  }
}

// Add table
const addTableREQ = useTournamentTable().addTable()
const openAddModal = () => {
  overlay.create(AddModal, { props: { tourId: tour_id } }).open()
  // Data will be refreshed automatically via refreshNuxtData in the composable
}

// Refresh tables manually if needed

</script>

<style scoped>
/* Add any custom styles if needed */
</style>