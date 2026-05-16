<template>
  <component
    :is="phaseComponent"
    :context="context"
    @refreshed="emit('refreshed')"
  />
</template>

<script lang="ts" setup>
import type { Component } from "vue";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import CreatedPhase from "./CreatedPhase.vue";
import ReceivingJoinRequestsPhase from "./ReceivingJoinRequestsPhase.vue";
import ManagingJoinRequestsPhase from "./ManagingJoinRequestsPhase.vue";
import ManagingTeamsPhase from "./ManagingTeamsPhase.vue";
import LinkingFinalGroupTeamsPhase from "./LinkingFinalGroupTeamsPhase.vue";
import ManagingFinalGroupBracketPhase from "./ManagingFinalGroupBracketPhase.vue";
import WaitingFinalGroupStartingPhase from "./WaitingFinalGroupStartingPhase.vue";
import FinalGroupRunningPhase from "./FinalGroupRunningPhase.vue";
import FinishedPhase from "./FinishedPhase.vue";
import UnknownPhase from "./UnknownPhase.vue";
import type { TournamentPhaseContext } from "./types";

const PHASE_COMPONENTS: Record<TournamentDetailedState, Component> = {
  [TournamentDetailedState.Created]: CreatedPhase,
  [TournamentDetailedState.ReceivingJoinRequests]: ReceivingJoinRequestsPhase,
  [TournamentDetailedState.ManagingJoinRequests]: ManagingJoinRequestsPhase,
  [TournamentDetailedState.ManagingTeams]: ManagingTeamsPhase,
  [TournamentDetailedState.LinkingFinalGroupTeams]: LinkingFinalGroupTeamsPhase,
  [TournamentDetailedState.ManagingFinalGroupBracket]:
    ManagingFinalGroupBracketPhase,
  [TournamentDetailedState.WaitingFinalGroupStarting]:
    WaitingFinalGroupStartingPhase,
  [TournamentDetailedState.FinalGroupRunning]: FinalGroupRunningPhase,
  [TournamentDetailedState.Finished]: FinishedPhase,
};

const props = defineProps<{ context: TournamentPhaseContext }>();
const emit = defineEmits<{ refreshed: [] }>();

const phaseComponent = computed(() => {
  const state = props.context.detailedState;
  if (!state) return UnknownPhase;
  return PHASE_COMPONENTS[state] ?? UnknownPhase;
});
</script>
