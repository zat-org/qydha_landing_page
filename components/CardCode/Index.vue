<template>
      <UInput
        class="grow"
        v-model="groupNameFilter"
        placeholder="البحث باسم المجموعة"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="sm"
      />

    <UTable
      :key="tableKey"
      :data="filteredItems"
      :loading="pending"
      :columns="cols"
    >
      <template #action-cell="{ row }">
        <UButtonGroup size="sm">
          <UButton
            color="primary"
            icon="i-heroicons-plus"
            variant="soft"
            @click="handleAdd(row.original)"
            :ui="{
              base: 'hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20'
            }"
          />
          <UButton
            v-if="row.original.canUpdate"
            color="primary"
            icon="i-heroicons-pencil"
            variant="soft"
            @click="handleUpdate(row.original)"
            :ui="{
              base: 'hover:bg-[var(--color-warning-light)]/10 dark:hover:bg-[var(--color-warning)]/20'
            }"
          />
          <UButton
            v-if="row.original.canDelete"
            color="error"
            icon="i-heroicons-trash"
            variant="soft"
            @click="handleDelete(row.original)"
            :ui="{
              base: 'hover:bg-[var(--color-danger-light)]/10 dark:hover:bg-[var(--color-danger)]/20'
            }"
          />
        </UButtonGroup>
      </template>
    </UTable>

    <div class="mt-4 flex justify-center" v-if="data?.data.totalPages! > 1">
      <UPagination
      class="rtl"
        v-model="currentPage"
        :total="data?.data.totalCount!"
        :page-size="data?.data.pageSize"
        :total-pages="data?.data.totalPages"
        :show-prev="data?.data.hasPrevious"
        :show-next="data?.data.hasNext"
      />
    </div>
</template>

<script lang="ts" setup>
import type { CardGroupI } from "~/models/CardCode";
import UpdateModal from "./UpdateModal.vue";
import AddModal from "./AddModal.vue";

const groupNameFilter = ref("");
const showUsedOnly = ref(false);
const overlay = useOverlay();
const { getCardCodeGroups, deleteCardCodeGroup } = useCardCode();
const { data, pending, error, refresh, currentPage } =
  await getCardCodeGroups();

const cols = [
  { accessorKey: "groupCode", header: "اسم المجموعة" },
  { accessorKey: "totalCount", header: "العدد الكلي" },
  { accessorKey: "usedCount", header: "المستخدم" },
  { accessorKey: "notUsedCount", header: "المتبقي" },
  { accessorKey: "numberOfDays", header: "الايام" },
  { accessorKey: "action", header: "#" },
];

const tableKey = ref(`table-${Date.now()}`)

const filteredItems = computed(() => {
  if (!data.value?.data.items) return [];
  const items = data.value.data.items;
  
  if (!groupNameFilter.value.trim()) {
    return items;
  }

  return items.filter((item) => {
    const searchTerm = groupNameFilter.value.toLowerCase().trim();
    const groupCode = item.groupCode.toLowerCase();
    return groupCode.includes(searchTerm);
  });
});

const handleAdd = (row: CardGroupI) => {
  let selectedGroup = filteredItems.value.find((g) => {
    return g.groupCode == row.groupCode;
  });
  if (selectedGroup) overlay.create(AddModal, { props: { cardGroup: selectedGroup } }).open();
};

const handleUpdate = (row: CardGroupI) => {
  let selectedGroup = filteredItems.value.find((g) => {
    return g.groupCode == row.groupCode;
  });
  if (selectedGroup) overlay.create(UpdateModal, {props:{ cardGroup: selectedGroup }}).open();
};

const deleteREQ = await deleteCardCodeGroup();
const handleDelete = async (row: CardGroupI) => {
  await deleteREQ.fetchREQ(row.groupCode);
};

watch(() => data.value?.data.items, () => {
  tableKey.value = `table-${Date.now()}`
}, { deep: true })
</script>

<style scoped>
.rtl {
  direction: rtl;
}
</style>
