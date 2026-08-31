import type { PlayerState } from "./Player";
import type { TournamentStageType } from "./place";
import type { MinUser } from "~/models/user";

export type TeamStageEntryType = "Direct" | "Qualified";

export interface TeamStageEntry {
  stageId: string;
  stageType: TournamentStageType;
  placeId: string;
  entryType: TeamStageEntryType;
}

export interface IPlayerCreate {
  name: string;
  phone?: string | null;
  email?: string | null;
  qydhaUsername?: string | null;
  additionalData?: Record<string, unknown>;
}

export interface ITeamCreate {
  name: string;
  placeId: string;
  additionalData?: Record<string, unknown>;
  players: IPlayerCreate[];
}

export interface ITeam {
  id: number | string;
  name: string;
  players: IPlayer[];
  tournamentId: number | string;
  status?: PlayerState | string;
  additionalData?: Record<string, unknown>;
  teamJoinRequestId?: string | null;
  hasGroupLink?: boolean;
  groupLinks?: unknown[];
  stageEntries?: TeamStageEntry[];
}

export interface IPlayer {
  email: string;
  id: string;
  name: string;
  phone: string;
  qydhaUserData?: MinUser;
  tournamentId: string;
  teamId: number | string | null;
  teamName: null | string;
  state?: PlayerState | string;
  additionalData?: Record<string, unknown>;
}
