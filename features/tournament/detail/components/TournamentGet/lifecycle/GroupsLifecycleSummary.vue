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
        <UButton
          v-if="canGenerateMatches"
          size="sm"
          color="primary"
          :variant="isRegenerate ? 'soft' : 'solid'"
          icon="i-mdi-tournament"
          :label="
            isRegenerate
              ? 'إعادة إنشاء المباريات'
              : 'إنشاء مباريات التصفيات'
          "
          @click="qualGenerateOpen = true"
        />
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
import GenerateQualificationBracketsDrawer from "~/features/tournament/detail/components/GenerateQualificationBracketsDrawer.vue";
import { GroupState } from "~/features/tournament/models/group";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";
import { useTournamentPhaseStore } from "~/store/tournamentPhase";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const phaseStore = useTournamentPhaseStore();
const qualGenerateOpen = ref(false);

const pending = computed(
  () => props.lifecycleSummary.groupsHierarchyPending.value,
);
const placesTree = computed(() => props.lifecycleSummary.placesTree.value);
const tournamentId = computed(
  () => props.lifecycleSummary.tournamentId.value,
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

async function onGenerateSuccess() {
  await props.lifecycleSummary.refresh();
}
</script>
