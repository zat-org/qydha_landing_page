/** Views embedded inside the tournament detail page */
export type TournamentOutletView = 'team' | 'joinRequest' | 'group';

/** Views that open in a separate browser tab */
export type TournamentTabView = 'bracket' | 'statistics' | 'refree' | 'tables';

export type TournamentPhaseView = TournamentOutletView | TournamentTabView;

export interface ViewMeta {
  label: string;
  icon: string;
  pathSegment: string;
}

export interface PhaseNavigationConfig {
  outlets: TournamentOutletView[];
  tabs: TournamentTabView[];
}
