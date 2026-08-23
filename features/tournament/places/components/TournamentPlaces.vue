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

    <div
      v-else-if="!places.length"
      class="flex flex-col items-center justify-center py-12 px-4"
    >
      <UIcon name="i-heroicons-map-pin" class="mb-3 text-5xl text-gray-400" />
      <p class="mb-4 text-gray-500 dark:text-gray-400">لا توجد أماكن</p>
      <UButton
        v-if="canMutatePlaces"
        label="إضافة مكان تصفيات"
        color="primary"
        icon="i-heroicons-plus-circle"
        @click="openAddModal"
      />
    </div>

    <UTabs
      v-else
      v-model="selectedPlaceId"
      :items="placeTabItems"
      dir="rtl"
      class="w-full min-w-0"
    >
      <template v-for="place in places" :key="place.id" #[`place-${place.id}`]>
        <div class="flex flex-col gap-4 pt-4">
          <div
            class="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-950/40 sm:flex-row sm:items-start sm:justify-between"
          >
            <div class="min-w-0 space-y-2">
              <div class="flex flex-wrap items-center gap-2">
                <p class="font-semibold text-gray-900 dark:text-gray-100">
                  {{ place.locationDescription }}
                </p>
                <UBadge
                  :color="place.stageType === 'Final' ? 'primary' : 'neutral'"
                  variant="soft"
                >
                  {{
                    place.stageType === "Final"
                      ? "المرحلة النهائية"
                      : "مرحلة التصفيات"
                  }}
                </UBadge>
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ formatDateTime(place.startAt) }} — {{ formatDateTime(place.endAt) }}
              </p>
              <div class="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                <UBadge color="neutral" variant="outline" size="xs">
                  السعة {{ place.availableTablesCount }}
                </UBadge>
                <UBadge color="neutral" variant="outline" size="xs">
                  طاولات {{ place.connectedTablesCount ?? 0 }}
                </UBadge>
                <UBadge color="neutral" variant="outline" size="xs">
                  مجموعات {{ place.connectedGroupsCount ?? 0 }}
                </UBadge>
                <UBadge color="neutral" variant="outline" size="xs">
                  طلبات {{ place.connectedJoinRequestsCount ?? 0 }}
                </UBadge>
              </div>
            </div>
            <UFieldGroup>
              <UButton
                color="neutral"
                variant="soft"
                icon="i-heroicons-table-cells"
                :to="`/tournament/${tour_id}/table?placeId=${place.id}`"
              >
                إدارة الطاولات
              </UButton>
              <UButton
                v-if="canMutatePlaces && place.stageType === 'Qualification'"
                color="warning"
                icon="i-heroicons-pencil-square"
                @click="openUpdateModal(place)"
              >
                تعديل
              </UButton>
              <UButton
                v-if="canDeletePlace(place)"
                color="error"
                icon="i-heroicons-trash"
                :loading="
                  deleteREQ.status.value === 'pending' && deletingId === place.id
                "
                @click="confirmDelete(place)"
              >
                حذف
              </UButton>
            </UFieldGroup>
          </div>

          <UAccordion
            v-model="openSections"
            type="multiple"
            :items="sectionItems"
            class="w-full rounded-lg border border-gray-200 px-2 dark:border-gray-700"
          >
            <template #tables>
              <PlaceTablesExpand :tour-id="tour_id" :place-id="place.id" />
            </template>
            <template #referees>
              <PlaceRefereesExpand
                :tour-id="tour_id"
                :place-id="place.id"
                :can-mutate="canMutateReferees"
              />
            </template>
          </UAccordion>
        </div>
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import AddPlaceModal from "./AddPlaceModal.vue";
import UpdatePlaceModal from "./UpdatePlaceModal.vue";
import PlaceTablesExpand from "./PlaceTablesExpand.vue";
import PlaceRefereesExpand from "./PlaceRefereesExpand.vue";
import { canMutateTournamentPlaces } from "../utils";
import { useMyAuthStore } from "~/store/Auth";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { formatDateTime } from "~/utils/formatDate";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTournamentPlacesApi } from "~/features/tournament/places/composables/useTournamentPlacesApi";

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
const selectedPlaceId = ref("");
const openSections = ref(["tables", "referees"]);

const placeTabItems = computed(() =>
  places.value.map((place) => ({
    label: place.locationDescription,
    value: place.id,
    slot: `place-${place.id}`,
    icon:
      place.stageType === "Final"
        ? "i-heroicons-flag"
        : "i-heroicons-map-pin",
  })),
);

const sectionItems = [
  {
    label: "الطاولات",
    icon: "i-heroicons-table-cells",
    slot: "tables",
    value: "tables",
  },
  {
    label: "الحكام",
    icon: "i-mdi-account-group",
    slot: "referees",
    value: "referees",
  },
];

watch(
  places,
  (list) => {
    if (!list.length) {
      selectedPlaceId.value = "";
      return;
    }
    if (!list.some((place) => place.id === selectedPlaceId.value)) {
      selectedPlaceId.value = list[0].id;
    }
  },
  { immediate: true },
);

const canMutatePlaces = computed(
  () =>
    !!userStore.isAdmin &&
    canMutateTournamentPlaces(tourREQ.data.value?.tournament?.detailedState),
);

const canMutateReferees = computed(
  () =>
    tourREQ.data.value?.tournament?.detailedState !=
    TournamentDetailedState.Finished,
);

function canDeletePlace(place: GetTournamentPlace) {
  return (
    canMutatePlaces.value &&
    place.stageType === "Qualification" &&
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
