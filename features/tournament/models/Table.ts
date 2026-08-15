export interface ITable {
  id: string;
  name: string;
  tournamentId: string;
  placeId?: string;
  connectedGamesCount: number;
}

export interface ITableCreate {
  name: string;
  placeId?: string;
}
