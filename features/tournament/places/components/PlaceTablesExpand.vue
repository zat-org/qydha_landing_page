<template>
  <div class="px-1 pb-3">
    <div class="mb-3">
      <UBadge color="neutral" variant="soft" size="xs">
        {{ tables.length }}
      </UBadge>
    </div>

    <div
      v-if="getTableREQ.pending.value"
      class="flex items-center justify-center gap-2 py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="size-6 animate-spin text-primary"
      />
      <p class="text-sm text-gray-500">جاري تحميل الطاولات...</p>
    </div>

    <UAlert
      v-else-if="getTableREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="تعذّر تحميل الطاولات"
      :description="getTableREQ.error.value?.message || 'حدث خطأ أثناء التحميل'"
    />

    <div
      v-else
      class="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    >
      <UTable :data="tables" :columns="cols" class="min-w-[320px]">
        <template #empty>
          <p class="py-6 text-center text-sm text-gray-500">لا توجد طاولات</p>
        </template>
        <template #connectedGamesCount-cell="{ row }">
          {{ row.original.connectedGamesCount ?? 0 }}
        </template>
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  tourId: string;
  placeId: string;
}>();

const getTableREQ = useTournamentTable().getTable(props.tourId, props.placeId);
const tables = computed(() => getTableREQ.data.value ?? []);

const cols = [
  { accessorKey: "name", header: "اسم الطاولة" },
  { accessorKey: "connectedGamesCount", header: "مباريات متصلة" },
];
</script>
