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
      :target="item.openInNewTab ? '_blank' : undefined"
      :to="item.to"
      class="w-full min-h-12 justify-center sm:w-auto"
      block
    />
  </div>
</template>

<script lang="ts" setup>
import { buildTabNavItems } from '~/features/tournament/detail/utils/tournamentNavigation.utils';
import type { TournamentTabView } from '~/features/tournament/detail/types/navigation.types';

const props = defineProps<{
  tournamentId: string;
  tabs: TournamentTabView[];
}>();

const linkItems = computed(() =>
  buildTabNavItems(props.tabs, props.tournamentId),
);
</script>
