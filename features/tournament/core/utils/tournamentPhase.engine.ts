import type { TournamentDetailedState } from '~/features/tournament/models/tournament';
import {
  TOURNAMENT_PHASE_DEFINITIONS,
  UNKNOWN_PHASE_DEFINITION,
} from '../constants/tournamentPhase.engine';
import type {
  PhaseDefinition,
  ResolvedPhaseView,
  TournamentPhaseContext,
} from '../types';

export function getPhaseDefinition(
  state: TournamentDetailedState | undefined,
): PhaseDefinition {
  if (!state) return UNKNOWN_PHASE_DEFINITION;
  return TOURNAMENT_PHASE_DEFINITIONS[state] ?? UNKNOWN_PHASE_DEFINITION;
}

export function resolvePhaseView(ctx: TournamentPhaseContext): ResolvedPhaseView {
  const definition = getPhaseDefinition(ctx.detailedState);

  return {
    label: definition.label,
    ui: definition.ui,
    outlets: definition.navigation.outlets,
    externalTabs: definition.navigation.tabs,
    actions: definition.actions
      .filter((action) => action.when(ctx))
      .map(({ when: _when, ...action }) => action),
  };
}

export function getPhaseLabel(
  state: TournamentDetailedState | undefined,
): string {
  return getPhaseDefinition(state).label;
}

export function getPhaseUi(state: TournamentDetailedState | undefined) {
  return getPhaseDefinition(state).ui;
}
