<template>
  <UCard>
    <template #header>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">البطولات</h1>
            <!-- <p class="text-gray-500 mt-1">عرض وإدارة جميع البطولات</p> -->
          </div>
          <!-- <div class="flex gap-3">
            <UButton v-if="isAdmin" variant="outline" color="primary" icon="i-heroicons-information-circle" to="/tournament/request/info"
              label="دليل انشاء البطولة" class="px-6" />
            <UButton v-if="isAdmin" variant="solid" color="primary" icon="ic:baseline-plus" to="/tournament/request/add"
              label="إضافة بطولة جديدة" class="px-6" />
          </div> -->
        </div>
        <div class="flex flex-col md:flex-row gap-4 items-center w-full ">
          <UFormField label="الحالة " class="flex-1">
            <USelect :items="stateOptions" class="w-full " value-key="value" label-key="label"
              placeholder="تصفية حسب الحالة" multiple v-model="filters.States" />
          </UFormField>
          <UFormField label="ترتيب بتاريخ  البطولة " class="flex-1">
            <USelect :items="OrderStartAtOptions" class="w-full " value-key="value" label-key="label"
              placeholder="ترتيب بتاريخ  البطولة " v-model="filters.OrderByStartAtDirection" />
          </UFormField>
        </div>
      </div>
    </template>

    <div class="  flex flex-col flex-1  ">
      <Loading v-if="getReq.status.value == 'pending'" />
      
      <div v-else-if="getReq.status.value == 'success' && (!data || data.length === 0)" class="flex flex-col items-center justify-center py-12 px-4 min-h-[400px]">
        <UIcon name="i-heroicons-inbox" class="text-6xl text-gray-400 mb-4" />
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">لا توجد بطولات متاحة</h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">ابدأ بإنشاء بطولة جديدة</p>
        <UButton 
          to="/tournament/request/add" 
          icon="i-heroicons-plus" 
          size="lg" 
          color="primary"
          class="px-6"
        >
          إضافة طلب بطولة جديدة
        </UButton>
      </div>
      
      <UTable v-else-if="getReq.status.value == 'success' && data && data.length > 0" :data="data" class="flex-1" :columns="cols"   @select="onSelect">
        <template #title-cell="{ row }">
          <div class="flex gap-2 items-center">
            <ClientOnly>
              <UAvatar size="2xl" :src="row.original.logoUrl" :text="row.original.title" />
            </ClientOnly>
            <span>{{ row.original.title }} </span>
          </div>
        </template>
        <template #startAt-cell="{ row }">
          <span>
            {{ formatDate(row.original.startAt) }}
          </span>
          :
          <span>
            {{ formatDate(row.original.endAt) }}
          </span>
        </template>
        <template #contactPhone-cell="{ row }">
          <span dir="ltr">
            {{ row.original.contactPhone }}
          </span>
        </template>
        <template #state-cell="{ row }">
          <UBadge :label="getState(row.original.state).label" :color="getState(row.original.state).color"
            variant="outline" size="xl" />
        </template>
        <template #showInQydha-cell="{ row }">
          <UBadge :label="row.original.showInQydha ? 'ظاهر' : 'غير ظاهر'"
            :color="row.original.showInQydha ? 'success' : 'neutral'" variant="outline" size="xl" />
        </template>
        <template #actions-cell="{ row }">
          <UButtonGroup>
            <!-- view single -->
            <!-- <UButton icon="i-lucide-eye" :to="`/tournament/${row.original.id}`" variant="outline"/> -->
            <!-- edit -->
            <UButton   v-if="isAdmin"  icon="i-lucide-edit-2" :to="`/tournament/${row.original.id}/edit`"  variant="outline"/>
            <!-- <UDropdownMenu 
            v-if="userStore.isOrganizer" 
            :items="[{label:'طلبات الانضمام',to:`/tournament/${row.original.id}/Joinrequest`}]"  >
              <UButton icon="i-lucide-menu"  variant="outline" />
            </UDropdownMenu> -->

          </UButtonGroup>
        </template>
      </UTable>
      <UPagination v-if="getReq.status.value == 'success' && data && data.length > 0" v-model:page="filters.PageNumber" :page-count="getReq.data.value?.data.totalPages" :total="getReq.data.value?.data.totalCount" class="mx-auto" />
      <!-- <UTable :data="filteredRows" :columns="cols"  :loading="loading" hover class="flex-1">
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-12 px-4">
            <UIcon name="i-heroicons-inbox" class="text-4xl text-gray-400 mb-2" />
            <p class="text-gray-500">لا توجد بطولات متاحة</p>
          </div>
        </template>

        <template #showInQydha-cell="{ row }">
          <UBadge :color="row.original.showInQydha ? 'success' : 'neutral'" variant="subtle"
            :label="row.original.showInQydha ? 'معروض' : 'مخفي'" />
        </template>

        <template #links-cell="{ row }">
         <UButtonGroup>
          <UDropdownMenu :items="[
            {
              label: 'الخريطة',
              icon: 'i-heroicons-chart-bar',
              to: `/tournament/${row.original.id}/bracket`
            },
            {
              label: 'المسؤولين',
              icon: 'i-heroicons-user-group', 
              to: `/tournament/${row.original.id}/moderator`
            },
            {
              label: 'الطلبات',
              icon: 'i-heroicons-inbox-stack',
              to: `/tournament/${row.original.id}/request`
            },
            {
              label: 'اللاعبين',
              icon: 'i-heroicons-users',
              to: `/tournament/${row.original.id}/player`
            },
            {
              label: 'الطاولات', 
              icon: 'i-heroicons-table-cells',
              to: `/tournament/${row.original.id}/table`
            },
            {
              label: 'المجموعات',
              icon: 'i-heroicons-user-circle',
              to: `/tournament/${row.original.id}/group`
            }
          ]">
            <UButton color="primary" variant="ghost">
              <UIcon name="i-heroicons-ellipsis-vertical" />
              إدارة البطولة
            </UButton>
          </UDropdownMenu>

         </UButtonGroup>
      
        </template>
      </UTable> -->

      <!-- <UPagination class="mx-auto" v-if="totalPages > 1" v-model="currentPage" :page-count="totalPages"
        :total="totalItems" /> -->
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { TableRow } from "@nuxt/ui";
import { OrderByStartAtDirection, TournamentState, type GetTournamentParams, type Tournament } from "~/models/tournament";
const { getAllTournament, getTournamnetStateOptions, getTournamnetOrderStartAtOptions } = useTournament();
import { useMyAuthStore } from "~/store/Auth";
const toast = useToast()

