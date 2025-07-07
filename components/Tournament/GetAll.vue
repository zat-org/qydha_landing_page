<template>
  <UCard>
    <template #header>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">البطولات</h1>
            <!-- <p class="text-gray-500 mt-1">عرض وإدارة جميع البطولات</p> -->
          </div>
          <UButton 
            v-if="isAdmin" 
            variant="solid" 
            color="primary"
            icon="ic:baseline-plus" 
            to="/tournament/add" 
            label="إضافة بطولة جديدة"
            class="px-6"
          />
        </div>

        <div class="flex flex-col md:flex-row gap-4 items-center">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass"
            placeholder="البحث عن بطولة..."
            class="md:w-64"
          />

          <USelectMenu 
            :items="options" 
            class="w-full md:w-auto" 
            multiple 
            value-key="value" 
            label-key="label"
            placeholder="تصفية حسب الحالة"
            v-model="stateQ"
          />
        </div>
      </div>
    </template>

    <div class="  flex flex-col flex-1  ">
      <UTable 
        :data="filteredRows" 
        :columns="cols" 
        @select="select"
        :loading="loading"
        hover
        class="flex-1"
      >
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-12 px-4">
            <UIcon name="i-heroicons-inbox" class="text-4xl text-gray-400 mb-2"/>
            <p class="text-gray-500">لا توجد بطولات متاحة</p>
          </div>
        </template>

        <template #showInQydha-cell="{ row }">
          <UBadge
            :color="row.original.showInQydha ? 'success' : 'neutral'"
            variant="subtle"
            :label="row.original.showInQydha ? 'معروض' : 'مخفي'"
          />
        </template>

        <template #state-cell="{ row }">
          <!-- :color="getStateColor(row.original.state)" -->
          <UBadge
            variant="subtle"
            :label="getStateLabel(row.original.state)"
          />
        </template>
      </UTable>

      <UPagination
      class="mx-auto"
        v-if="totalPages > 1"
        v-model="currentPage"
        :page-count="totalPages"
        :total="totalItems"
        
      />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { ITournament } from "~/models/tournament";

const stateQ = ref<string[]>(["Upcoming", "Running", "Finished"]);
const searchQuery = ref('');
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(5); // Example value
const totalItems = ref(100); // Example value

const ownerQ = ref();
const nameQ = ref();
const QydhaQ = ref(false);

import { useMyAuthStore } from "~/store/Auth";
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);

const isAdmin = computed(() => {
  return user.value?.user.roles.includes('SuperAdmin') ||
    user.value?.user.roles.includes('StaffAdmin')
});

const options = [
  { label: "القادمة", value: "Upcoming" },
  { label: "الجارية", value: "Running" },
  { label: "المنتهية", value: "Finished" },
];

const tourApi = useTournament();

const tournaments = computed(() => {
  return [
    {
      id: '1',
      name: 'بطولة الرياض للهجن',
      city: 'الرياض',
      showInQydha: true,
      state: 'Upcoming'
    },
    {
      id: '2',
      name: 'سباق الهجن الكبير',
      city: 'جدة',
      showInQydha: false,
      state: 'Running'
    },
    {
      id: '3',
      name: 'بطولة المدينة السنوية',
      city: 'المدينة المنورة',
      showInQydha: true,
      state: 'Finished'
    },
    {
      id: '4',
      name: 'سباق الطائف للهجن',
      city: 'الطائف',
      showInQydha: true,
      state: 'Upcoming'
    }
  ];
});

const filteredRows = computed(() => {
  let results = tournaments.value ?? [];
  
  if (searchQuery.value) {
    results = results.filter(tournament => 
      tournament.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      tournament.city.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (stateQ.value.length) {
    results = results.filter(tournament => 
      stateQ.value.includes(tournament.state)
    );
  }

  return results;
});

const cols = computed(() => {
  const result = [
    { 
      accessorKey: "name", 
      header: "الاسم",
      class: "font-medium"
    },
    { 
      accessorKey: "city", 
      header: "المدينة"
    },
  ]
  
  if (isAdmin.value) {
    result.push(
      { 
        accessorKey: "state", 
        header: "الحالة"
      },
      { 
        accessorKey: "showInQydha", 
        header: "قيدها"
      },
    )
  }
  return result;
});

const getStateColor = (state: string) => {
  switch(state) {
    case 'Upcoming': return 'blue';
    case 'Running': return 'green';
    case 'Finished': return 'gray';
    default: return 'gray';
  }
}

const getStateLabel = (state: string) => {
  switch(state) {
    case 'Upcoming': return 'قادمة';
    case 'Running': return 'جارية';
    case 'Finished': return 'منتهية';
    default: return state;
  }
}

import type { TableRow } from '@nuxt/ui'

const select = (row: TableRow<any>) => {
  navigateTo(`/tournament/${row.original.id}`);
};
</script>

<style></style>
