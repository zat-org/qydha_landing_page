import type { TournamentType } from "./tournamenetType";
import type { TournamentModerator } from "./tournamentModeratorr";
import type { TournamentOwner } from "./tournamentOwner";
import type { TournamentPrize } from "./tournamentPrize";
import type { Privilege } from "./user";

export interface ITournamentCreate {
  name: string;
  description: string;
  city: string;
  location: {
    longitude: number;
    latitude: number;
  };
  prizes: string[];
  prizesCurrency: string;
  startAt: string | Date;
  endAt: string | Date;
  ownerId: string;
}

export interface ITournamentUpdate {
  name: string;
  description: string;
  city: string;
  location: {
    longitude: number;
    latitude: number;
  };
  prizes: string[];
  prizesCurrency: string;
  startAt: string | Date;
  endAt: string | Date;
}
///////

export interface TournamentUpdate {
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
  };
  locationDescription: string;
  prizes: TournamentPrize[];
  startAt: string;
  endAt: string;
  showInQydha: boolean;
  joinRequestStartAt?: string ;
  joinRequestEndAt?: string ;
  joinRequestMaxCount?: number ;
  addPlayersByQydha: boolean;
  // addPlayesrByQydha: boolean;
  teamsCount: number;
  tablesCount: number;
  contactPhone: string;
  isContactPhoneCall: boolean;
  isContactPhoneWhatsapp: boolean;
  tournamentType: TournamentType;
  tournamentPrivatePassword?: string ;
  logo: File | undefined;
  remainingSponsorsUrls: string[];
  sponsors: File[] ;
  rules: string[];
}
export interface Tournament {
  id: string;
  title: string;
  description: string;
  city: string;
  location: {
    longitude: number;
    latitude: number;
  };
  prizes: TournamentPrize[];
  startAt: string;
  endAt: string;
  state: TournamentState;
  showInQydha: boolean;
  logoUrl: string;
  bracketLink: string;
  tournamentType: TournamentType;
  contactPhone: string;
  isContactPhoneWhatsapp: boolean;
  isContactPhoneCall: boolean;
}

export interface DetailTournament {
  tournament: {
    id: string;
    title: string;
    description: string;
    locationDescription: string;
    location: {
      longitude: number;
      latitude: number;
    };
    prizes: TournamentPrize[];
    startAt: string;
    endAt: string;
    state: TournamentState;
    showInQydha: boolean;
    logoUrl: string;
    bracketLink: string;
    owner: TournamentOwner;
    moderators: TournamentModerator[];
    joinRequestStartAt?: string;
    joinRequestEndAt?: string;
    joinRequestMaxCount: null;
    addPlayersByQydha: boolean;
    expectedTeamsCount: number;
    expectedTablesCount: number;
    contactPhone: string;
    isContactPhoneWhatsapp: boolean;
    isContactPhoneCall: boolean;
    tournamentType: TournamentType;
    tournamentRules: string[];
    sponsors: string[];
    tournamentPrivatePassword: null | string;
    hasQualificationsStage: boolean;



  };
  requesterPrivilege: {
    privilege: string;
    permissions: string[];
  };
}

// export interface DetailTournament {
//   id: string;
//   name: string;
//   description: string;
//   city: string;
//   startAt: string;
//   endAt: string;
//   state: string;
//   showInQydha: boolean;
//   logoUrl: null | string;
//   bracketLink: string;
//   joinRequestStartAt: null | string;
//   joinRequestEndAt: null | string;
//   joinRequestMaxCount: null | number;
//   addPlayesrByQydha: true;
//   addPlayersByQydha: true;
//   expectedTeamsCount: number;
//   expectedTablesCount: number;
//   contactPhone: string;
//   isContactPhoneWhatsapp: boolean;
//   isContactPhoneCall: boolean;
//   tournamentType: TournamentType;
//   sponsors: string[];
//   tournamentPrivatePassword: string | null;
//   location: {
//     longitude: number;
//     latitude: number;
//   };
//   prizes: TournamentPrize[];
//   owner: TournamentOwner;
//   moderators: TournamentModerator[];
//   requesterPrivilege: {
//     privilege: string;
//     permissions: string[];
//   };
// }

export interface getTournamentResponse {
  data: {
    items: Tournament[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPervious: boolean;
    hasNext: boolean;
  };
}

export interface GetTournamentParams {
  States?: TournamentState[] | undefined;
  OrderByStartAtDirection?: OrderByStartAtDirection | undefined;
  PageNumber: number;
  PageSize: number;
}

export enum TournamentState {
  Upcoming = "Upcoming",
  Running = "Running",
  Finished = "Finished",
}

export enum OrderByStartAtDirection {
  ASC = "ASC",
  DESC = "DESC ",
}
