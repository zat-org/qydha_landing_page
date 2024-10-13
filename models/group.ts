export interface Group {
  id: number;
  name: string;
  checkInAt: string;
  startPlayAt: string;
  type: string;
}
export interface Team {
  groupId: number;
  id: number;
  name: string;
  state: string;
}

export interface Match {
  groupId: number;
  id: string;
  level: number;
  name: string;
  matchQualifyThemTeamId: null | number;
  // matchQualifyThemTeamName: null |string;
  matchQualifyThemTeam: undefined | Match;
  matchQualifyThemTeamFrom: string | null;

  matchQualifyUsTeamId: null | number;
  // matchQualifyUsTeamName: null | string;
  matchQualifyUsTeam: undefined | Match;
  matchQualifyUsTeamFrom: string | null;

  qydhaGameId:   string;

  referee: {id: string, username: string}
  startAt: string;
  state: string;
  tableName: string;
  tableId: string;
  usTeamId: number;
  usTeamName: string;
  isMarked:boolean ;
  roundName:string
  themTeamId: number;
  themTeamName: string;

  winner: string | null;
}
export interface MatchWithPlayer extends Match{
player1?:{id:string ,name:string,winner:boolean|null},
player2?:{id:string ,name:string,winner:boolean|null},
next?:number|null

}