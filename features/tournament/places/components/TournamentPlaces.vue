<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="goBack"
          />
          <h1 class="text-2xl font-bold">أماكن البطولة ({{ places.length }})</h1>
        </div>
        <UButton
          v-if="canMutatePlaces"
          label="إضافة مكان تصفيات"
          color="primary"
          icon="i-heroicons-plus-circle"
          @click="openAddModal"
        />
      </div>
    </template>

    <div v-if="getPlacesREQ.pending.value" class="flex justify-center items-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
        <p class="text-gray-500 dark:text-gray-400">جاري تحميل الأماكن...</p>
      </div>
    </div>

    <UAlert
      v-else-if="getPlacesREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="خطأ في تحميل الأماكن"
      :description="getPlacesREQ.error.value?.message || 'حدث خطأ أثناء تحميل البيانات'"
      class="mb-4"
    >
      <template #actions>
        <UButton
          color="error"
          variant="soft"
          label="إعادة المحاولة"
          @click="getPlacesREQ.refresh()"
        />
      </template>
    </UAlert>

    <UTable
      v-else
      v-model:expanded="expandedRows"
      :data="places"
      :columns="cols"
      :get-row-can-expand="() => true"
      :get-row-id="(row) => row.id"
      hover
      class="flex-1"
    >
      <template #empty>
        <div class="flex flex-col items-center justify-center py-12 px-4">
          <UIcon
            name="i-heroicons-map-pin"
            class="mb-3 text-5xl text-gray-400"
          />
          <p class="mb-4 text-gray-500 dark:text-gray-400">لا توجد أماكن</p>
          <UButton
            v-if="canMutatePlaces"
            label="إضافة مكان تصفيات"
            color="primary"
            icon="i-heroicons-plus-circle"
            @click="openAddModal"
          />
        </div>
      </template>
      <template #expand-cell="{ row }">
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          square
          :aria-expanded="row.getIsExpanded()"
          :aria-label="row.getIsExpanded() ? 'طي الطاولات' : 'عرض الطاولات'"
          :icon="row.getIsExpanded() ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
          @click="row.toggleExpanded()"
        />
      </template>
      <template #locationDescription-cell="{ row }">
        <div class="flex flex-wrap items-center gap-2">
          <p class="font-medium text-gray-900 dark:text-gray-100">
            {{ row.original.locationDescription }}
          </p>
          <UBadge
            :color="row.original.type === 'FinalStagePlace' ? 'primary' : 'neutral'"
            variant="soft"
          >
            {{
              row.original.type === "FinalStagePlace"
                ? "المرحلة النهائية"
                : "مرحلة التصفيات"
            }}
          </UBadge>
        </div>
      </template>
      <template #schedule-cell="{ row }">
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ formatDateTime(row.original.startAt) }} —
          {{ formatDateTime(row.original.endAt) }}
        </p>
      </template>
      <template #availableTablesCount-cell="{ row }">
        {{ row.original.availableTablesCount }}
      </template>
      <template #connectedTablesCount-cell="{ row }">
        {{ row.original.connectedTablesCount ?? 0 }}
      </template>
      <template #connectedGroupsCount-cell="{ row }">
        {{ row.original.connectedGroupsCount ?? 0 }}
      </template>
      <template #connectedJoinRequestsCount-cell="{ row }">
        {{ row.original.connectedJoinRequestsCount ?? 0 }}
      </template>
      <template #actions-cell="{ row }">
        <UFieldGroup>
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-table-cells"
            :to="`/tournament/${tour_id}/table?placeId=${row.original.id}`"
          >
            الطاولات
          </UButton>
          <UButton
            v-if="canMutatePlaces && row.original.type === 'QualificationStagePlace'"
            color="warning"
            icon="i-heroicons-pencil-square"
            @click="openUpdateModal(row.original)"
          >
            تعديل
          </UButton>
          <UButton
            v-if="canDeletePlace(row.original)"
            color="error"
            icon="i-heroicons-trash"
            :loading="
              deleteREQ.status.value === 'pending' &&
              deletingId === row.original.id
            "
            @click="confirmDelete(row.original)"
          >
            حذف
          </UButton>
        </UFieldGroup>
      </template>
      <template #expanded="{ row }">
        <PlaceTablesExpand :tour-id="tour_id" :place-id="row.original.id" />
      </template>
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import AddPlaceModal from "./AddPlaceModal.vue";
import UpdatePlaceModal from "./UpdatePlaceModal.vue";
import PlaceTablesExpand from "./PlaceTablesExpand.vue";
import { canMutateTournamentPlaces } from "../utils";
import { useMyAuthStore } from "~/store/Auth";

const overlay = useOverlay();
const route = useRoute();
const toast = useToast();
const userStore = useMyAuthStore();
const tour_id = String(route.params.id ?? "");

function goBack() {
  void navigateTo(`/tournament/${tour_id}`);
}

const tourREQ = await useSingleTournament().getSingelTournament(tour_id);
const getPlacesREQ = useTournamentPlacesApi().getPlaces(tour_id);
const deleteREQ = useTournamentPlacesApi().deletePlace();

const places = computed(() => getPlacesREQ.data.value ?? []);
const deletingId = ref<string | null>(null);
const expandedRows = ref<Record<string, boolean>>({});

const cols = [
  { id: "expand", accessorKey: "expand", header: "" },
  { accessorKey: "locationDescription", header: "المكان" },
  { accessorKey: "schedule", header: "الفترة" },
  { accessorKey: "availableTablesCount", header: "السعة" },
  { accessorKey: "connectedTablesCount", header: "طاولات متصلة" },
  { accessorKey: "connectedGroupsCount", header: "مجموعات" },
  { accessorKey: "connectedJoinRequestsCount", header: "طلبات انضمام" },
  { accessorKey: "actions", header: "إجراءات" },
];

const canMutatePlaces = computed(
  () =>
    !!userStore.isAdmin &&
    canMutateTournamentPlaces(tourREQ.data.value?.tournament?.detailedState),
);

function canDeletePlace(place: GetTournamentPlace) {
  return (
    canMutatePlaces.value &&
    place.type === "QualificationStagePlace" &&
    (place.connectedJoinRequestsCount ?? 0) === 0
  );
}

function openAddModal() {
  overlay.create(AddPlaceModal, { props: { tourId: tour_id } }).open();
}

function openUpdateModal(place: GetTournamentPlace) {
  overlay
    .create(UpdatePlaceModal, { props: { tourId: tour_id, place } })
    .open();
}

const confirmModal = overlay.create(ConfirmModal);
const confirmDelete = async (place: GetTournamentPlace) => {
  const instance = confirmModal.open({
    message: `هل أنت متأكد من حذف المكان "${place.locationDescription}"؟ سيتم حذف الطاولات والمجموعات المرتبطة.`,
  });
  const confirmed = await instance.result;
  if (!confirmed) return;

  deletingId.value = place.id;
  await deleteREQ.fetchREQ(tour_id, place.id);
  deletingId.value = null;

  if (deleteREQ.status.value === "success") {
    toast.add({
      title: "تم الحذف بنجاح",
      description: `تم حذف المكان "${place.locationDescription}"`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } else if (deleteREQ.status.value === "error") {
    toast.add({
      title: "خطأ في الحذف",
      description: deleteREQ.error.value?.message || "حدث خطأ أثناء حذف المكان",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
