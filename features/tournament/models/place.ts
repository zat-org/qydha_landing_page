export type DomainLocation = {
  latitude: number;
  longitude: number;
};

export type CreateTournamentPlaceDto = {
  startAt: string;
  endAt: string;
  location: DomainLocation;
  locationDescription: string;
  availableTablesCount: number;
};

export type TournamentPlaceType =
  | "QualificationStagePlace"
  | "FinalStagePlace";

export type GetTournamentPlace = {
  id: string;
  tournamentId: string;
  type: TournamentPlaceType;
  location: DomainLocation;
  locationDescription: string;
  availableTablesCount: number;
  startAt: string;
  endAt: string;
};

export type QualificationsStageInfo = {
  places: CreateTournamentPlaceDto[];
};

export type SetupQualificationGroup = {
  checkInAt: string;
  startAt: string;
  groupName: string;
  qualifyingTeams: number;
  placeId: string;
};

export function createEmptyTournamentPlace(): CreateTournamentPlaceDto {
  return {
    startAt: "",
    endAt: "",
    location: { latitude: 0, longitude: 0 },
    locationDescription: "",
    availableTablesCount: 1,
  };
}
