<template>
  <UCard v-if="tour" :ui="{ root: 'flex flex-col h-full ' }">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="navigateTo(`/tournament/${tour_id}`)"
          />
          <h1 class="text-2xl font-bold">
            <span>المديرين</span>
            ({{ moderatorsCount }})
          </h1>
        </div>

        <UButton
          v-if="canAssign"
          label="اضافة مدير"
          icon="material-symbols:add"
          @click="openAddModal"
        />
      </div>
    </template>

    <div
      v-if="moderatorsGetREQ.pending.value || moderatorsGetREQ.status.value === 'idle'"
      class="flex justify-center items-center py-12"
    >
      <div class="flex flex-col items-center gap-4">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-primary"
        />
        <p class="text-gray-500 dark:text-gray-400">جاري تحميل المديرين...</p>
      </div>
    </div>

    <UAlert
      v-else-if="moderatorsGetREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="خطأ في تحميل المديرين"
      :description="
        moderatorsGetREQ.error.value?.message || 'حدث خطأ أثناء تحميل البيانات'
      "
      class="mb-4"
    >
      <template #actions>
        <UButton
          color="error"
          variant="soft"
          label="إعادة المحاولة"
          @click="moderatorsGetREQ.refresh()"
        />
      </template>
    </UAlert>

    <UTable v-else :data="moderators" :columns="cols" hover class="flex-1">
      <template #empty>
        <div class="flex flex-col items-center justify-center py-12 px-4">
          <UIcon
            name="i-mdi-account-supervisor-outline"
            class="mb-3 text-5xl text-gray-400"
          />
          <p class="mb-4 text-gray-500 dark:text-gray-400">لا يوجد مديرين</p>
          <UButton
            v-if="canAssign"
            label="اضافة مدير"
            color="primary"
            icon="material-symbols:add"
            @click="openAddModal"
          />
        </div>
      </template>
      <template #permissions-cell="{ row }">
        <div class="flex flex-wrap gap-1">
          <UBadge
            v-for="perm in row.original.permissions"
            :key="perm"
            size="xs"
            variant="soft"
          >
            {{ perm }}
          </UBadge>
        </div>
      </template>
      <template #actions-cell="{ row }">
        <UFieldGroup v-if="canAssign">
          <UButton
            icon="material-symbols:settings"
            color="warning"
            variant="outline"
            @click="openUpdateModal(row.original)"
          />
          <UButton
            icon="material-symbols:delete"
            color="error"
            variant="outline"
            @click="onDeleteModerator(row.original)"
          />
        </UFieldGroup>
      </template>
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import type { IModerator } from "~/features/tournament/models/tournamentModeratorr";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useMyAuthStore } from "~/store/Auth";
import AddModal from "./AddModal.vue";
import EditModal from "./EditModal.vue";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTournamentModerator } from "~/features/tournament/moderators/composables/tournamentModerator";

const route = useRoute();
const overlay = useOverlay();
const toast = useToast();
const userStore = useMyAuthStore();
const tour_id = route.params.id?.toString() || "";

const tourREQ = await useSingleTournament().getSingelTournament(tour_id);
if (tourREQ.status.value == "error") {
  navigateTo("/tournament");
}

const tour = computed(() => tourREQ.data.value?.tournament);

const canAssign = computed(
  () =>
    (!!userStore.isAdmin || !!userStore.isOrganizer) &&
    tour.value?.detailedState != TournamentDetailedState.Finished,
);

const moderatorsGetREQ = await useTournamentModerator().getAllmoderators();
await moderatorsGetREQ.fetchREQ(tour_id);

const moderators = computed(() => moderatorsGetREQ.data.value ?? []);
const moderatorsCount = computed(() => moderators.value.length);

const cols = [
  { accessorKey: "user.username", header: "الاسم" },
  { accessorKey: "user.phone", header: "الهاتف" },
  { accessorKey: "permissions", header: "الصلاحيات" },
  { accessorKey: "actions", header: "#" },
];

function openAddModal() {
  overlay.create(AddModal).open();
}

function openUpdateModal(row: IModerator) {
  overlay.create(EditModal, { props: { moderator: row } }).open();
}

const deletModeratorREQ = await useTournamentModerator().deleteModerator();

async function onDeleteModerator(row: IModerator) {
  await deletModeratorREQ.fetchREQ(tour_id, row.user.id);
  if (deletModeratorREQ.status.value == "success") {
    toast.add({
      title: "تم حذف المدير بنجاح",
      color: "success",
      icon: "material-symbols:check",
    });
  }
}
</script>