const filters = ref<GetTournamentParams>({
  PageNumber: 1,
  PageSize: 9,
  OrderByStartAtDirection: OrderByStartAtDirection.ASC
})

const dropdownItems= [
  {}
]

function onSelect(row: TableRow<Tournament>, e?: Event) {
  /* If you decide to also select the column you can do this  */
  // row.toggleSelected(!row.getIsSelected())

  // console.log(e)
  navigateTo(`/tournament/${row.original.id}`)
}

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);

const isAdmin = computed(() => {
  return user.value?.user.roles.includes('SuperAdmin') ||
    user.value?.user.roles.includes('StaffAdmin')
});




const getReq = await getAllTournament(filters)
const stateOptions = getTournamnetStateOptions()
const OrderStartAtOptions = getTournamnetOrderStartAtOptions()
const data = computed(() => {

  if (unref(getReq.status) == 'success' && getReq.data.value) {
    return getReq.data.value.data.items
  }
  if (unref(getReq.status) == 'error') {
    toast.add({ title: " حدث خطاء في جلب بينات البطولات ", color: 'error' })
    return []
  }

})
const cols = [
  {
    accessorKey: "title",
    header: "الاسم"
  },
  {
    accessorKey: "startAt",
    header: "التاريخ"
  },  
  {
    accessorKey: "state",
    header: "الحالة "
  },
  {
    accessorKey: "showInQydha",
    header: "الظهور علي قيدها  "
  }
  , {
    id: 'actions',
    header: "#"
  }

]
const getState = (state: TournamentState): any => {
  return stateOptions.find(op => op.value == state)
}

</script>

<style></style>
