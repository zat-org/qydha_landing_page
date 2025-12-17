<template>
  <UCard>
    <template #header>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold"> طلبات البطولات </h1>
            <!-- <p class="text-gray-500 mt-1">عرض وإدارة جميع البطولات</p> -->
          </div>
          <div class="flex gap-3" v-if="userStore.isOrganizer">
            <UButton variant="outline" color="primary" icon="i-lucide-calculator" to="/tournament/request/calcaulator"
            label="حاسبة البطولة" class="px-6" />

            <UButton variant="outline" color="primary" icon="i-heroicons-information-circle"
              to="/tournament/request/info" label="دليل انشاء البطولة" class="px-6" />

            <UButton variant="solid" color="primary" icon="ic:baseline-plus" to="/tournament/request/add"
              label="إضافة بطولة جديدة" class="px-6" />
          </div>
        </div>

        <div class="flex flex-col md:flex-row gap-4 items-center w-full ">
          <UFormField label="بحث " class="flex-2">
            <UInput v-model="filters.searchToken" placeholder=" العنوان | الوصف ..." />
          </UFormField>
          <UFormField label="الحالة " class="flex-1">
            <USelect :items="stateOptions" class="w-full " value-key="value" label-key="label"
              placeholder="تصفية حسب الحالة" v-model="filters.state" />
          </UFormField>
          <UFormField label="النوع" class="flex-1">
            <USelect :items="typeOptions" class="w-full " value-key="value" label-key="label"
              placeholder="تصفية حسب النوع" v-model="filters.type" />
          </UFormField>
        </div>
      </div>
    </template>

    <!-- if role is Admin  show Admin Table -->
    <!-- compoenet datt form compoennt filter   -->

    <!-- if role is Oranizer  show Oranizer Table  -->


    <div class="  flex flex-col flex-1  ">
      <!-- {{ !data.data }} -->
      <!-- {{ pending }} -->
      <Loading v-if="status == 'pending' && data?.data == undefined" class="mt-10" />
      <component v-else :is="userStore.isStaffAdmin || userStore.isSuperAdmin
        ? TournamentAdminRequestTable
        : TournamentOranizerRequestTable" />

      <UPagination class="mx-auto mt-auto" v-if="data && data.data.totalPages > 1" v-model:page="filters.pageNumber"
        :total="data.data.totalCount" />

    </div>
    <!-- :page-count="data.data.totalPages" -->
  </UCard>
</template>

<script lang="ts" setup>



import { useMyAuthStore } from "~/store/Auth";
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
import TournamentAdminRequestTable from "~/components/Tournament/admin/Request/Table.vue";
import TournamentOranizerRequestTable from "~/components/Tournament/organizer/Request/Table.vue";
import type { GetTournamentRequestParams } from "~/models/tournamentRequest";


const filters = ref<GetTournamentRequestParams>({
  type: undefined,
  searchToken: undefined,
  state: undefined,
  pageNumber: 1,
  pageSize: 9
})

const isAdmin = computed(() => {
  return user.value?.user.roles.includes('SuperAdmin') ||
    user.value?.user.roles.includes('StaffAdmin')
});

const { getTournamnetStateOptions, getTournamentTypeOptions, AdminGetTournamentRequests, OrganizerGetTournamentRequests } = useTournamentRequest();

const apiResult = computed(() => {
  if (userStore.isSuperAdmin || userStore.isStaffAdmin) {
    return AdminGetTournamentRequests
  } else {
    return OrganizerGetTournamentRequests
  }
})

const { data, pending, status } = apiResult.value(filters)

const stateOptions = getTournamnetStateOptions()
const typeOptions = getTournamentTypeOptions()









</script>

<style></style>