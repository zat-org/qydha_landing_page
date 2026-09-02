<template>
  <div class="mt-4 space-y-4">
    <component
      :is="lifecycle.inlineSummary"
      v-if="lifecycle.inlineSummary"
      :lifecycle-summary="summary"
    />

    <div
      v-if="lifecycle.manageRoute && lifecycle.manageLabel"
      class="flex flex-wrap gap-2 border-t border-gray-200/80 pt-4 dark:border-gray-800/80"
    >
      <UButton
        :label="lifecycle.manageLabel"
        icon="i-mdi-arrow-left-circle-outline"
        variant="soft"
        color="primary"
        class="min-h-11"
        @click="goManage"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PhaseLifecycleConfig } from "~/features/tournament/detail/types/phase.types";
import type { TournamentLifecycleSummary } from "~/features/tournament/detail/composables/logic/useTournamentLifecycleSummary";
import {
  getPhaseViewPath,
  navigateToTabView,
} from "~/features/tournament/detail/utils/tournamentNavigation.utils";

const props = defineProps<{
  tournamentId: string;
  lifecycle: PhaseLifecycleConfig;
  summary: TournamentLifecycleSummary;
}>();

function goManage() {
  const route = props.lifecycle.manageRoute;
  if (!route) return;

  if (route === "bracket") {
    navigateToTabView("bracket", props.tournamentId);
    return;
  }

  void navigateTo(getPhaseViewPath(route, props.tournamentId));
}
</script>
