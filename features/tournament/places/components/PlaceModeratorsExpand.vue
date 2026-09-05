<template>
  <div class="px-1 pb-3">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <UBadge color="neutral" variant="soft" size="xs">
        {{ moderators.length }}
      </UBadge>
      <UButton
        v-if="canMutate"
        label="اضافة مشرف"
        size="sm"
        icon="material-symbols:add"
        @click="isDrawerOpen = true"
      />
    </div>

    <div
      v-if="getModeratorsREQ.pending.value"
      class="flex items-center justify-center gap-2 py-8"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="size-6 animate-spin text-primary"
      />
      <p class="text-sm text-gray-500">جاري تحميل مشرفي المكان...</p>
    </div>

    <UAlert
      v-else-if="getModeratorsREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="تعذّر تحميل مشرفي المكان"
      :description="
        getModeratorsREQ.error.value?.message || 'حدث خطأ أثناء التحميل'
      "
    />

    <div
      v-else
      class="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    >
      <UTable :data="moderators" :columns="cols" class="min-w-[320px]">
        <template #empty>
          <p class="py-6 text-center text-sm text-gray-500">
            لا يوجد مشرفون لهذا المكان
          </p>
        </template>
        <template #actions-cell="{ row }">
          <UButton
            v-if="canMutate"
            icon="material-symbols:delete"
            color="error"
            variant="soft"
            size="sm"
            :loading="
              deleteREQ.status.value === 'pending' &&
              deletingId === row.original.user.id
            "
            @click="deleteModerator(row.original)"
          />
        </template>
      </UTable>
    </div>

    <UDrawer
      v-model:open="isDrawerOpen"
      title="اضافة مشرف مكان"
      description="اضافة مشرف جديد لهذا المكان"
      direction="left"
    >
      <template #content>
        <div class="min-w-[600px]">
          <AddPlaceModeratorForm
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
import type { PlaceModerator } from "~/features/tournament/models/placeModerator";
import AddPlaceModeratorForm from "./AddPlaceModeratorForm.vue";
import { usePlaceModeratorsApi } from "~/features/tournament/places/composables/usePlaceModeratorsApi";

const props = defineProps<{
  tourId: string;
  placeId: string;
  canMutate?: boolean;
}>();

const toast = useToast();
const isDrawerOpen = ref(false);
const deletingId = ref<string | null>(null);

const getModeratorsREQ = usePlaceModeratorsApi().getPlaceModerators(
  props.tourId,
  props.placeId,
);
const deleteREQ = usePlaceModeratorsApi().deletePlaceModerator();
const moderators = computed(() => getModeratorsREQ.data.value ?? []);

const cols = [
  { accessorKey: "user.username", header: "الاسم" },
  { accessorKey: "user.phone", header: "الهاتف" },
  { accessorKey: "actions", header: "#" },
];

const deleteModerator = async (row: PlaceModerator) => {
  deletingId.value = row.user.id;
  await deleteREQ.fetchREQ(props.tourId, props.placeId, row.user.id);
  deletingId.value = null;

  if (deleteREQ.status.value === "success") {
    toast.add({
      title: "تم حذف مشرف المكان بنجاح",
      color: "success",
      icon: "material-symbols:check",
    });
    return;
  }

  toast.add({
    title: "تعذّر حذف مشرف المكان",
    description:
      deleteREQ.error.value?.message || "حدث خطأ أثناء حذف مشرف المكان",
    color: "error",
    icon: "i-heroicons-exclamation-triangle",
  });
};
</script>
