export type DomainLocation = {
  latitude: number;
  longitude: number;
};

export type TournamentStageType = "Final" | "Qualification";

export type CreateTournamentPlaceDto = {
  startAt: string;
  endAt: string;
  location: DomainLocation;
  locationDescription: string;
  competingTeamsCount: number;
  availableTablesCount: number;
};

export type GetTournamentPlace = {
  id: string;
  tournamentId: string;
  location: DomainLocation;
  locationDescription: string;
  competingTeamsCount: number;
  availableTablesCount: number;
  startAt: string;
  endAt: string;
  stageId: string;
  stageType: TournamentStageType;
  connectedTablesCount: number;
  connectedGroupsCount: number;
  connectedJoinRequestsCount: number;
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
    competingTeamsCount: 1,
    availableTablesCount: 1,
  };
}
