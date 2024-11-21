<template>
  <UCard
    :ui="{
      base: 'flex flex-col  h-full  ',
      body: { base: 'flex flex-col  grow', padding: 'sm:p-2 p-2' },
    }"
  >
    <UTable
      :rows="rows"
      :columns="cols"
      @select="select"
      :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }"
    >
      <!-- <template #owner-data="{ row }">
  <p>{{ row.owner }}</p>
      </template> -->
      <template #showInQydha-data="{ row }">
        <UIcon
          name="healthicons:yes"
          class="text-3xl"
          :class="{
            'text-green-500': row.showInQydha,
            'text-black': !row.showInQydha,
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
      <div class="flex justify-between items-center">
        <h1 class="text-2xl">البطولات</h1>
        <USelectMenu
          :options="options"
          value-attribute="value"
          option-attribute="label"
          class="w-[200px]"
          multiple
          v-model="stateQ"
        >
          <template #label>
            <span v-if="stateQ.length" class="truncate">{{
              options
                .filter((opt) => stateQ.includes(opt.value))
                .map((opt) => opt.label)
                .join(", ")
            }}</span>
            <span v-else>Select state</span>
          </template>
        </USelectMenu>
        <UButton
          v-if="
            user?.user.roles.includes('SuperAdmin') ||
            user?.user.roles.includes('StaffAdmin')
          "
          label="بطولة"
          icon="ic:baseline-plus"
          to="/tournament/add"
        />
      </div>
    </template>
  </UCard>

  <div class="flex flex-col grow">
    <!-- <div class="flex items-center gap-2 ">
 <UFormGroup label="الاسم" size="xs">

        <UInput v-model="nameQ" />
      </UFormGroup> -->
    <!-- <UFormGroup label="المالك" size="xs">
        <UInput v-model="ownerQ" />
      </UFormGroup>
      <UFormGroup label="قيدها" size="xs">
        <UToggle v-model="QydhaQ" />
      </UFormGroup>
    </div> -->
  </div>
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
  { value: "Upcoming", label: "القادمة" },
  { value: "Running", label: "الجارية" },
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
  { key: "name", label: "الاسم" },
  { key: "city", label: "المدينة" },
  // {key:"owner",label:"المالك"},
  { key: "showInQydha", label: "قيدها" },
];

const select = (row: ITournament) => {
  return navigateTo(`/tournament/${row.id}`);
};
</script>

<style></style>
