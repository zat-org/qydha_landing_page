export interface IMatchUpdate {
  refereeId: string | undefined;
  tableId: string | undefined;
  // startAt: Date | string,
  // roundName: string,
  isMarked: boolean;
}

export interface IUpdateChoicesForMatch {
  
    matchId: string;
    gameId: string;
    groupId: string;
    roundId: string;
    selectedReferee: {
      id: string;
      phone: string;
      name: string | null;
      username: string;
      avatarUrl: string | null;
    };
    availableReferee: {
      id: string;
      phone: string;
      name: string | null;
      username: string;
      avatarUrl: string | null;
    }[];
    selectedTable: {
      id: string;
      name: string;
      tournamentId: string;
    };
    availableTable: {
      id: string;
      name: string;
      tournamentId: string;
    }[];
  
}
