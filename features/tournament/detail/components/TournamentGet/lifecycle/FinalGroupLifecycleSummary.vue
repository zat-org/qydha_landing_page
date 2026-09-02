<template>
  <div class="space-y-3">
    <div v-if="pending" class="py-4">
      <Loading />
    </div>
    <template v-else-if="summary">
      <div
        class="rounded-xl border border-gray-200/80 px-4 py-3 dark:border-gray-800"
      >
        <div class="flex flex-wrap items-center justify-between gap-2">
          <p class="font-semibold text-gray-900 dark:text-white">
            {{ summary.name }}
          </p>
          <UBadge :color="badgeColor" variant="soft">{{ summary.stateLabel }}</UBadge>
        </div>
        <div class="mt-3 flex flex-wrap gap-2">
          <LifecycleStatChip
            icon="i-mdi-account-group"
            label="فرق مرتبطة"
            :value="summary.teamsLinked"
          />
          <LifecycleStatChip
            icon="i-mdi-soccer-field"
            label="المباريات"
            :value="matchLabel"
          />
        </div>
      </div>
    </template>
    <p v-else class="text-sm text-gray-500">لم تُنشأ المجموعة النهائية بعد.</p>
  </div>
</template>

<script lang="ts" setup>
import Loading from "~/components/loading.vue";
import LifecycleStatChip from "./LifecycleStatChip.vue";
import { GroupState } from "~/features/tournament/models/group";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";

const props = defineProps<{
  lifecycleSummary: TournamentLifecycleSummary;
}>();

const pending = computed(
  () => props.lifecycleSummary.groupsHierarchyPending.value,
);
const summary = computed(() => props.lifecycleSummary.finalGroupSummary.value);

const matchLabel = computed(() => {
  const s = summary.value;
  if (!s) return "—";
  if (s.matchesTotal === 0) return "0";
  const parts = [String(s.matchesTotal)];
  if (s.matchesFinished) parts.push(`${s.matchesFinished} منتهية`);
  if (s.matchesRunning) parts.push(`${s.matchesRunning} جارية`);
  return parts.join(" · ");
});

const badgeColor = computed(() => {
  const state = summary.value?.state;
  if (state === GroupState.MatchesRunning) return "success";
  if (state === GroupState.TeamsLinking) return "warning";
  return "info";
});
</script>
