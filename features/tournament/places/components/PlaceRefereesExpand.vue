<template>
  <div class="px-1 pb-3">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <UBadge color="neutral" variant="soft" size="xs">
        {{ referees.length }}
      </UBadge>
      <UButton
        v-if="canMutate"
        label="اضافة حكم"
        size="sm"
        icon="material-symbols:add"
        @click="isDrawerOpen = true"
      />
    </div>

    <div
      v-if="getRefereesREQ.pending.value"
      class="flex items-center justify-center gap-2 py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="size-6 animate-spin text-primary"
      />
      <p class="text-sm text-gray-500">جاري تحميل الحكام...</p>
    </div>

    <UAlert
      v-else-if="getRefereesREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="تعذّر تحميل الحكام"
      :description="
        getRefereesREQ.error.value?.message || 'حدث خطأ أثناء التحميل'
      "
    />

    <div
      v-else
      class="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    >
      <UTable :data="referees" :columns="cols" class="min-w-[320px]">
        <template #empty>
          <p class="py-6 text-center text-sm text-gray-500">لا يوجد حكام</p>
        </template>
        <template #connectedGamesCount-cell="{ row }">
          {{ row.original.connectedGamesCount ?? 0 }}
        </template>
        <template #actions-cell="{ row }">
          <UButton
            v-if="canMutate && row.original.connectedGamesCount === 0"
            icon="material-symbols:delete"
            color="error"
            variant="soft"
            size="sm"
            :loading="
              deleteREQ.status.value === 'pending' &&
              deletingId === row.original.id
            "
            @click="deleteReferee(row.original)"
          />
        </template>
      </UTable>
    </div>

    <UDrawer
      v-model:open="isDrawerOpen"
      title="اضافة حكم"
      description="اضافة حكم جديد لهذا المكان"
      direction="left"
    >
      <template #content>
        <div class="min-w-[600px]">
          <RefereeAddForm
            :tour-id="tourId"
            :place-id="placeId"
            @close="isDrawerOpen = false"
          />
        </div>
      </template>
    </UDrawer>
  </div>
</template>

<script lang="ts" setup>
import type { IRefre } from "~/features/tournament/models/Refre";
import RefereeAddForm from "~/features/tournament/referees/components/AddForm.vue";

const props = defineProps<{
  tourId: string;
  placeId: string;
  canMutate?: boolean;
}>();

const toast = useToast();
const isDrawerOpen = ref(false);
const deletingId = ref<string | null>(null);

const getRefereesREQ = useTournamentRefree().getTournamentRefree(
  props.tourId,
  props.placeId,
);
const deleteREQ = useTournamentRefree().deleteTourRefree();
const referees = computed(() => getRefereesREQ.data.value ?? []);

const cols = [
  { accessorKey: "username", header: "الاسم" },
  { accessorKey: "phone", header: "الهاتف" },
  { accessorKey: "connectedGamesCount", header: "مباريات متصلة" },
  { accessorKey: "actions", header: "#" },
];

const deleteReferee = async (row: IRefre) => {
  deletingId.value = row.id;
  await deleteREQ.fetchREQ(props.tourId, props.placeId, row.id);
  deletingId.value = null;

  if (deleteREQ.status.value === "success") {
    toast.add({
      title: "تم حذف الحكم بنجاح",
      color: "success",
      icon: "material-symbols:check",
    });
    return;
  }

  toast.add({
    title: "تعذّر حذف الحكم",
    description:
      deleteREQ.error.value?.message ||
      "لا يمكن حذف الحكم وهو مرتبط بمباراة في هذا المكان",
    color: "error",
    icon: "i-heroicons-exclamation-triangle",
  });
};
</script>
