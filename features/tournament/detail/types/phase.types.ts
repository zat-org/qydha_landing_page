import type { GroupState } from '~/features/tournament/models/group';
import type {
  TournamentDetailedState,
  TournamentState,
} from '~/features/tournament/models/tournament';
import type { PhaseNavigationConfig, TournamentOutletView, TournamentTabView } from './navigation.types';

export interface PhaseAlertConfig {
  color: 'info' | 'success' | 'warning' | 'neutral';
  title: string;
  description?: string;
}

export interface PhaseUiConfig {
  heading?: string;
  description?: string;
  alert?: PhaseAlertConfig;
}

export interface TournamentPhaseContext {
  tournamentId: string;
  isAdmin: boolean;
  detailedState?: TournamentDetailedState;
  tournamentState?: TournamentState;
  finalGroupState?: GroupState;
  hasQualificationsStage?: boolean | null;
}

export type PhaseActionId = 'organize' | 'approvePlan' | 'start' | 'finish' | 'resume';

export type PhaseActionConfirm = 'setup' | 'approvePlan' | 'start';

export type TournamentGuardName =
  | 'canOrganize'
  | 'canApprovePlan'
  | 'canStart'
  | 'canFinish'
  | 'canResume'
  | 'showRegenerateFinalMatches'
  | 'showStartTournamentCta'
  | 'showFinishTournamentCta'
  | 'showResumeAfterFinishCta';

export interface PhaseActionConfig {
  id: PhaseActionId;
  label: string;
  icon: string;
  variant?: 'solid' | 'outline' | 'soft';
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error';
  confirm?: PhaseActionConfirm;
  guard?: TournamentGuardName;
}

/** Static phase UI config — single source of truth (UI-ready shape). */
export interface PhaseConfig {
  label: string;
  ui: PhaseUiConfig;
  outlets: TournamentOutletView[];
  externalTabs: TournamentTabView[];
  actions: PhaseActionConfig[];
}

export interface ResolvedPhaseAction extends Omit<PhaseActionConfig, 'guard'> {}

export interface ResolvedPhaseView {
  label: string;
  ui: PhaseUiConfig;
  outlets: TournamentOutletView[];
  externalTabs: TournamentTabView[];
  actions: ResolvedPhaseAction[];
}

/** @deprecated Use PhaseConfig from tournamentPhase.config.ts */
export interface PhaseActionDefinition extends PhaseActionConfig {
  when: (ctx: TournamentPhaseContext) => boolean;
}

/** @deprecated Use PhaseConfig from tournamentPhase.config.ts */
export interface PhaseDefinition {
  label: string;
  ui: PhaseUiConfig;
  navigation: PhaseNavigationConfig;
  actions: PhaseActionDefinition[];
}
