export type TournamentOutletMode = 'embedded' | 'page';

export interface TournamentOutletModeConfig {
  value: TournamentOutletMode;
  showBackButton: boolean;
  completeWithEmit: boolean;
}
