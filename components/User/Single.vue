<template>
  <UCard>

    <div class="flex flex-col gap-6">
      <!-- Loading & Error States -->
      <div v-if="isLoading" class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4 p-4">
          <USkeleton class="rounded-full" :ui="{ rounded: 'rounded-full' }" style="width:150px;height:150px" />
          <USkeleton class="h-6 w-48" />
          <USkeleton class="h-4 w-32" />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <USkeleton class="h-24" />
          <USkeleton class="h-24" />
          <USkeleton class="h-24" />
        </div>
      </div>

      <UAlert v-else-if="isError" color="error" variant="soft" title="حدث خطأ"
        description="تعذر تحميل بيانات المستخدم. حاول لاحقا." />

      <!-- Profile Header + Summary -->
      <div v-else class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-4 p-4">
          <div class="relative w-[150px] h-[150px] rounded-full overflow-hidden shadow-lg">
            <img v-if="userData?.user.avatarUrl" class="w-full h-full object-cover" :src="userData?.user.avatarUrl" />
            <UIcon v-else name="i-heroicons-user-circle" class="w-full h-full text-primary-500 dark:text-primary-400" />
          </div>

          <div class="text-center">
            <h2 class="text-2xl font-bold mb-2">{{ userData?.user.username }}</h2>
            <div class="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
              <UIcon name="i-heroicons-phone" class="text-xl" />
              <span dir="ltr">{{ userData?.user.phone }}</span>
              <UTooltip text="نسخ رقم الجوال">
                <UButton color="neutral" variant="ghost" icon="i-heroicons-clipboard"
                  @click="copyToClipboard(userData?.user.phone || '')" />
              </UTooltip>
            </div>
            <div class="flex items-center justify-center gap-2 text-gray-500">
              <span class="text-xs">ID: {{ userData?.user.id }}</span>
              <UTooltip text="نسخ المعرف">
                <UButton color="neutral" variant="ghost" size="xs" icon="i-heroicons-clipboard"
                  @click="copyToClipboard(userData?.user.id || '')" />
              </UTooltip>
            </div>
            <!-- Created and Last Login -->
            <div class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
              <div class="flex items-center justify-center sm:justify-end gap-2">
                <UIcon name="i-heroicons-calendar" class="text-base" />
                <span>تاريخ الإنشاء: {{ formattedCreatedOn }}</span>
              </div>
              <div class="flex items-center justify-center sm:justify-start gap-2">
                <UIcon name="i-heroicons-clock" class="text-base" />
                <span>آخر تسجيل دخول: {{ formattedLastLogin }}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
            <USelect :popper="{ placement: 'bottom' }" value-attribute="value" option-attribute="value"
              v-if="canEditRoles" v-model="roles" multiple :items="rolesOption" class="w-full"
              :disabled="rolesUpdating" />
            <div v-else class="flex flex-wrap justify-center gap-2">
              <UBadge v-for="role in userData?.user.roles" :key="role" :color="getRoleColor(role)" variant="soft">
                {{ role }}
              </UBadge>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->

      </div>

      <!-- Tabs Section -->
      <div v-if="!isLoading && !isError" class="w-full">
        <UTabs :items="tabsItems" dir="rtl" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <template #promo>
            <div class="overflow-x-auto">
              <template v-if="promoCount > 0">
                <UTable ref="poromoTable" v-model:pagination="promoPagination" :pagination-options="{
                  getPaginationRowModel: getPaginationRowModel()
                }" :data="userData?.promoCodes" :columns="promocols" hover />
                <UPagination :default-page="(promoTable?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                  :items-per-page="promoTable?.tableApi?.getState().pagination.pageSize"
                  :total="promoTable?.tableApi?.getFilteredRowModel().rows.length"
                  @update:page="(p) => promoTable?.tableApi?.setPageIndex(p - 1)" />
              </template>
              <div v-else class="flex items-center justify-center h-24 text-gray-500">لا توجد أكواد</div>
            </div>
          </template>
          <template #purchase>
            <div class="overflow-x-auto">
              <template v-if="purchaseCount > 0">
                <UTable ref="purchaseTable" :pagination-options="{
                  getPaginationRowModel: getPaginationRowModel()
                }" v-model:pagination="purchasePagination" :data="userData?.purchases" :columns="purchaseCols" hover />
                <UPagination :default-page="(purchaseTable?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                  :items-per-page="purchaseTable?.tableApi?.getState().pagination.pageSize"
                  :total="purchaseTable?.tableApi?.getFilteredRowModel().rows.length"
                  @update:page="(p) => purchaseTable?.tableApi?.setPageIndex(p - 1)" />
              </template>
              <div v-else class="flex items-center justify-center h-24 text-gray-500">لا توجد مشتريات</div>
            </div>
          </template>
          <template #influncer>
            <div class="overflow-x-auto">
              <template v-if="influncerCount > 0">
                <UTable ref="influncersTable" v-model:pagination="influncerPagination" :data="userData?.influencerCodes"
                  :columns="influncerCols" hover>
                  <template #category-cell="{ row }">
                    <p>{{ row.original.categoryName }}</p>
                  </template>
                </UTable>
                <UPagination :default-page="(influncersTable?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                  :items-per-page="influncersTable?.tableApi?.getState().pagination.pageSize"
                  :total="influncersTable?.tableApi?.getFilteredRowModel().rows.length"
                  @update:page="(p) => influncersTable?.tableApi?.setPageIndex(p - 1)" />
              </template>
              <div v-else class="flex items-center justify-center h-24 text-gray-500">لا توجد أكواد للمؤثرين</div>
            </div>
          </template>
        </UTabs>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center p-4">
        <UButton color="error" variant="soft" icon="i-heroicons-arrow-left" @click="router.back()">
          عودة
        </UButton>

        <!-- Organizer button - visible for organizers, admins, or staff -->
        <UButton v-if="showOrganizerButton" color="primary" variant="outline" icon="i-heroicons-building-office"
          :to="`/user/${userData?.user.id}/organizer`">
          ملف المنظم
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';
import { getPaginationRowModel } from '@tanstack/vue-table'

