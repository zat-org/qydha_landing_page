<template>
  <div class="space-y-3">
    <div v-if="pending" class="py-4">
      <Loading />
    </div>

    <template v-else>
      <div
        class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200/80 bg-gray-50/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-900/40"
      >
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">
          مجموعات التصفيات
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-if="canGenerateMatches && !isRegenerate"
            size="sm"
            color="primary"
            icon="i-mdi-tournament"
            label="إنشاء مباريات التصفيات"
            @click="qualGenerateOpen = true"
          />
          <UButton
            v-if="showGoToBracket"
            size="sm"
            color="primary"
            variant="soft"
            icon="i-mdi-sitemap-outline"
            label="الذهاب للخريطة"
            @click="goToBracket"
          />
          <UButton
            v-if="startableGroups.length > 0"
            size="sm"
            color="primary"
            variant="soft"
            icon="i-mdi-play"
            label="بدء المجموعات الجاهزة"
            :loading="startingAll"
            :disabled="isRowActionBusy"
            @click="() => void startAllReadyGroups()"
          />
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-heroicons-arrow-path"
            :loading="pending"
            :disabled="pending"
            aria-label="تحديث مجموعات التصفيات"
            @click="() => void onRefresh()"
          />
        </div>
      </div>

      <div
        v-if="tableRows.length"
        class="overflow-x-auto rounded-xl border border-gray-200/80 dark:border-gray-800"
      >
        <table class="min-w-full text-sm">
          <thead
            class="border-b border-gray-200/80 bg-white/60 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-400"
          >
            <tr>
              <th class="px-3 py-2.5 text-start font-medium">المكان</th>
              <th class="px-3 py-2.5 text-start font-medium">المجموعة</th>
              <th class="px-3 py-2.5 text-center font-medium">اليوم</th>
              <th class="px-3 py-2.5 text-center font-medium">الحالة</th>
              <th class="px-3 py-2.5 text-center font-medium">المباريات</th>
              <th
                v-if="showRowActions"
                class="px-3 py-2.5 text-center font-medium"
              >
                #
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200/80 dark:divide-gray-800">
            <tr
              v-for="row in tableRows"
              :key="row.groupId"
              class="bg-white/40 dark:bg-gray-900/20"
            >
              <td class="px-3 py-2.5">
                <p class="font-medium text-gray-900 dark:text-white">
                  {{ row.placeLabel }}
                </p>
                <p
                  v-if="row.placeDateWindow && row.placeDateWindow !== '—'"
                  class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                >
                  {{ row.placeDateWindow }}
                </p>
              </td>
              <td class="px-3 py-2.5 font-medium text-gray-900 dark:text-white">
                {{ row.groupName }}
              </td>
              <td class="px-3 py-2.5 text-center text-gray-700 dark:text-gray-200">
                {{ row.dayLabel }}
              </td>
              <td class="px-3 py-2.5 text-center">
                <UBadge
                  :color="groupBadgeColor(row.state)"
                  variant="soft"
                  size="sm"
                >
                  {{ row.stateLabel }}
                </UBadge>
              </td>
              <td
                class="px-3 py-2.5 text-center tabular-nums text-gray-900 dark:text-white"
              >
                <span>{{ row.matchesTotal }}</span>
                <span
                  v-if="row.matchesFinished > 0 || row.matchesRunning > 0"
                  class="ms-1 text-xs text-gray-500 dark:text-gray-400"
                >
                  <template v-if="row.matchesFinished > 0">
                    · {{ row.matchesFinished }} منتهية
                  </template>
                  <template v-if="row.matchesRunning > 0">
                    · {{ row.matchesRunning }} جارية
                  </template>
                </span>
              </td>
              <td v-if="showRowActions" class="px-3 py-2.5 text-center">
                <div class="flex flex-wrap items-center justify-center gap-1">
                  <UButton
                    v-if="canStartGroup(row)"
                    size="xs"
                    color="primary"
                    variant="soft"
                    icon="i-mdi-play"
                    label="بدء"
                    :loading="startingGroupId === row.groupId"
                    :disabled="isRowActionBusy"
                    @click="() => void startGroup(row)"
                  />
                  <UButton
                    v-if="canFinishGroup(row)"
                    size="xs"
                    color="success"
                    variant="soft"
                    icon="i-mdi-trophy"
                    label="إنهاء"
                    :loading="finishingGroupId === row.groupId"
                    :disabled="isRowActionBusy"
                    @click="() => void finishGroup(row)"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="text-sm text-gray-500">لا توجد مجموعات تصفيات بعد.</p>
    </template>

    <GenerateQualificationBracketsDrawer
      v-if="tournamentId"
      v-model:open="qualGenerateOpen"
      :tournament-id="tournamentId"
      :is-regenerate="isRegenerate"
      @success="onGenerateSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import GenerateQualificationBracketsDrawer from "~/features/tournament/detail/components/GenerateQualificationBracketsDrawer.vue";
