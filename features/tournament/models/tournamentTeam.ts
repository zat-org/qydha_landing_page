import type { PlayerState } from "./Player";
import type { MinUser } from "~/models/user";

export interface ITeamCreate {
  name: string;
  players: {
    name: string;
    phone: string;
    email: string;
    qydhaUsername: string;
  }[];
}

export interface ITeam {
  id: number;
  name: string;
  players: IPlayer[];
  tournamentId: number;
  status?: PlayerState | string;
  additionalData?: any;
  teamJoinRequestId: string | null;
}

export interface IPlayerCreate {
  email: string;
  name: string;
  phone: string;
  qydhaUsername: string;
}

export interface IPlayer {
  email: string;
  id: string;
  name: string;
  phone: string;
  qydhaUserData: MinUser;
  tournamentId: string;
  teamId: number | null;
  teamName: null | string;
  state?: PlayerState | string;
}
