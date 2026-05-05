import type { MinUser } from "~/models/user";

export interface IModeratorCreate {
  username: string;
  permissions: string[];
}

export interface IModerator {
  user: MinUser;
  permissions: string[];
}

export interface TournamentModerator {
  user: MinUser;
  permissions: string[];
}

export interface IModeratorUpdate {
  permissions: string[];
}
