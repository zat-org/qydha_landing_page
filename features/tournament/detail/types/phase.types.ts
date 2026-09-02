import type { Component } from "vue";
import type { GroupState } from "~/features/tournament/models/group";
import type {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";
import type { TournamentOutletView } from "~/features/tournament/detail/types/navigation.types";

export interface PhaseAlertConfig {
  color: "info" | "success" | "warning" | "neutral";
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
  permissions?: string[] | null;
  detailedState?: TournamentDetailedState;
  tournamentState?: TournamentState;
  finalGroupState?: GroupState;
  hasQualificationStage?: boolean;
}

export type PhaseActionId =
  | "organize"
  | "generateQualificationBrackets"
  | "revertQualificationTeamLinking"
  | "revertQualificationGeneratedBrackets"
  | "confirmQualificationBrackets"
  | "confirmQualificationResults"
  | "confirmFinalStageTeams"
  | "revertFinalGroupTeamsLinks"
  | "approvePlan"
  | "start"
  | "finish"
  | "resume";

export type PhaseActionConfirm =
  | "setup"
  | "generateQualificationBrackets"
  | "revertQualificationTeamLinking"
  | "revertQualificationGeneratedBrackets"
  | "confirmQualificationBrackets"
  | "confirmQualificationResults"
  | "confirmFinalStageTeams"
  | "revertFinalGroupTeamsLinks"
  | "approvePlan"
  | "start";

export type PhaseApi = (
  request: string,
  opts?: { method?: string; body?: unknown },
) => Promise<unknown>;

export interface PhaseAction {
  id: PhaseActionId;
  label: string;
  icon: string;
  variant?: "solid" | "outline" | "soft";
  color?: "primary" | "neutral" | "success" | "warning" | "error";
  confirm?: PhaseActionConfirm;
  canExecute: (ctx: TournamentPhaseContext) => boolean;
  service: (
    ctx: TournamentPhaseContext,
    api: PhaseApi,
    extra?: unknown,
  ) => Promise<void>;
}

export type PhaseManageRoute = TournamentOutletView | "bracket" | null;

export interface PhaseLifecycleConfig {
  inlineSummary: Component | null;
  manageRoute: PhaseManageRoute;
  manageLabel: string;
}

export interface PhaseStateConfig {
  label: string;
  ui: PhaseUiConfig;
  view: Component | null;
  lifecycle: PhaseLifecycleConfig;
  actions: PhaseAction[];
}
