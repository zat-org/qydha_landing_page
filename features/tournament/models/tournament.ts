import type { TournamentType } from "./tournamenetType";
import type { TournamentModerator } from "./tournamentModeratorr";
import type { TournamentOwner } from "./tournamentOwner";
import type { TournamentPrize } from "./tournamentPrize";
import type { TournamentPlayerJoinRequestType } from "./tournamentRequest";
import type { Group } from "./group";

// export interface ITournamentCreate {
//   name: string;
//   description: string;
//   city: string;
//   location: {
//     longitude: number;
//     latitude: number;
//   };
//   prizes: string[];
//   prizesCurrency: string;
//   startAt: string | Date;
//   endAt: string | Date;
//   ownerId: string;
// }

// export interface ITournamentUpdate {
//   name: string;
//   description: string;
//   city: string;
//   location: {
//     longitude: number;
//     latitude: number;
//   };
//   prizes: string[];
//   prizesCurrency: string;
//   startAt: string | Date;
//   endAt: string | Date;
// }

// joinRequestStartAt?: string;
// joinRequestEndAt?: string;
// joinRequestMaxCount?: number;
// addPlayersByQydha: boolean;
// allowedJoinRequestType: TournamentPlayerJoinRequestType;
// minimumSubscriptionDays: number;
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
  teamsCount: number;
  tablesCount: number;
  contactPhone: string;
  isContactPhoneCall: boolean;
  isContactPhoneWhatsapp: boolean;
  tournamentType: TournamentType;
  tournamentPrivatePassword?: string;
  logo: File | undefined;
  remainingSponsorsUrls: string[];
  sponsors: File[];
  rules: string[];
  ownerId: string;
}
export interface UpdateJoinRequestSeetingsBody {
  joinRequestStartAt: string;
  joinRequestEndAt: string;
  joinRequestMaxCount: number;
  allowedJoinRequestType: TournamentPlayerJoinRequestType;
  minimumSubscriptionDays: number;
  addPlayersByQydha: boolean;
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
    detailedState: TournamentDetailedState;
    showInQydha: boolean;
    logoUrl: string;
    bracketLink: string;
    statisticsLink: string;
    owner: TournamentOwner;
    moderators: TournamentModerator[];
    joinRequestStartAt?: string | null;
    joinRequestEndAt?: string | null;
    joinRequestMaxCount: number | null;
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
    hasQualificationsStage: boolean | null;
    allowedJoinRequestType: TournamentPlayerJoinRequestType | null;
    minimumSubscriptionDays: number | null;
    groups: Group[];
    winners: TournamentWinner[];
  };
  requesterPrivilege: {
    privilege: string;
    permissions: string[] | null;
  };
}

export interface TournamentWinner {
  teamId: string;
  teamName: string;
  order: number;
}

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

export interface TournamentStatistics {
  matchesCount: number;
  totalGames: number;
  statistics: {
    sra: number;
    baloot: number;
    khamsen: number;
    me2a: number;
    rob3ome2a: number;
    ekak: number;
    aklat: number;
    moshtaraSunCount: number;
    moshtaraHokmCount: number;
    wonMoshtaraCount: number;
    lostMoshtaraCount: number;
    sunKaboot: number;
    hokmKaboot: number;
    playedSakkas: number;
    winnedSakkas: number;
    lostSakka: number;
  };
}

export enum TournamentState {
  Upcoming = "Upcoming",
  Running = "Running",
  Finished = "Finished",
}

/** Dashboard tournament lifecycle (distinct from `TournamentState`). */
export enum TournamentDetailedState {
  Created = "Created",
  ReceivingJoinRequests = "ReceivingJoinRequests",
  ManagingJoinRequests = "ManagingJoinRequests",
  ManagingTeams = "ManagingTeams",
  LinkingFinalGroupTeams = "LinkingFinalGroupTeams",
  ManagingFinalGroupBracket = "ManagingFinalGroupBracket",
  WaitingFinalGroupStarting = "WaitingFinalGroupStarting",
  FinalGroupRunning = "FinalGroupRunning",
  Finished = "Finished",
}

export enum OrderByStartAtDirection {
  ASC = "ASC",
  DESC = "DESC ",
}
