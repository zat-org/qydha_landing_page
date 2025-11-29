export enum GroupState {
  Created = "Created",
  TeamsLinking = "TeamsLinking",
  MatchesGenerated = "MatchesGenerated",
  MatchesRunning = "MatchesRunning",
  MatchesFinished = "MatchesFinished",
}

export enum GroupType {
  Final = "Final",
  Staging = "Staging",
}

export interface Group {
  id: string;
  name: string;
  checkInAt: string;
  startPlayAt: string;
  type: string;
  withThirdPlaceMatch: boolean;
  state: GroupState;
}

export interface DetailGroup {
  checkInAt: string;
  id: string;
  name: string;
  startPlayAt: string;
  state: GroupState;
  teams: {
    id: string;
    name: string;
    players: {
      id: string;
      name: string;
      tournamentId: string;
    }[];
    tournamentId: string;
  }[];
  tournamentId: string;
  type: GroupType;
  withThirdPlaceMatch: boolean;
}
export interface RoundGroupDetails {
  id: string;
  name: string;
  type: string;
  checkInAt: string;
  startPlayAt: string;
  withThirdPlaceMatch: true;
  state: GroupState;
  rounds: {
    id: string;
    name: string;
    startAt: string;
    gameSettings: {
      isFlipped: true;
      isAdvancedRecording: true;
      isSakkahMashdodahMode: true;
      showWhoWonDialogOnDraw: true;
      isNumbersSoundEnabled: true;
      isCommentsSoundEnabled: true;
      isEkakShown: true;
      isAklatShown: true;
      sakkasCount: 1;
      isVoiceRecording: true;
    };
    matches: Match[];
  }[];
}

export interface Team {
  groupId: string;
  id: string;
  name: string;
  state: string;
}

export interface CreateMatch {
  usedTables: string[];
  defaultGameInterval: string;
  defaultGameSettings: {
    isFlipped: boolean;
    isAdvancedRecording: boolean;
    isSakkahMashdodahMode: boolean;
    showWhoWonDialogOnDraw: boolean;
    isNumbersSoundEnabled: boolean;
    isCommentsSoundEnabled: boolean;
    isEkakShown: boolean;
    isAklatShown: boolean;
    sakkasCount: number;
    isVoiceRecording: boolean;
  };
}

export interface Match {
  groupId: string;
  id: string;
  level: number;
  name: string;
  matchQualifyThemTeamId: null | string;
  matchQualifyThemTeamName: null | string;
  matchQualifyThemTeam: undefined | Match;
  matchQualifyThemTeamFrom: string | null;

  matchQualifyUsTeamId: null | string;
  matchQualifyUsTeamName: null | string;
  matchQualifyUsTeam: undefined | Match;
  matchQualifyUsTeamFrom: string | null;

  qydhaGameId: string;

  referee: { id: string; username: string };
  startAt: string;
  state: string;
  tableName: string;
  tableId: string;
  usTeamId: string;
  usTeamName: string;
  isMarked: boolean;
  roundName: string;
  themTeamId: string;
  themTeamName: string;

  winner: string | null;
}
export interface MatchWithPlayer extends Match {
  player1?: { id: string; name: string; winner: boolean | null };
  player2?: { id: string; name: string; winner: boolean | null };
  next?: number | null;
}
