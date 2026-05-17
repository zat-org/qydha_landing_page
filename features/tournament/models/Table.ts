export interface ITable {
  id: string;
  name: string;
  tournamentId: string;
  connectedGamesCount:number
}

export interface ITableCreate {
  name: string;
}
