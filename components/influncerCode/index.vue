<template>

  <div class="h-full flex flex-col">
    <div class="flex-1 overflow-auto">
      <UTable :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }" :rows="codes" :columns="cols">
        <template #status-data="{ row }">
          <UBadge variant="outline" :color="new Date(row.expireAt) > new Date() ? 'green' : 'red'"
            :label="new Date(row.expireAt) > new Date() ? 'فعال' : 'منتهي'" />
        </template>
      </UTable>
    </div>
    <UPagination class="mt-auto mx-auto p-4" v-model="page" :page-count="10" :total="total" />
  </div>

</template>

<script lang="ts" setup async>
import AddCodeModal from "./addCodeModal.vue";
import AddCatModal from "./Cat/addCatModal.vue";
import AddUserCodeModal from "../PromoCode/AddModal.vue";
import CreateModal from "../CardCode/CreateModal.vue";
import type { _height } from "#tailwind-config/theme";







const getcodesREQ = await useInfluncerCode().getinfluncerCodes();
await getcodesREQ.fetchREQ();

const codes = computed(() => getcodesREQ.data.value?.data.items);
const page = ref(getcodesREQ.data.value?.data.currentPage!);
const total = ref(getcodesREQ.data.value?.data.totalCount!);

watch(page, async (newValue) => {
  await getcodesREQ.fetchREQ(newValue);
});

const cols = [
  { key: "code", label: "الكود" },
  { key: "numberOfDays", label: "عدد الأيام" },
  { key: "usedCount", label: "عدد مرات الاستخدام" },
  { key: "status", label: "الحالة" },
  { key: "categoryName", label: "الفئة" },
];
</script>

<style>
.rtl {
  direction: rtl;
}
</style>
