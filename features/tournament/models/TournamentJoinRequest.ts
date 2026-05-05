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
