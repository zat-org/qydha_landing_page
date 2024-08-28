export interface IMathStat {
  statistics: {
    usStatistics: {
      //   playedSakkas: number;
      //   winnedSakkas: number;
      //   lostSakka: number;
      moshtaraSunCount: number;
      moshtaraHokmCount: number;
      wonMoshtaraCount: number;
      lostMoshtaraCount: number;
      ekak: number;
      aklat: number;
      sra: number;
      khamsen: number;
      me2a: number;
      rob3ome2a: number;
      baloot: number;
      sunKaboot: number;
      hokmKaboot: number;
    };
    themStatistics: {
      //   playedSakkas: number;
      //   winnedSakkas: number;
      //   lostSakka: number;
      moshtaraSunCount: number;
      moshtaraHokmCount: number;
      wonMoshtaraCount: number;
      lostMoshtaraCount: number;
      ekak: number;
      aklat: number;
      sra: number;
      khamsen: number;
      me2a: number;
      rob3ome2a: number;
      baloot: number;
      sunKaboot: number;
      hokmKaboot: number;
    };
  };
}

export interface IMatchData {
  id: string;
  createdAt: string;
  startedAt: string;
  endedAt: string;
  gameMode: string;
  state: string;
  usName: string;
  themName: string;
  usGameScore: number;
  themGameScore: number;
  maxSakkaPerGame: number;
  winner: string|null;//us --them 
  gameInterval: number;
  sakkas: {
    id: number;
    state: string;
    isMashdoda: boolean;
    winner: string;
    usSakkaScore: number;
    themSakkaScore: number;
    moshtaras: {
      id: number;
      usAbnat: number;
      themAbnat: number;
      state: string;
    }[];
  }[];
  location: {
    longitude: number;
    latitude: number;
  };
}