import { GroupState } from "~/features/tournament/models/group";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";
import { useTournamentPhaseStore } from "~/store/tournamentPhase";
import { useQualificationStage } from "~/features/tournament/detail/composables/api/useQualificationStage";
import { navigateToTabView } from "~/features/tournament/detail/utils/tournamentNavigation.utils";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const phaseStore = useTournamentPhaseStore();
const toast = useToast();
const overlay = useOverlay();
const confirmModal = overlay.create(ConfirmModal);
const qualGenerateOpen = ref(false);
const startingGroupId = ref<string | null>(null);
const finishingGroupId = ref<string | null>(null);
const startingAll = ref(false);

const qualStageApi = useQualificationStage();
const startGroupReq = qualStageApi.startGroup();
const finishGroupReq = qualStageApi.finishGroup();

const pending = computed(
  () => props.lifecycleSummary.groupsHierarchyPending.value,
);
const placesTree = computed(() => props.lifecycleSummary.placesTree.value);
const tournamentId = computed(
  () => props.lifecycleSummary.tournamentId.value,
);
const detailedState = computed(
  () => props.lifecycleSummary.detailedState.value,
);

const canGenerateMatches = computed(() => {
  const action = phaseStore.phaseConfig.actions.find(
    (a) => a.id === "generateQualificationBrackets",
  );
  return action?.canExecute(phaseStore.context) ?? false;
});

const isRegenerate = computed(
  () =>
    phaseStore.context.detailedState ===
    TournamentDetailedState.ManagingQualificationStageBrackets,
);

/** After brackets are created — manage / wait / run / finished. */
const showGoToBracket = computed(() => {
  const state = detailedState.value;
  return (
    state === TournamentDetailedState.ManagingQualificationStageBrackets ||
    state === TournamentDetailedState.WaitingQualificationStageStarting ||
    state === TournamentDetailedState.QualificationStageRunning ||
    state === TournamentDetailedState.QualificationStageFinished
  );
});

const canStartInTournamentState = computed(() => {
  const state = detailedState.value;
  return (
    state === TournamentDetailedState.WaitingQualificationStageStarting ||
    state === TournamentDetailedState.QualificationStageRunning
  );
});

function goToBracket() {
  const id = tournamentId.value;
  if (!id) return;
  navigateToTabView("bracket", id);
}

type GroupTableRow = {
  groupId: string;
  placeLabel: string;
  placeDateWindow: string;
  groupName: string;
  dayLabel: string;
  state: GroupState;
  stateLabel: string;
  matchesTotal: number;
  matchesFinished: number;
  matchesRunning: number;
};

const tableRows = computed<GroupTableRow[]>(() => {
  const rows: GroupTableRow[] = [];
  for (const place of placesTree.value) {
    for (const day of place.days) {
      for (const group of day.groups) {
        rows.push({
          groupId: group.id,
          placeLabel: place.label,
          placeDateWindow: place.dateWindow,
          groupName: group.name,
          dayLabel: `${day.dateLabel} · يوم ${day.dayIndex}`,
          state: group.state,
          stateLabel: group.stateLabel,
          matchesTotal: group.matchesTotal,
          matchesFinished: group.matchesFinished,
          matchesRunning: group.matchesRunning,
        });
      }
    }
  }
  return rows;
});

function canStartGroup(row: GroupTableRow) {
  return (
    canStartInTournamentState.value &&
    row.state === GroupState.WaitingMatchesStarting
  );
}

