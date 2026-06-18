import type { TournamentDetailedState } from '~/features/tournament/models/tournament';
import {
  OUTLET_VIEW_CONFIG,
  TAB_VIEW_CONFIG,
} from '../constants/tournamentNavigation.config';
import { getPhaseDefinition } from './tournamentPhase.engine';
import type {
  TournamentOutletView,
  TournamentPhaseView,
  TournamentTabView,
} from '../types';

export function getOutletViewsForPhase(
  state: TournamentDetailedState | undefined,
): TournamentOutletView[] {
  return getPhaseDefinition(state).navigation.outlets;
}

export function getTabViewsForPhase(
  state: TournamentDetailedState | undefined,
): TournamentTabView[] {
  return getPhaseDefinition(state).navigation.tabs;
}

export function getPhaseViewPath(
  view: TournamentPhaseView,
  tournamentId: string,
): string {
  const base = `/tournament/${tournamentId}`;
  const pathSegment =
    view in OUTLET_VIEW_CONFIG
      ? OUTLET_VIEW_CONFIG[view as TournamentOutletView].pathSegment
      : TAB_VIEW_CONFIG[view as TournamentTabView].pathSegment;

  return `${base}/${pathSegment}`;
}

export function getOutletViewMeta(view: TournamentOutletView) {
  return OUTLET_VIEW_CONFIG[view];
}

export function getTabViewMeta(view: TournamentTabView) {
  return TAB_VIEW_CONFIG[view];
}

export function openTournamentViewInNewTab(
  view: TournamentPhaseView,
  tournamentId: string,
) {
  if (!import.meta.client) return;
  window.open(
    getPhaseViewPath(view, tournamentId),
    '_blank',
    'noopener,noreferrer',
  );
}
