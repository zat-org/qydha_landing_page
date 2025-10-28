import type { TournamentState } from "./tournament";

export enum TournamentType {
  public = "Public",
  private = "Private",
}
export enum TournamentPrizeType {
  one = "One",
  two = "Two",
  three = "Three",
  four = "Four",
}
export enum TournamentPrizeCurrency {
  USD = "USD",
  EGP = "EGP",
  SAR = "SAR",
  AED = "AED",
  EUR = "EUR",
  JOD = "JOD",
  KWD = "KWD",
  TRY = "TRY",
  GBP = "GBP",
}
export enum TournamentRequestState {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Canceled = "Canceled",
}
export enum TournamentRequsetFormType {
  Add = "Add",
  Update = "Update",
}

export interface GetTournamentParams {
  searchToken?: string | null | undefined;
  type?: TournamentType | null | undefined;
  state?: TournamentRequestState | null | undefined;
  pageNumber: number;
  pageSize: number;
}

export interface TournamentPrize {
  isFinancial: boolean;
  isNonFinancial: boolean;
  type: TournamentPrizeType;
  financialPrizeAmount: number;
  financialPrizeCurrency: TournamentPrizeCurrency;
  nonFinancialPrizes: string[];
}

export interface TournamentCreationRequest {
  title: string;
  description: string;
  logo: File | undefined;
  contactPhone: string;
  isContactPhoneCall: boolean;
  isContactPhoneWhatsapp: boolean;
  sponsors: File[];
  startAt: string;
  endAt: string;
  type: TournamentType;
  tournamentPrivatePassword?: string;
  isAddPlayersByQydha: boolean;
  joinRequestEndAt: string;
  joinRequestMaxCount: number;
  joinRequestStartAt: string;
  teamsCount: number;
  tablesCount: number;
  location: {
    longitude: number;
    latitude: number;
  };
  locationDescription: string;
  prizes: TournamentPrize[];
  rules: string[];
}
export interface UpdateTournamentCreationRequest {
  title: string;
  description: string;
  logo: File | undefined;
  remainingSponsorsUrls: string[];
  contactPhone: string;
  isContactPhoneCall: boolean;
  isContactPhoneWhatsapp: boolean;
  sponsors: File[];
  startAt: string;
  endAt: string;
  type: TournamentType;
  tournamentPrivatePassword?: string;
  isAddPlayersByQydha: boolean;
  joinRequestEndAt?: string;
  joinRequestMaxCount?: number;
  joinRequestStartAt?: string;
  teamsCount: number;
  tablesCount: number;
  location: {
    longitude: number;
    latitude: number;
  };
  locationDescription: string;
  prizes: TournamentPrize[];
  rules: string[];
}

export interface TournamentRequest {
  id: string;
  title: string;
  type: TournamentType;
  logo: string;
  createdAt: string;
  state: TournamentRequestState;
  createdByUserName: string | null;
  createdByUserId: string;
}
export interface getTournamentResponse {
  data: {
    items: TournamentRequest[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPervious: boolean;
    hasNext: boolean;
  };
}

export interface DetailTournamentRequest {
  id: string;
  title: string;
  description: string;
  logoUrl: string;
  sponsorsUrls: string[];
  contactPhone: string;
  isContactPhoneCall: boolean;
  isContactPhoneWhatsapp: boolean;
  startAt: string;
  endAt: string;
  type: TournamentType;
  isAddPlayersByQydha: boolean;
  teamsCount: number;
  tablesCount: number;
  tournamentPrivatePassword: string | null;
  location: {
    longitude: number;
    latitude: number;
  };
  locationDescription: string;
  prizes: TournamentPrize[];
  rules: string[];
  createdAt: string;
  approvedByUserId: string | null;
  approvedByUserName: string | null;
  approvedAt: string | null;
}
