import type { MinUser } from "./user"
import { PlayerState } from "./Player"

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
status?: PlayerState | string // Add status property for request management
additionalData?: any // Add optional additional data

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
teamId: number|null
teamName: null|string
state?: PlayerState | string // Add optional state property
}
