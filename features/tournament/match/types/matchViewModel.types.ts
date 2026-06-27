import type { Match, MatchLifecycleState } from "~/features/tournament/models/group";
import type { MatchAction } from "./matchAction.types";

export type MatchStatusIcon = "sleep" | "running" | "ended";

export type MatchViewModel = {
  match: Match;
  cardToneClass: string;
  statusBadgeText: string;
  statusBadgeClass: string;
  nodeStatusBadgeClass: string;
  matchStatusText: string;
  matchInfoTooltip: string;
  statusIcon: MatchStatusIcon;
  showInfoButton: boolean;
  firstTeamClasses: string;
  secondTeamClasses: string;
  firstTeamNameClasses: Record<string, boolean>;
  secondTeamNameClasses: Record<string, boolean>;
  adminActions: MatchAction[];
  state: MatchLifecycleState;
  canEdit: boolean;
  canReset: boolean;
  canBack: boolean;
  isFinalPlacement: boolean;
};




export type MatchViewContext = {
  isGroupRunning: boolean;
  hasStaffOrAdminPrivileges: boolean;
};

export type { MatchLifecycleState };
