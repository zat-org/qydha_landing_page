<template>
  <div
    v-if="linkItems.length"
    class="flex  flex-wrap gap-3 sm:flex-row"
  >
    <UButton
      v-for="item in linkItems"
      :key="item.view"
      :label="item.label"
      :icon="item.icon"
      size="lg"
      variant="soft"
      target="_blank"
      :to="item.to"
      class="w-full min-h-12 justify-center sm:w-auto"
      block
    />
  </div>
</template>

<script lang="ts" setup>
import type { TournamentDetailedState } from '~/features/tournament/models/tournament';
import {
  getPhaseViewPath,
  getTabViewsForPhase,
  TAB_VIEW_ICONS,
  TAB_VIEW_LABELS,
} from './useTournamentPhaseNavigation';

const props = defineProps<{
  tournamentId: string;
  detailedState: TournamentDetailedState | undefined;
}>();

const linkItems = computed(() =>
  getTabViewsForPhase(props.detailedState).map((view) => ({
    view,
    label: TAB_VIEW_LABELS[view],
    icon: TAB_VIEW_ICONS[view],
    to: getPhaseViewPath(view, props.tournamentId),
  })),
);
</script>
