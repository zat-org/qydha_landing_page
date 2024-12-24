<template>
  <div class="bg-white rounded-lg shadow-md p-4 rtl flex flex-col h-full">
    <div class="flex gap-5 justify-between items-center mb-4">
      <UInput
        class="grow"
        v-model="groupNameFilter"
        placeholder="البحث باسم المجموعة"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="sm"
      />
      <!--     
    <UToggle v-model="showUsedOnly" size="lg">
      <template #label>
        <span class="mr-2">إظهار المستخدمة فقط</span>
      </template>
    </UToggle> -->
    </div>

    <UTable
    :key="tableKey"
      :columns="columns"
      :rows="filteredItems"
      :loading="pending"
      :ui="{ td: { padding: 'py-1' } }"
    >
    <template #action-data="{ row }">
  <UButtonGroup size="sm">
    <UButton
      color="green"
      icon="i-heroicons-plus"
      variant="soft"
      @click="handleAdd(row)"
    />
    <UButton
      v-if="row.canUpdate"
      color="yellow"
      icon="i-heroicons-pencil"
      variant="soft"
      @click="handleUpdate(row)"
    />
    <UButton
      v-if="row.canDelete"
      color="red"
      icon="i-heroicons-trash"
      variant="soft"
      @click="handleDelete(row)"
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
// Add this before the columns definition
const tableKey =  ref(`table-${Date.now()}`)

// Replace the existing filteredItems computed property with this optimized version
const filteredItems = computed(() => {
  if (!data.value?.data.items) return [];

  // Create a stable reference to the original items
  const items = data.value.data.items;
  
  // Return original array if no filter
  if (!groupNameFilter.value.trim()) {
    return items;
  }

  // Apply filter with memoization
  return items.filter((item) => {
    const searchTerm = groupNameFilter.value.toLowerCase().trim();
    const groupCode = item.groupCode.toLowerCase();
    return groupCode.includes(searchTerm);
  });
});


const handleAdd = (row: CardGroupI) => {
  // modal.open(CreateModal)
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
  // Update logic
};
const deleteREQ = await deleteCardCodeGroup();
const handleDelete = async (row: CardGroupI) => {
  // console.log(row)
  await deleteREQ.fetchREQ(row.groupCode);
  // Delete logic
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
