import type { InfluncerCode } from "./influncerCode";
import type { IPromoCode } from "./PromoCode";
import type { IBoardSettings } from "./BoardSettings";
import type { IPurchase } from "./purchase";

export enum Privilege {
  Admin = "Admin",
  Owner = "Owner",
  Moderatore = "Moderatore",
  ServiceAccount = "ServiceAccount",
  User = "User",
}
// for auth user
export interface IUserData {
  boardsLinks: {
    baloot: string;
    hand: string;
  };
  boardSettings: IBoardSettings;
  jwtToken: string;
  user: User;
}

// for single user detail data

export interface ISingleUser {
  influencerCodes: InfluncerCode[];
  promoCodes: IPromoCode[];
  purchases: IPurchase[];
  user: User;
}

export interface UserPlayer {
  id?: number;
  playerId?: string | null;
  name: string;
  url?: string | null;
  originalUrl?: string | null;
}

export interface User {
  id: string;
  username: string;
  name: any;
  phone: string;
  email: any;
  birthDate: any;
  createdOn: string;
  lastLogin: string;
  avatarUrl: any;
  expireDate: string;
  roles: string[];
}

/** GET /users/me — `players` is a sibling of `user`, not nested. */
export interface IMeUser {
  user: User;
  players: UserPlayer[];
  generalSettings?: GeneralSettings;
  handSettings?: HandSettings;
  balootSettings?: BalootSettings;
  boardsLinks?: {
    baloot: string;
    hand: string;
  };
}
export interface MinUser {
  id: string;
  username: string;
  name: any;
  phone: string;
  avatarUrl: any;
}

export interface GeneralSettings {
  enableVibration: boolean;
}

export interface HandSettings {
  roundsCount: number;
  maxLimit: number;
  teamsCount: number;
  playersCountInTeam: number;
  winUsingZat: boolean;
  takweeshPoints: number;
}

export interface BalootSettings {
  isFlipped: boolean;
  isAdvancedRecording: boolean;
  isSakkahMashdodahMode: boolean;
  showWhoWonDialogOnDraw: boolean;
  isNumbersSoundEnabled: boolean;
  isCommentsSoundEnabled: boolean;
  isEkakShown: boolean;
  isAklatShown: boolean;
  sakkasCount: number;
}

