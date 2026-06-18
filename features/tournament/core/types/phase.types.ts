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

export interface PhaseActionDefinition {
  id: PhaseActionId;
  label: string;
  icon: string;
  variant?: 'solid' | 'outline' | 'soft';
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'error';
  confirm?: PhaseActionConfirm;
  when: (ctx: TournamentPhaseContext) => boolean;
}

export interface PhaseDefinition {
  label: string;
  ui: PhaseUiConfig;
  navigation: PhaseNavigationConfig;
  actions: PhaseActionDefinition[];
}

export interface ResolvedPhaseAction extends Omit<PhaseActionDefinition, 'when'> {}

export interface ResolvedPhaseView {
  label: string;
  ui: PhaseUiConfig;
  outlets: TournamentOutletView[];
  externalTabs: TournamentTabView[];
  actions: ResolvedPhaseAction[];
}
