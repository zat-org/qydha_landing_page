import type { TournamentOutletMode, TournamentOutletModeConfig } from '../types';

export const TOURNAMENT_OUTLET_MODES = {
  embedded: {
    value: 'embedded',
    showBackButton: false,
    completeWithEmit: true,
  },
  page: {
    value: 'page',
    showBackButton: true,
    completeWithEmit: false,
  },
} as const satisfies Record<TournamentOutletMode, TournamentOutletModeConfig>;

export const DEFAULT_TOURNAMENT_OUTLET_MODE: TournamentOutletMode = 'page';

export const EMBEDDED_TOURNAMENT_OUTLET_MODE: TournamentOutletMode = 'embedded';
