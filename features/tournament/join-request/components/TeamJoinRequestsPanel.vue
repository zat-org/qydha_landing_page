<template>
  <div class="flex flex-col gap-4 py-2">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <UBadge color="primary" size="lg" variant="soft" class="w-fit">
        العدد: {{ participantsCount }} مشتركين · {{ totalCount }} فرق
      </UBadge>
      <UPagination
        v-model:page="params.pageNumber"
        :total="totalCount"
        :page-size="params.pageSize"
      />
    </div>

    <div
      v-if="canMutate && selectedIds.length"
      class="flex flex-wrap items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3"
    >
      <span class="text-sm font-medium">{{ selectedIds.length }} محدد</span>
      <UButton
        v-if="activeTab === 'consideration'"
        size="sm"
        color="primary"
        variant="soft"
        :loading="patching"
        @click="openConsiderModal(selectedRows)"
      >
        موافقة أولية للمحدد
      </UButton>
      <UButton
        v-if="activeTab === 'consideration'"
        size="sm"
        color="info"
        variant="soft"
        :loading="patching"
        @click="run('move-to-waiting-list', selectedIds)"
      >
        نقل للانتظار
      </UButton>
      <UButton
        v-if="activeTab === 'approval'"
        size="sm"
        color="neutral"
        variant="soft"
        :loading="patching"
        @click="run('revert-consideration', selectedIds)"
      >
        تراجع عن الموافقة
      </UButton>
      <UButton
        v-if="activeTab === 'canceled'"
        size="sm"
        color="neutral"
        variant="soft"
        :loading="patching"
        @click="run('revert-cancel', selectedIds)"
      >
        إرجاع الإلغاء
      </UButton>
      <UButton
        v-if="activeTab === 'waitingList'"
        size="sm"
        color="neutral"
        variant="soft"
        :loading="patching"
        @click="run('revert-waiting-list', selectedIds)"
      >
        إرجاع من قائمة الانتظار
      </UButton>
      <UButton
        v-if="activeTab === 'consideration' || activeTab === 'approval'"
        size="sm"
        color="error"
        variant="soft"
        :loading="patching"
        @click="run('cancel', selectedIds)"
      >
        إلغاء المحدد
      </UButton>
    </div>

    <div
      class="flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white/60 p-3 dark:border-gray-800 dark:bg-gray-900/40 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <UFormField class="min-w-0 flex-1" label="بحث">
        <UInput placeholder="اسم الفريق أو اللاعب" @input="debouncedSearch" />
      </UFormField>

      <UFormField
        v-if="activeTab === 'approval'"
        class="min-w-0 flex-1"
        label="تصفية حسب المكان المعيّن"
      >
        <USelect
          v-model="assignedPlaceFilter"
          class="w-full"
          :items="assignedPlaceFilterOptions"
          value-key="value"
          label-key="label"
        />
      </UFormField>
    </div>

    <div
      v-if="pending"
      class="flex justify-center py-8"
    >
      <UIcon name="i-heroicons-arrow-path" class="size-6 animate-spin text-primary" />
    </div>

    <div
      v-else-if="!items.length"
      class="rounded-xl border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500 dark:border-gray-700"
    >
      لا توجد طلبات في هذا القسم
    </div>

    <div
      v-else
      class="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800"
    >
      <div
        class="grid min-w-[520px] grid-cols-[auto_auto_1fr_auto] items-center gap-x-3 border-b border-gray-200/80 bg-gray-50/80 px-3 py-2 text-xs font-medium text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400"
        :class="{ 'sm:grid-cols-[auto_auto_1fr_auto]': true }"
      >
        <span v-if="canMutate" class="w-8" />
        <span class="w-8" />
        <span>الفريق</span>
        <span v-if="canMutate">إجراءات</span>
      </div>

      <div class="divide-y divide-gray-200/80 dark:divide-gray-800">
        <div v-for="item in items" :key="item.joinRequestId">
          <div
            class="grid min-w-[520px] grid-cols-[auto_auto_1fr_auto] items-center gap-x-3 px-3 py-2.5"
          >
            <UCheckbox
              v-if="canMutate"
              class="w-8"
              :model-value="selectedIds.includes(item.joinRequestId)"
              @update:model-value="
                toggleSelect(item.joinRequestId, $event === true)
              "
            />
            <span v-else class="w-8" />

            <UButton
              color="neutral"
              variant="ghost"
              size="xs"
              class="w-8"
              :icon="
                expandedIds.has(item.joinRequestId)
                  ? 'i-heroicons-chevron-down'
                  : 'i-heroicons-chevron-left'
              "
              @click="toggleExpand(item.joinRequestId)"
            />

            <div class="min-w-0">
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ item.teamName || "—" }}
              </p>
              <p
                v-if="!expandedIds.has(item.joinRequestId)"
                class="truncate text-xs text-gray-500 dark:text-gray-400"
              >
                <template v-if="activeTab === 'consideration'">
                  <span>{{ preferredPlaceRowLabel(item) }}</span>
                  <span class="mx-1 opacity-40">·</span>
                </template>
                <template v-else-if="activeTab === 'approval'">
                  <span>{{ assignedPlaceRowLabel(item) }}</span>
                  <span class="mx-1 opacity-40">·</span>
                </template>
                {{ item.creatorUsername }} · {{ item.teammateUsername }}
              </p>
            </div>

            <div
              v-if="canMutate"
              class="flex flex-wrap items-center justify-end gap-1"
            >
              <UButton
                v-if="
                  activeTab === 'consideration' &&
                  item.state ===
                    TeamJoinRequestWorkflowState.WaitingOrganizerConsideration
                "
                size="xs"
                color="primary"
                variant="soft"
                :disabled="patching"
                @click="openConsiderModal([item])"
              >
                موافقة أولية
              </UButton>
              <UDropdownMenu
                v-if="hasRowMenu(item)"
                :items="rowMenuItems(item)"
              >
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-vertical"
                  :disabled="patching"
                />
              </UDropdownMenu>
            </div>
          </div>

          <div
            v-if="expandedIds.has(item.joinRequestId)"
            class="border-t border-gray-100 bg-gray-50/60 px-3 py-3 text-sm dark:border-gray-800 dark:bg-gray-900/30"
          >
            <dl class="grid gap-2 sm:grid-cols-2">
              <div>
                <dt class="text-xs text-gray-500">المالك</dt>
                <dd dir="ltr" class="font-medium">
                  {{ item.creatorUsername || "—" }}
                  <span v-if="item.creatorAge != null" class="text-gray-500">
                    ({{ item.creatorAge }})
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-xs text-gray-500">الزميل</dt>
                <dd dir="ltr" class="font-medium">
                  {{ item.teammateUsername || "—" }}
                  <span v-if="item.teammateAge != null" class="text-gray-500">
                    ({{ item.teammateAge }})
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-xs text-gray-500">مكان مفضل</dt>
                <dd>
                  {{ placeLabel(item.selectedQualificationsPlaceId) }}
                </dd>
              </div>
              <div v-if="activeTab === 'approval'">
                <dt class="text-xs text-gray-500">مكان معيّن</dt>
                <dd>{{ placeLabel(item.assignedPlaceId) }}</dd>
              </div>
              <div v-if="activeTab === 'consideration'">
                <dt class="text-xs text-gray-500">يقبل قائمة الانتظار</dt>
                <dd>
                  {{ item.acceptsWaitingListPlacement ? "نعم" : "لا" }}
                </dd>
              </div>
              <div>
                <dt class="text-xs text-gray-500">تاريخ الطلب</dt>
                <dd>{{ formatDate(item.createdAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <JoinRequestConsiderPlaceModal
      v-model:open="considerModalOpen"
      :places="allPlaces"
      :rows="considerModalRows"
      :loading="patching"
      :resolve-place-label="placeLabel"
      @confirm="onConsiderConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { formatDate } from "~/utils/formatDate";
import {
  TeamJoinRequestWorkflowState,
  type GetTeamJoinRequestsParams,
  type TeamJoinRequestListItem,
  type TeamJoinRequestPatchAction,
} from "~/features/tournament/models/TournamentJoinRequest";
import {
  JOIN_REQUEST_TAB_STATES,
  selectedIdsBody,
} from "~/features/tournament/join-request/composables/joinRequestQuery.utils";
import { getJoinRequestTargetPlaces } from "~/features/tournament/join-request/composables/joinRequestPlaces.utils";
import JoinRequestConsiderPlaceModal from "~/features/tournament/join-request/components/JoinRequestConsiderPlaceModal.vue";
import { useTournamentPlacesApi } from "~/features/tournament/places/composables/useTournamentPlacesApi";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTournamentJoinRequest } from "~/features/tournament/join-request/composables/TournamentJoinRequest";

export type JoinRequestListTab =
  | "consideration"
  | "approval"
  | "canceled"
  | "waitingList";

const props = defineProps<{
  tournamentId: string;
  canMutate: boolean;
  activeTab: JoinRequestListTab;
}>();

const selectedIds = defineModel<string[]>("selectedIds", { default: () => [] });

const emit = defineEmits<{ mutated: [] }>();

const tourREQ = await useSingleTournament().getSingelTournament(
  props.tournamentId,
);
const placesREQ = useTournamentPlacesApi().getPlaces(props.tournamentId);
const { placeLabel } = useTournamentPlaces(() => tourREQ.data.value);

const allPlaces = computed(() => placesREQ.data.value ?? []);
const targetPlaces = computed(() => getJoinRequestTargetPlaces(allPlaces.value));

const assignedPlaceFilter = ref<string>("all");
const expandedIds = ref(new Set<string>());

const considerModalOpen = ref(false);
const considerModalRows = ref<TeamJoinRequestListItem[]>([]);

const assignedPlaceFilterOptions = computed(() => [
  { label: "كل الأماكن المعيّنة", value: "all" },
  ...targetPlaces.value.map((p) => ({
    label: placeLabel(p.id),
    value: p.id,
  })),
]);

const params = ref<GetTeamJoinRequestsParams>({
  pageNumber: 1,
  pageSize: 10,
  searchToken: null,
  getOnlyStates: JOIN_REQUEST_TAB_STATES[props.activeTab],
});

watch(
  () => props.activeTab,
  (tab) => {
    params.value.getOnlyStates = JOIN_REQUEST_TAB_STATES[tab];
    params.value.pageNumber = 1;
    params.value.useSelectedQualificationsPlaceIdFilter = undefined;
    params.value.selectedQualificationsPlaceId = undefined;
    params.value.assignedPlaceId = undefined;
    params.value.useAssignedPlaceNullFilter = false;
    assignedPlaceFilter.value = "all";
    selectedIds.value = [];
    expandedIds.value = new Set();
  },
);

watch(assignedPlaceFilter, () => {
  if (props.activeTab === "approval" && assignedPlaceFilter.value !== "all") {
    params.value.assignedPlaceId = assignedPlaceFilter.value;
    params.value.useAssignedPlaceNullFilter = false;
  } else {
    params.value.assignedPlaceId = undefined;
    params.value.useAssignedPlaceNullFilter = false;
  }

  params.value.pageNumber = 1;
});

const debouncedSearch = useDebounceFn((value: Event) => {
  const input = value.target as HTMLInputElement;
  params.value.searchToken = input.value ? input.value : null;
  params.value.pageNumber = 1;
}, 1000);

const { getTeamJoinRequests, patchJoinRequests } = useTournamentJoinRequest();

const { data, pending, refresh } = getTeamJoinRequests(
  props.tournamentId,
  params,
  `tab-${props.activeTab}`,
);

const items = computed(() => data.value?.items ?? []);
const totalCount = computed(() => data.value?.totalCount ?? 0);
const participantsCount = computed(() => totalCount.value * 2);

const selectedRows = computed(() =>
  items.value.filter((item) => selectedIds.value.includes(item.joinRequestId)),
);

function toggleSelect(id: string, checked: boolean) {
  if (checked) {
    if (!selectedIds.value.includes(id)) {
      selectedIds.value = [...selectedIds.value, id];
    }
  } else {
    selectedIds.value = selectedIds.value.filter((x) => x !== id);
  }
}

function toggleExpand(id: string) {
  const next = new Set(expandedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedIds.value = next;
}

function preferredPlaceRowLabel(item: TeamJoinRequestListItem): string {
  if (!item.selectedQualificationsPlaceId) return "بدون تفضيل مكان";
  return placeLabel(item.selectedQualificationsPlaceId);
}

function assignedPlaceRowLabel(item: TeamJoinRequestListItem): string {
  if (!item.assignedPlaceId) return "بدون مكان معيّن";
  return placeLabel(item.assignedPlaceId);
}

function openConsiderModal(rows: TeamJoinRequestListItem[]) {
  if (!rows.length) return;
  considerModalRows.value = rows;
  considerModalOpen.value = true;
}

const patching = ref(false);

async function onConsiderConfirm(placeId: string) {
  const ids = considerModalRows.value.map((r) => r.joinRequestId);
  if (!ids.length) return;
  patching.value = true;
  try {
    const ok = await patchJoinRequests(
      props.tournamentId,
      "consider",
      selectedIdsBody(ids, placeId),
    );
    if (ok) {
      considerModalOpen.value = false;
      considerModalRows.value = [];
      selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
}

async function run(action: TeamJoinRequestPatchAction, ids: string[]) {
  if (!props.canMutate || !ids.length) return;
  patching.value = true;
  try {
    const ok = await patchJoinRequests(
      props.tournamentId,
      action,
      selectedIdsBody(ids, null),
    );
    if (ok) {
      selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
      emit("mutated");
    }
  } finally {
    patching.value = false;
  }
}

function hasRowMenu(item: TeamJoinRequestListItem): boolean {
  return rowMenuItems(item).length > 0;
}

function rowMenuItems(item: TeamJoinRequestListItem) {
  const id = item.joinRequestId;
  const items: { label: string; onSelect: () => void }[] = [];

  if (
    props.activeTab === "consideration" &&
    item.acceptsWaitingListPlacement
  ) {
    items.push({
      label: "قائمة الانتظار",
      onSelect: () => void run("move-to-waiting-list", [id]),
    });
  }
  if (
    props.activeTab === "consideration" ||
    props.activeTab === "approval"
  ) {
    items.push({
      label: "إلغاء",
      onSelect: () => void run("cancel", [id]),
    });
  }
  if (props.activeTab === "approval") {
    items.push({
      label: "تراجع عن الموافقة",
      onSelect: () => void run("revert-consideration", [id]),
    });
  }
  if (props.activeTab === "canceled") {
    items.push({
      label: "إرجاع الإلغاء",
      onSelect: () => void run("revert-cancel", [id]),
    });
  }
  if (props.activeTab === "waitingList") {
    items.push({
      label: "إرجاع من قائمة الانتظار",
      onSelect: () => void run("revert-waiting-list", [id]),
    });
  }

  return [items];
}

defineExpose({ refresh, totalCount, approvalCount: totalCount });
</script>
