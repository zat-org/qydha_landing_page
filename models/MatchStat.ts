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
  winner: string;
  gameInterval: number;
  sakkas: [
    {
      id: 72206;
      state: "Ended";
      isMashdoda: false;
      winner: "Us";
      usSakkaScore: 155;
      themSakkaScore: 75;
      moshtaras: {
        id: number;
        usAbnat: number;
        themAbnat: number;
        state: string;
      }[];
    }
  ];
  location: {
    longitude: number   ;
    latitude: number;
  };
}
