export interface IMainApplicationStatics {
  data: {
    registeredUsers: number;
    allUsers: number;
  };
  message: string;
}

export interface IBalootStatics {
  data: {
    gamesCount: {
      gamesCount: number;
    };
    gameUsersStatistics: {
      createdAt: string;
      devicesCount: number;
      usersCount: number;
      anonymousGamesCount: number;
      registeredUserGamesCount: number;
      anotherGamesCount: number;
    }[];
    sakkasCountPercentage: {
      maxSakkaPerGame: number;
      percentage: number;
    }[];
    averageSakkasPerUser: {
      sakkaCount: number;
      usersCount: number;
    }[];
    sakkasFinishedStats: {
      finishedCount: number;
      notFinishedCount: number;
    };
    balootSettings: {
      numbersSoundEnabled: number;
      numbersSoundDisabled: number;
      commentsSoundEnabled: number;
      commentsSoundDisabled: number;
      sakkahMashdodahEnabled: number;
      sakkahMashdodahDisabled: number;
      advancedRecordingEnabled: number;
      advancedRecordingDisabled: number;
      flippedEnabled: number;
      flippedDisabled: number;
    };
    balootGamesCountWithLocation: {
      cityName: string;
      countryName: string;
      latitude: number;
      longitude: number;
      gamesCount: number;
    }[];
    removeMoshtara: {
      sakkaNumber: number;
      removeMoshtaraCount: number;
    }[];
  };
  message: string;
}
