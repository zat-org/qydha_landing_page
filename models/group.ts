export interface Group {
  id: string;
  name: string;
  checkInAt: string;
  startPlayAt: string;
  type: string;
}
export interface Team {
  groupId: string;
  id: string;
  name: string;
  state: string;
}

export interface Match {
  groupId: string;
  id: string;
  level: number;
  name: string;
  matchQualifyThemTeamId: null | string;
  matchQualifyThemTeamName: null |string;
  matchQualifyThemTeam: undefined | Match;
  matchQualifyThemTeamFrom: string | null;

  matchQualifyUsTeamId: null | string;
  matchQualifyUsTeamName: null | string;
  matchQualifyUsTeam: undefined | Match;
  matchQualifyUsTeamFrom: string | null;

  qydhaGameId:   string;

  referee: {id: string, username: string}
  startAt: string;
  state: string;
  tableName: string;
  tableId: string;
  usTeamId: string;
  usTeamName: string;
  isMarked:boolean ;
  roundName:string
  themTeamId: string;
  themTeamName: string;

  winner: string | null;
}
export interface MatchWithPlayer extends Match{
player1?:{id:string ,name:string,winner:boolean|null},
player2?:{id:string ,name:string,winner:boolean|null},
next?:number|null

}