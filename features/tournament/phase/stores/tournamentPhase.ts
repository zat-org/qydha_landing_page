import { defineStore } from 'pinia';
import { GroupType } from '~/features/tournament/models/group';
import type { DetailTournament } from '~/features/tournament/models/tournament';
import type {
  ResolvedPhaseView,
  TournamentGuardName,
  TournamentPhaseContext,
} from '~/features/tournament/detail/types/phase.types';
import { tournamentGuards } from '../guards';
import {
  getPhaseConfig,
  UNKNOWN_PHASE_CONFIG,
} from '../tournamentPhase.config';

export function buildPhaseContextFromTour(
  tour: DetailTournament,
  isAdmin: boolean,
): TournamentPhaseContext {
  const finalGroup = tour.tournament.groups?.find(
    (g) => g.type === GroupType.Final,
  );

  return {
    tournamentId: tour.tournament.id,
    isAdmin,
    detailedState: tour.tournament.detailedState,
    tournamentState: tour.tournament.state,
    finalGroupState: finalGroup?.state,
    hasQualificationsStage: tour.tournament.hasQualificationsStage,
  };
}

function buildPhaseView(context: TournamentPhaseContext): ResolvedPhaseView {
  const config = getPhaseConfig(context.detailedState);

  return {
    label: config.label,
    ui: config.ui,
    outlets: config.outlets,
    externalTabs: config.externalTabs,
    actions: config.actions
      .filter(
        (action) =>
          !action.guard || tournamentGuards[action.guard]({ context }),
      )
      .map(({ guard: _guard, ...action }) => action),
  };
}

const emptyContext: TournamentPhaseContext = {
  tournamentId: '',
  isAdmin: false,
};

export const useTournamentPhaseStore = defineStore('tournamentPhase', () => {
  const context = ref<TournamentPhaseContext>({ ...emptyContext });
  const phaseView = ref<ResolvedPhaseView>({ ...UNKNOWN_PHASE_CONFIG, actions: [] });

  function syncFromTour(tour: DetailTournament, isAdmin: boolean) {
    context.value = buildPhaseContextFromTour(tour, isAdmin);
    phaseView.value = buildPhaseView(context.value);
  }

  function syncContext(next: TournamentPhaseContext) {
    context.value = next;
    phaseView.value = buildPhaseView(context.value);
  }

  function reset() {
    context.value = { ...emptyContext };
    phaseView.value = { ...UNKNOWN_PHASE_CONFIG, actions: [] };
  }

  function checkGuard(guard: TournamentGuardName): boolean {
    return tournamentGuards[guard]({ context: context.value });
  }

  const phaseLabel = computed(() => phaseView.value.label);

  return {
    context,
    phaseView,
    phaseLabel,
    syncContext,
    syncFromTour,
    reset,
    checkGuard,
  };
});
