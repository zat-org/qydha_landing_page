export interface Group {
  id: number;
  name: string;
  checkInAt: string;
  startPlayAt: string;
}
export interface Team {
  groupId: number;
  id: number;
  name: string;
  state: string;
}

export interface Match {
  groupId: number;
  id: number;
  level: number;
  matchQualifyThemTeamId: null | number;
  matchQualifyThemTeam: undefined | Match;
  matchQualifyUsTeamId: null | number;
  matchQualifyUsTeam: undefined | Match;
  qydhaGameId: null | string;
  refereeId: null | string;
  startAt: string;
  state: string;
  tableNumber: number;
  usTeamId: number;
  usTeam: {
    id: number;
    name: string;
    state: string;
    groupId: number;
  };
  themTeamId: number;
  themTeam: {
    id: number;
    name: string;
    state: string;
    groupId: number;
  };
  winner: string | null;
}