const router = useRouter()
const props = defineProps<{ id: string }>()
const userApi = useUsers()
const getREQ = await userApi.getSingleUser()
const updateREQ = await userApi.updateUser()
const toast = useToast()
const userStore = useMyAuthStore()
const { hasRole } = usePermissions()
const route = useRoute();
if (route.path == "/me") {
  await getREQ.fetchREQ('me')
} else {

  await getREQ.fetchREQ(props.id)
}

if (getREQ.status.value == "error") {
  navigateTo('/user')
}

const userData = computed(() => {

  return getREQ.data.value?.data
})

const isLoading = computed(() => getREQ.status.value === 'pending' || getREQ.status.value === 'idle')
const isError = computed(() => getREQ.status.value === 'error')

const promoCount = computed(() => userData.value?.promoCodes?.length || 0)
const purchaseCount = computed(() => userData.value?.purchases?.length || 0)
const influncerCount = computed(() => userData.value?.influencerCodes?.length || 0)

const formatDateTime = (iso?: string) => {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
const formattedCreatedOn = computed(() => formatDateTime(userData.value?.user.createdOn))
const formattedLastLogin = computed(() => formatDateTime(userData.value?.user.lastLogin))

// Show organizer button if user is admin, staff, or if viewing own profile and has organized tournaments
const showOrganizerButton = computed(() => {
  // Show for admins and staff
  if (hasRole(['SuperAdmin', 'StaffAdmin'])) {
    return true
  }

  // Show if it's the user's own profile (they can view their organizer info)
  if (userStore.user?.user.id === props.id) {
    return true
  }

  return false
})

const roles = ref<string[]>(userData.value?.user.roles!)

const rolesUpdating = computed(() => updateREQ.status.value === 'pending')
const canEditRoles = computed(() => userStore.user?.user.roles.includes('SuperAdmin') || userStore.user?.user.roles.includes('StaffAdmin'))

const rolesOption = [
  { label: 'ادمن', value: 'SuperAdmin', disabled: true },
  { label: 'استف', value: 'StaffAdmin', disabled: false },
  { label: 'استريمر', value: 'Streamer', disabled: false },
  { label: 'مستخدم ', value: 'User', disabled: true },
]

const getRoleColor = (role: string): 'error' | 'success' | 'primary' | 'secondary' | 'warning' | 'neutral' => {
  switch (role) {
    case 'SuperAdmin': return 'primary'
    case 'StaffAdmin': return 'success'
    case 'Streamer': return 'warning'
    default: return 'neutral'
  }
}

watch(roles, async (newValue, oldValue) => {
  await updateREQ.fetchREQ(userData.value?.user.id!, newValue)
  if (updateREQ.status.value == "success") {
    toast.add({
      title: "تم تحديث الصلاحيات بنجاح",
      color: 'success'
    })
  }
})

const tabsItems = computed(() => [
  { slot: 'promo', label: `الاكواد (${promoCount.value})` },
  { slot: 'purchase', label: `المشتريات (${purchaseCount.value})` },
  { slot: 'influncer', label: `اكواد المؤثريين (${influncerCount.value})` },
])
const promoTable = useTemplateRef('poromoTable')
const promocols = [
  { accessorKey: 'code', header: 'الاسم ' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  {
    accessorKey: 'usedAt', header: 'استخدم في ',
    cell: ({ row }: { row: any }) => {
      return row.original!.usedAt ? new Date(row.original.usedAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'لم يستخدم'
    }
  },
]
const promoPagination = ref({
  pageIndex: 0,
  pageSize: 5
})


const purchaseTable = useTemplateRef('purchaseTable')

const purchaseCols = [
  { accessorKey: 'productSku', header: 'النوع' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  {
    accessorKey: 'purchaseDate', header: 'تاريخ الشراء',
    cell: ({ row }: { row: any }) => {
      return row.original!.purchaseDate ? new Date(row.original.purchaseDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'numeric', year: 'numeric' }) : 'لم يشتري'
    }
  },

]
const purchasePagination = ref({
  pageIndex: 0,
  pageSize: 5
})

const influncersTable = useTemplateRef('influncersTable')

const influncerCols = [
  { accessorKey: 'influencerCodeName', header: 'الكود' },
  { accessorKey: 'numberOfDays', header: 'عدد الايام' },
  { accessorKey: 'category.name', header: ' النوع' },
  {
    accessorKey: 'usedAt', header: 'استخدم في',
    cell: ({ row }: { row: any }) => {
      return row.original!.usedAt ? new Date(row.original.usedAt).toLocaleDateString() : 'لم يستخدم'
    }
  },

]

const influncerPagination = ref({
  pageIndex: 0,
  pageSize: 5
})
const copyToClipboard = async (text: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title: 'تم النسخ', color: 'success' })
  } catch (e) {
    toast.add({ title: 'تعذر النسخ', color: 'error' })
  }
}
</script>

<style></style>