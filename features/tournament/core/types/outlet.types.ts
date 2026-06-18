import type { Component } from 'vue';

export type TournamentOutletMode = 'embedded' | 'page';

export interface TournamentOutletContext {
  tournamentId: string;
  mode: TournamentOutletMode;
}

export interface TournamentOutletDef {
  component: Component;
  props: (ctx: TournamentOutletContext) => Record<string, unknown>;
}

export interface TournamentOutletModeConfig {
  value: TournamentOutletMode;
  showBackButton: boolean;
  completeWithEmit: boolean;
}
