<template>


      <UTable :data="codes" :columns="cols">
        <template #status-cell="{ row }">
          <UBadge variant="outline" :color="new Date(row.original.expireAt) > new Date() ? 'success' : 'error'"
            :label="new Date(row.original.expireAt) > new Date() ? 'فعال' : 'منتهي'" />
        </template>
      </UTable>
    <UPagination class="mt-auto mx-auto p-4 rtl" v-model="page" :page-count="10" :total="total"  />

</template>

<script lang="ts" setup async>

const getcodesREQ = await useInfluncerCode().getinfluncerCodes();
await getcodesREQ.fetchREQ();

const codes = computed(() => getcodesREQ.data.value?.data.items);
const page = ref(getcodesREQ.data.value?.data.currentPage!);
const total = ref(getcodesREQ.data.value?.data.totalCount!);

watch(page, async (newValue) => {
  await getcodesREQ.fetchREQ(newValue);
});

const cols = [
  { accessorKey: "code", header: "الكود" },
  { accessorKey: "numberOfDays", header: "عدد الأيام" },
  { accessorKey: "usedCount", header: "عدد مرات الاستخدام" },
  { accessorKey: "status", header: "الحالة" },
  { accessorKey: "categoryName", header: "الفئة" },
];
</script>

<style>
.rtl{
  direction: rtl;
}
</style>
