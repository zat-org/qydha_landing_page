import type { MinUser } from "./user"

export interface ITeamCreate {
    name: string,
    // json
    // additionalData:
    // {
    //     additionalProp1: string,
    //     additionalProp2: string,
    //     additionalProp3: string
    // },
    players:
    {
        name: string,
        phone: string,
        email: string,
        // additionalData: {
        //     additionalProp1: string,
        //     additionalProp2: string,
        //     additionalProp3: string
        // },
        qydhaUsername: string
    }[]

}

export interface ITeam {
    // additionalData: any
id: number
name: string
players: IPlayer[]
tournamentId: number

}

export interface IPlayerCreate  {
    // additionalData: {}
email: string
name: string
phone: string
qydhaUsername: string
}

export interface IPlayer {
    // additionalData: {}
email: string
id: string
name: string
phone: string
qydhaUserData: MinUser
tournamentId: string
}
