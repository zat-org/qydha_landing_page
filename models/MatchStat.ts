interface IStartAt {
    start_at: Date
}

enum MatchState {
    Done = "انتهت",
    Live = "مباشر",
    Upcoming = "لم تبدأ بعد",
    Undefined = "لم يحدد بعد"
}

interface Person {
    id: number,
    name: string,
    image: string
}
interface KeyNamePair {
    value: number,
    name: string
}
interface IMatchFullDetails extends IStartAt {
    id:number, 
    startEstimationAt :Date | null,
    endEstimationAt :Date | null , 
    leagueName: string,
    state: MatchState,
    url: string,
    numberOfRounds: number,
    tournament: string,
    referees: Person[],
    team1: {
        id: number,
        name: string,
        score: number,
        logo: string,
        coach: Person | null,
        players: Person[],
        statistics: KeyNamePair[]
    },
    team2: {
        id: number,
        name: string,
        score: number,
        coach: Person | null,
        logo: string,
        players: Person[],
        statistics: KeyNamePair[]
    },
}

export type { IMatchFullDetails, Person };