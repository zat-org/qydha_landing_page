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
  WaitingApproval = "WaitingApproval",
  Withdrawn = "Withdrawn",
}
export interface TournamentJoinRequest {
  id: string;
  ownerId: string;
  ownerUserName: string;
  type: TournamentJoinRequestType;
  teammateId: string | null;
  teammateUserName: string | null;
  teamName: string | null;
  createdAt: Date|string;
  state: TournamentJoinRequestState;
}
export interface GetTournamentJoinRequestResponse {
  items: TournamentJoinRequest[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPervious: boolean;
  hasNext: boolean;
}
