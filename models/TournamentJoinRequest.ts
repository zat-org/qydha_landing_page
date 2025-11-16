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
// team join request 
// single join request 

export interface TeamJoinRequest {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Team;
  teammateUserName: string;
  teammateId: string;
  teamName: string ;
  createdAt: Date|string;
  state: TournamentJoinRequestState;
}
export interface SingleJoinRequest {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Single;
  state: TournamentJoinRequestState;
  createdAt: Date|string;
}

export type TournamentJoinRequest = TeamJoinRequest | SingleJoinRequest;




export interface  AcceptedTeamFromSingle {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Team;
  teammateUserName: string;
  teammateId: string;
  teamName: string ;
  createdAt: Date|string;
  state: TournamentJoinRequestState;
  // originalType: TournamentJoinRequestType.Single;
  // mergedFromIds: string[];
}
export interface AcceptedTeamFromTeam {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType.Team;
  teammateUserName: string;
  teammateId: string;
  teamName: string ;
  createdAt: Date|string;
  state: TournamentJoinRequestState;
  // originalType: TournamentJoinRequestType.Team;
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