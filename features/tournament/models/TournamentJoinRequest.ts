export interface GetTournamentJoinRequestParams {
  type: TournamentJoinRequestType | null;
  state: TournamentJoinRequestState | null;
  pageNumber: number;
  pageSize: number;
}

export enum TournamentJoinRequestType {
  Single = "Single",
  Team = "Team",
}

export enum TournamentJoinRequestState {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  InConsideration = "InConsideration",
  WaitingApproval = "WaitingApproval",
  Withdrawn = "Withdrawn",
}

export interface TeamJoinRequest {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Team;
  teammateUserName: string;
  teammateId: string;
  teamName: string;
  createdAt: Date | string;
  state: TournamentJoinRequestState;
}

export interface SingleJoinRequest {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Single;
  state: TournamentJoinRequestState;
  createdAt: Date | string;
}

export type TournamentJoinRequest = TeamJoinRequest | SingleJoinRequest;

export interface AcceptedTeamFromSingle {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Team;
  teammateUserName: string;
  teammateId: string;
  teamName: string;
  createdAt: Date | string;
  state: TournamentJoinRequestState;
  /** When present, this accepted row came from merging two single requests */
  mergedFromIds?: [string, string];
  originalType?: TournamentJoinRequestType;
}

export interface AcceptedTeamFromTeam {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Team;
  teammateUserName: string;
  teammateId: string;
  teamName: string;
  createdAt: Date | string;
  state: TournamentJoinRequestState;
  mergedFromIds?: [string, string];
  originalType?: TournamentJoinRequestType;
}

export type AcceptedTeam = AcceptedTeamFromSingle | AcceptedTeamFromTeam;

export interface GetTournamentJoinRequestResponse {
  items: TournamentJoinRequest[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPervious: boolean;
  hasNext: boolean;
}

export interface GetTournamentAcceptedTeamsJoinRequestResponse {
  items: AcceptedTeam[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPervious: boolean;
  hasNext: boolean;
}

/** GET /tournaments/{id}/tournament-team-join-requests — `GetOnlyStates` query (teams only). */
export enum TeamJoinRequestWorkflowState {
  WaitingTeammateAcceptance = "WaitingTeammateAcceptance",
  CanceledByCreator = "CanceledByCreator",
  RejectedByTeammate = "RejectedByTeammate",
  WaitingOrganizerConsideration = "WaitingOrganizerConsideration",
  CanceledByOrganizer = "CanceledByOrganizer",
  WaitingOrganizerApproval = "WaitingOrganizerApproval",
  ApprovedByOrganizer = "ApprovedByOrganizer",
  Withdrawn = "Withdrawn",
  Expired = "Expired",
}

export interface GetTeamJoinRequestsParams {
  pageNumber: number;
  pageSize: number;
  /** Sent as repeated `GetOnlyStates` query keys. */
  GetOnlyStates: TeamJoinRequestWorkflowState[];
}

export interface TeamJoinRequestListItem {
  id: string;
  ownerId?: string;
  ownerUserName?: string;
  teammateId?: string;
  teammateUserName?: string;
  teamName?: string;
  createdAt: string;
  state: TeamJoinRequestWorkflowState | string;
}

export interface GetTeamJoinRequestsResponse {
  items: TeamJoinRequestListItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPervious: boolean;
  hasNext: boolean;
}

export type TeamJoinRequestPatchAction =
  | "cancel"
  | "revert-cancel"
  | "consider"
  | "revert-consideration"
  | "approve";

export const TEAM_JOIN_STATE_LABEL: Record<TeamJoinRequestWorkflowState, string> = {
  [TeamJoinRequestWorkflowState.WaitingTeammateAcceptance]: "بانتظار قبول الزميل",
  [TeamJoinRequestWorkflowState.CanceledByCreator]: "ملغى من المنشئ",
  [TeamJoinRequestWorkflowState.RejectedByTeammate]: "مرفوض من الزميل",
  [TeamJoinRequestWorkflowState.WaitingOrganizerConsideration]: "قيد دراسة المنظم",
  [TeamJoinRequestWorkflowState.CanceledByOrganizer]: "ملغى من المنظم",
  [TeamJoinRequestWorkflowState.WaitingOrganizerApproval]: "بانتظار موافقة المنظم",
  [TeamJoinRequestWorkflowState.ApprovedByOrganizer]: "تمت الموافقة",
  [TeamJoinRequestWorkflowState.Withdrawn]: "منسحب",
  [TeamJoinRequestWorkflowState.Expired]: "منتهي",
};

export const TEAM_JOIN_STATE_COLOR: Record<TeamJoinRequestWorkflowState, string> = {
  [TeamJoinRequestWorkflowState.WaitingTeammateAcceptance]: "warning",
  [TeamJoinRequestWorkflowState.CanceledByCreator]: "neutral",
  [TeamJoinRequestWorkflowState.RejectedByTeammate]: "error",
  [TeamJoinRequestWorkflowState.WaitingOrganizerConsideration]: "info",
  [TeamJoinRequestWorkflowState.CanceledByOrganizer]: "neutral",
  [TeamJoinRequestWorkflowState.WaitingOrganizerApproval]: "warning",
  [TeamJoinRequestWorkflowState.ApprovedByOrganizer]: "success",
  [TeamJoinRequestWorkflowState.Withdrawn]: "neutral",
  [TeamJoinRequestWorkflowState.Expired]: "neutral",
};

/** States listed on the main tab (every workflow state except «consideration» bucket). */
export const TEAM_JOIN_MAIN_TAB_STATES: TeamJoinRequestWorkflowState[] = Object.values(
  TeamJoinRequestWorkflowState,
).filter((s) => s !== TeamJoinRequestWorkflowState.WaitingOrganizerConsideration);
