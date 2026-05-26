<template>
  <div
    v-if="outletViews.length"
    class="mt-4 border-t border-gray-200/80 pt-4 dark:border-gray-800/80"
  >
  <!-- Single view: render directly (avoids UTabs v-model feedback loops) -->
    <div v-if="outletViews.length === 1" class="min-h-[320px] py-2">
      <component :is="viewComponents[outletViews[0]]" v-bind="viewProps(outletViews[0])" />
    </div>

    <UTabs
      v-else
      v-model="activeTab"
      :items="tabItems"
      :unmount-on-hide="false"
      dir="rtl"
      class="w-full min-w-0"
    >
      <template #team>
        <div class="min-h-[320px] py-2">
          <TournamentTeam />
        </div>
      </template>
      <template #joinRequest>
        <div class="min-h-[320px] py-2">
          <TournamentJoiningRequest />
        </div>
      </template>
      <template #group>
        <div class="min-h-[320px] py-2">
          <TournamentGroup :tournament-id="tournamentId" />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';
import type { TournamentDetailedState } from '~/features/tournament/models/tournament';
import TournamentTeam from '~/features/tournament/teams/components/TournamentTeam.vue';
import TournamentJoiningRequest from '~/features/tournament/join-request/components/TournamentJoiningRequest.vue';
import TournamentGroup from '~/features/tournament/group/components/TournamentGroup.vue';
import {
  getOutletViewsForPhase,
  OUTLET_VIEW_ICONS,
  OUTLET_VIEW_LABELS,
  type TournamentOutletView,
} from './useTournamentPhaseNavigation';
import {
  TOURNAMENT_EMBEDDED_KEY,
  useTournamentGetWorkspace,
} from './useTournamentGetWorkspace';

const props = defineProps<{
  tournamentId: string;
  detailedState: TournamentDetailedState | undefined;
}>();

const workspace = useTournamentGetWorkspace()!;

provide(TOURNAMENT_EMBEDDED_KEY, true);

const viewComponents: Record<TournamentOutletView, Component> = {
  team: TournamentTeam,
  joinRequest: TournamentJoiningRequest,
  group: TournamentGroup,
};

function viewProps(view: TournamentOutletView) {
  if (view === 'group') return { tournamentId: props.tournamentId };
  return {};
}

const outletViews = computed(() =>
  getOutletViewsForPhase(props.detailedState),
);

const tabItems = computed(() =>
  outletViews.value.map((view) => ({
    label: OUTLET_VIEW_LABELS[view],
    slot: view,
    value: view,
    icon: OUTLET_VIEW_ICONS[view],
  })),
);

const activeTab = ref<TournamentOutletView>('team');

function syncActiveTabFromPhase() {
  const views = outletViews.value;
  if (!views.length) {
    workspace.closeView();
    return;
  }
  const next = views.includes(activeTab.value) ? activeTab.value : views[0];
  activeTab.value = next;
  if (workspace.activeView.value !== next) {
    workspace.activeView.value = next;
  }
}

watch(() => props.detailedState, syncActiveTabFromPhase, { immediate: true });

watch(activeTab, (view) => {
  if (view && workspace.activeView.value !== view) {
    workspace.activeView.value = view;
  }
});
</script>
