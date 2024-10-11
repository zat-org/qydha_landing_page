export interface Group {
  id: number;
  name: string;
  checkInAt: string;
  startPlayAt: string;
  isFinalGroup: boolean;
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
  name: string;
  matchQualifyThemTeamId: null | number;
  matchQualifyThemTeam: undefined | Match;
  matchQualifyThemTeamFrom: string | null;

  matchQualifyUsTeamId: null | number;
  matchQualifyUsTeam: undefined | Match;
  matchQualifyUsTeamFrom: string | null;

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