/** Running group with every match finished — can end the group. */
function canFinishGroup(row: GroupTableRow) {
  return (
    detailedState.value === TournamentDetailedState.QualificationStageRunning &&
    row.state === GroupState.MatchesRunning &&
    row.matchesTotal > 0 &&
    row.matchesFinished >= row.matchesTotal &&
    row.matchesRunning === 0
  );
}

const startableGroups = computed(() =>
  tableRows.value.filter((row) => canStartGroup(row)),
);

const showRowActions = computed(
  () =>
    tableRows.value.length > 0 &&
    (canStartInTournamentState.value ||
      detailedState.value ===
        TournamentDetailedState.QualificationStageRunning),
);

const isRowActionBusy = computed(
  () =>
    startingAll.value ||
    !!startingGroupId.value ||
    !!finishingGroupId.value,
);

function groupBadgeColor(state: GroupState) {
  switch (state) {
    case GroupState.MatchesRunning:
      return "success";
    case GroupState.MatchesFinished:
      return "neutral";
    case GroupState.WaitingMatchesStarting:
    case GroupState.MatchesGenerated:
      return "info";
    case GroupState.TeamsLinking:
      return "warning";
    default:
      return "neutral";
  }
}

async function startGroup(row: GroupTableRow) {
  const id = tournamentId.value;
  if (!id || !canStartGroup(row)) return;

  startingGroupId.value = row.groupId;
  try {
    await startGroupReq.fetchREQ(id, row.groupId);
    if (startGroupReq.status.value === "success") {
      toast.add({
        title: `تم بدء مباريات «${row.groupName}»`,
        color: "success",
      });
      await props.lifecycleSummary.refresh();
    } else {
      const err = startGroupReq.error.value as {
        data?: { message?: string };
        message?: string;
      } | null;
      toast.add({
        title: "تعذّر بدء المجموعة",
        description: err?.data?.message ?? err?.message,
        color: "error",
      });
    }
  } finally {
    startingGroupId.value = null;
  }
}

async function startAllReadyGroups() {
  const id = tournamentId.value;
  const groups = startableGroups.value;
  if (!id || groups.length === 0) return;

  startingAll.value = true;
  let successCount = 0;
  try {
    for (const row of groups) {
      await startGroupReq.fetchREQ(id, row.groupId);
      if (startGroupReq.status.value === "success") {
        successCount += 1;
      } else {
        const err = startGroupReq.error.value as {
          data?: { message?: string };
          message?: string;
        } | null;
        toast.add({
          title: `تعذّر بدء «${row.groupName}»`,
          description: err?.data?.message ?? err?.message,
          color: "error",
        });
      }
    }
    if (successCount > 0) {
      toast.add({
        title: `تم بدء ${successCount} مجموعة`,
        color: "success",
      });
      await props.lifecycleSummary.refresh();
    }
  } finally {
    startingAll.value = false;
  }
}

async function finishGroup(row: GroupTableRow) {
  const id = tournamentId.value;
  if (!id || !canFinishGroup(row)) return;

  const instance = confirmModal.open({
    message: `هل أنت متأكد من إنهاء المجموعة «${row.groupName}» واحتساب الفرق المتأهلة؟`,
  });
  const confirmed = await instance.result;
  if (!confirmed) return;

  finishingGroupId.value = row.groupId;
  try {
    await finishGroupReq.fetchREQ(id, row.groupId);
    if (finishGroupReq.status.value === "success") {
      toast.add({
        title: `تم إنهاء «${row.groupName}» بنجاح`,
        color: "success",
      });
      await props.lifecycleSummary.refresh();
    } else {
      const err = finishGroupReq.error.value as {
        data?: { message?: string };
        message?: string;
      } | null;
      toast.add({
        title: "تعذّر إنهاء المجموعة",
        description: err?.data?.message ?? err?.message,
        color: "error",
      });
    }
  } finally {
    finishingGroupId.value = null;
  }
}

async function onRefresh() {
  await props.lifecycleSummary.refresh();
}

async function onGenerateSuccess() {
  await props.lifecycleSummary.refresh();
}
</script>
