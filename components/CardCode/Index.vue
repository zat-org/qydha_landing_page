<template>
  <div class="bg-[var(--color-background)] dark:bg-[var(--color-background-dark)] rounded-lg shadow-md p-4 rtl flex flex-col h-full ">
    <div class="flex gap-5 justify-between items-center mb-4">
      <UInput
        class="grow"
        v-model="groupNameFilter"
        placeholder="البحث باسم المجموعة"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="sm"
        :ui="{
          base: 'bg-[var(--color-input-bg)] dark:bg-[var(--color-input-bg-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)]',
          // icon: 'text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]',
          input: 'placeholder-[var(--color-text-secondary)] dark:placeholder-[var(--color-text-secondary-dark)]'
        }"
      />
    </div>

    <UTable
      :key="tableKey"
      :columns="columns"
      :rows="filteredItems"
      :loading="pending"
      :ui="{
        td: { padding: 'py-1' },
        th: { 
          base: 'bg-[var(--color-table-header)] dark:bg-[var(--color-table-header-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)]',
          padding: 'py-2 px-4'
        },
        tr: {
          base: 'hover:bg-[var(--color-hover)] dark:hover:bg-[var(--color-hover-dark)]',
          td: 'text-[var(--color-text)] dark:text-[var(--color-text-dark)]'
        }
      }"
    >
      <template #action-data="{ row }">
        <UButtonGroup size="sm">
          <UButton
            color="green"
            icon="i-heroicons-plus"
            variant="soft"
            @click="handleAdd(row)"
            :ui="{
              base: 'hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20'
            }"
          />
          <UButton
            v-if="row.canUpdate"
            color="yellow"
            icon="i-heroicons-pencil"
            variant="soft"
            @click="handleUpdate(row)"
            :ui="{
              base: 'hover:bg-[var(--color-warning-light)]/10 dark:hover:bg-[var(--color-warning)]/20'
            }"
          />
          <UButton
            v-if="row.canDelete"
            color="red"
            icon="i-heroicons-trash"
            variant="soft"
            @click="handleDelete(row)"
            :ui="{
              base: 'hover:bg-[var(--color-danger-light)]/10 dark:hover:bg-[var(--color-danger)]/20'
            }"
          />
        </UButtonGroup>
      </template>
    </UTable>

    <div class="mt-4 flex justify-center" v-if="data?.data.totalPages! > 1">
      <UPagination
        v-model="currentPage"
        :total="data?.data.totalCount!"
        :page-size="data?.data.pageSize"
        :total-pages="data?.data.totalPages"
        :show-prev="data?.data.hasPrevious"
        :show-next="data?.data.hasNext"
        :ui="{
          // wrapper: 'bg-[var(--color-background)] dark:bg-[var(--color-background-dark)]',
          button: {
            base: 'text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:bg-[var(--color-hover)] dark:hover:bg-[var(--color-hover-dark)]',
            active: 'bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-white'
          }
        }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CardGroupI } from "~/models/CardCode";
import UpdateModal from "./UpdateModal.vue";
import CreateModal from "./CreateModal.vue";
import AddModal from "./AddModal.vue";

const groupNameFilter = ref("");
const showUsedOnly = ref(false);
const modal = useModal();
const { getCardCodeGroups, deleteCardCodeGroup } = useCardCode();
const { data, pending, error, refresh, currentPage } =
  await getCardCodeGroups();

const columns = [
  { key: "groupCode", label: "اسم المجموعة" },
  { key: "totalCount", label: "العدد الكلي" },
  { key: "usedCount", label: "المستخدم" },
  { key: "notUsedCount", label: "المتبقي" },
  { key: "numberOfDays", label: "الايام" },
  { key: "action", label: "#" },
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
  if (selectedGroup) modal.open(AddModal, { cardGroup: selectedGroup });
};

const handleUpdate = (row: CardGroupI) => {
  let selectedGroup = filteredItems.value.find((g) => {
    return g.groupCode == row.groupCode;
  });
  if (selectedGroup) modal.open(UpdateModal, { cardGroup: selectedGroup });
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
