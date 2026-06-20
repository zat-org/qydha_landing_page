<template>
  <div
    v-if="linkItems.length"
    class="flex flex-wrap gap-3 sm:flex-row"
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
import { getPhaseViewPath } from '~/features/tournament/detail/utils/tournamentNavigation.utils';
import { TAB_VIEW_CONFIG } from '~/features/tournament/detail/constants/tournamentNavigation.config';
import type { TournamentTabView } from '~/features/tournament/detail/types/navigation.types';

const props = defineProps<{
  tournamentId: string;
  tabs: TournamentTabView[];
}>();

const linkItems = computed(() =>
  props.tabs.map((view) => ({
    view,
    label: TAB_VIEW_CONFIG[view].label,
    icon: TAB_VIEW_CONFIG[view].icon,
    to: getPhaseViewPath(view, props.tournamentId),
  })),
);
</script>
