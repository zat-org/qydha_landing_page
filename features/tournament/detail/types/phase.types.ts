import type { Component } from "vue";
import type { GroupState } from "~/features/tournament/models/group";
import type {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";

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
  detailedState?: TournamentDetailedState;
  tournamentState?: TournamentState;
  finalGroupState?: GroupState;
  hasQualificationStage?: boolean;
}

export type PhaseActionId =
  | "organize"
  | "approvePlan"
  | "start"
  | "finish"
  | "resume";

export type PhaseActionConfirm = "setup" | "approvePlan" | "start";

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

export interface PhaseStateConfig {
  label: string;
  ui: PhaseUiConfig;
  view: Component | null;
  actions: PhaseAction[];
}
