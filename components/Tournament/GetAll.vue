<template>
  <UCard>
    <UTable
      :data="rows"
      :columns="cols"
      @select="select"
    >
  
      <template #showInQydha-cell="{ row }">
        <UIcon
          name="healthicons:yes"
          class="text-3xl"
          :class="{
            'text-green-500': row.original.showInQydha,
            'text-black': !row.original.showInQydha,
          }"
        />
      </template>
    </UTable>
    <UPagination
      v-model="page"
      :page-count="10"
      :total="getAllREQ.data.value?.data.totalCount!"
      class="mx-auto mt-auto"
    />

    <template #header>
      <div class="flex flex-col  justify-between  gap-3 w-full ">
       <div class="flex justify-between  ">
         <h1 class="text-2xl">البطولات</h1>
         <UButton
         v-if="
              user?.user.roles.includes('SuperAdmin') ||
              user?.user.roles.includes('StaffAdmin')
            "
           variant="outline"
            icon="ic:baseline-plus"
            to="/tournament/add"
            />
       </div>
          <USelectMenu
            :items="options"
            class="w-[200px] mx-auto"
            multiple
            value-key="value"
            label-key="label"
            v-model="stateQ"
          >

          </USelectMenu>
      </div>
    </template>
  </UCard>

  
</template>

<script lang="ts" setup>
import type { ITournament } from "~/models/tournament";

const stateQ = ref<string[]>(["Upcoming", "Running", "Finished"]);
const ownerQ = ref();
const nameQ = ref();
const QydhaQ = ref(false);

import { useMyAuthStore } from "~/store/Auth";
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);

const options = [
  { label: "القادمة", value: "Upcoming" },
  { label: "الجارية", value: "Running" },
  { label: "المنتهية", value: "Finished" },
];
const tourApi = useTournament();
const getAllREQ = await tourApi.getAllTournament();
await getAllREQ.fetchREQ(1, stateQ.value);
const tournaments = computed(() => {
  if (getAllREQ.status.value == "success" && getAllREQ.data.value) {
    return getAllREQ.data.value?.data.items;
  }
});

const rows = computed(() => {
  let results = tournaments.value ?? [];

  return results;
});
const page = ref(getAllREQ.data.value?.data.currentPage!);
watch(page, () => {
  getAllREQ.fetchREQ(page.value);
});
watch(stateQ, (oldval, newValue) => {
  getAllREQ.fetchREQ(page.value, stateQ.value);
});
const cols = [
  { accessorKey: "name", header: "الاسم" },
  { accessorKey: "city", header: "المدينة" },
  // {key:"owner",label:"المالك"},
  { accessorKey: "showInQydha", header: "قيدها" },
];
import type {  TableRow } from '@nuxt/ui'

const select = (row: TableRow<ITournament>) => {
  navigateTo(`/tournament/${row.original.id}`);
};
</script>

<style></style>
