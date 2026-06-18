import {
  EMBEDDED_TOURNAMENT_OUTLET_MODE,
  TOURNAMENT_OUTLET_MODES,
} from '../constants/tournamentEmbed.config';
import { TOURNAMENT_OUTLET_REGISTRY } from '../constants/tournamentOutlet.registry';
import type {
  TournamentOutletContext,
  TournamentOutletMode,
  TournamentOutletView,
} from '../types';
import { getOutletViewMeta } from './tournamentNavigation.utils';

export function buildOutletContext(
  tournamentId: string,
  mode: TournamentOutletMode = EMBEDDED_TOURNAMENT_OUTLET_MODE,
): TournamentOutletContext {
  return { tournamentId, mode };
}

export function getOutletRegistryEntry(view: TournamentOutletView) {
  return TOURNAMENT_OUTLET_REGISTRY[view];
}

export function buildOutletTabItems(views: TournamentOutletView[]) {
  return views.map((view) => {
    const meta = getOutletViewMeta(view);
    return {
      label: meta.label,
      slot: view,
      value: view,
      icon: meta.icon,
    };
  });
}

export function shouldShowBackButton(mode: TournamentOutletMode): boolean {
  return TOURNAMENT_OUTLET_MODES[mode].showBackButton;
}

export function shouldCompleteWithEmit(mode: TournamentOutletMode): boolean {
  return TOURNAMENT_OUTLET_MODES[mode].completeWithEmit;
}
