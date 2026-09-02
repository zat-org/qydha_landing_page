import type { TournamentDetailedState } from "~/features/tournament/models/tournament";

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

/** GET /tournaments/{id}/tournament-team-join-requests — organizer list. */
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
  InWaitingList = "InWaitingList",
  WithdrawnFromWaitingList = "WithdrawnFromWaitingList",
  WithdrawnAfterApproval = "WithdrawnAfterApproval",
  ApprovedFromWaitingList = "ApprovedFromWaitingList",
}

export interface GetTeamJoinRequestsParams {
  pageNumber?: number;
  pageSize?: number;
  searchToken?: string | null;
  /** Repeated `getOnlyStates` query keys. Omit for backend default. */
  getOnlyStates?: TeamJoinRequestWorkflowState[];
  useSelectedQualificationsPlaceIdFilter?: boolean;
  selectedQualificationsPlaceId?: string | null;
  assignedPlaceId?: string | null;
  /** When true, filter assignedPlaceId=null (empty query value). */
  useAssignedPlaceNullFilter?: boolean;
}












export interface TeamJoinRequestListItem {
  joinRequestId: string;
  tournamentId: string;
  tournamentName: string;
  tournamentDetailedState: TournamentDetailedState;
  teamName: string;
  state: TeamJoinRequestWorkflowState;
  createdAt: string;
  selectedQualificationsPlaceId: string | null;
  assignedPlaceId: string | null;
  acceptsWaitingListPlacement: boolean;
  creatorId: string;
  creatorUsername: string;
  creatorName: string | null;
  creatorAge: number | null;
  teammateId: string;
  teammateUsername: string;
  teammateName: string | null;
  teammateAge: number | null;
  /** Legacy fields — may be absent on newer API payloads */
  requesterUserId?: string;
  creatorBirthDate?: string | null;
  teammateBirthDate?: string | null;
  overallStatus?: string;
}

export interface GetTeamJoinRequestsResponse {
  items: TeamJoinRequestListItem[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  /** Legacy typo from older API */
  hasPervious?: boolean;
}

export type TeamJoinRequestUpdateSelectionType =
  | "SelectedIds"
  | "RandomRequests"
  | "AllApplicable";

export interface UpdateTournamentTeamJoinRequestsRequest {
  updateSelectionType: TeamJoinRequestUpdateSelectionType;
  joinRequestIds: string[];
  randomRequestsCount: number;
  targetedPlaceId: string | null;
}

export type TeamJoinRequestPatchAction =
  | "cancel"
  | "revert-cancel"
  | "consider"
  | "revert-consideration"
  | "move-to-waiting-list"
  | "revert-waiting-list"
  | "approve";

export const TEAM_JOIN_STATE_LABEL: Record<TeamJoinRequestWorkflowState, string> = {
  [TeamJoinRequestWorkflowState.WaitingTeammateAcceptance]: "بانتظار قبول الزميل",
  [TeamJoinRequestWorkflowState.CanceledByCreator]: "ملغى من المنشئ",
  [TeamJoinRequestWorkflowState.RejectedByTeammate]: "مرفوض من الزميل",
  [TeamJoinRequestWorkflowState.WaitingOrganizerConsideration]: "بانتظار الموافقة الأوليه",
  [TeamJoinRequestWorkflowState.WaitingOrganizerApproval]: "بانتظار موافقة النهائية",
  [TeamJoinRequestWorkflowState.CanceledByOrganizer]: "ملغى من المنظم",
  [TeamJoinRequestWorkflowState.ApprovedByOrganizer]: "تمت الموافقة النهائية",
  [TeamJoinRequestWorkflowState.Withdrawn]: "منسحب",
  [TeamJoinRequestWorkflowState.Expired]: "منتهي",
  [TeamJoinRequestWorkflowState.InWaitingList]: "قائمة الانتظار",
  [TeamJoinRequestWorkflowState.WithdrawnFromWaitingList]: "انسحب من قائمة الانتظار",
  [TeamJoinRequestWorkflowState.WithdrawnAfterApproval]: "انسحب بعد الموافقة",
  [TeamJoinRequestWorkflowState.ApprovedFromWaitingList]: "مقبول من قائمة الانتظار",
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
  [TeamJoinRequestWorkflowState.InWaitingList]: "info",
  [TeamJoinRequestWorkflowState.WithdrawnFromWaitingList]: "neutral",
  [TeamJoinRequestWorkflowState.WithdrawnAfterApproval]: "warning",
  [TeamJoinRequestWorkflowState.ApprovedFromWaitingList]: "success",
};

/** @deprecated Use getOnlyStates on GetTeamJoinRequestsParams */
export const TEAM_JOIN_MAIN_TAB_STATES: TeamJoinRequestWorkflowState[] = Object.values(
  TeamJoinRequestWorkflowState,
).filter((s) => s !== TeamJoinRequestWorkflowState.WaitingOrganizerApproval);
