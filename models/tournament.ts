import type { Privilege } from "./user"

export interface ITournamentCreate {

    name: string,
    description: string,
    city: string,
    location: {
        longitude: number,
        latitude: number
    },
    prizes: string[],
    prizesCurrency: string,
    startAt: string | Date,
    endAt: string | Date,
    ownerId: string

}


export interface ITournament extends  ITournamentCreate {
    // name: string,
    // description: string,
    // city: string,
    // location: {
    //     longitude: number,
    //     latitude: number
    // },
    // prizes: string[],
    // prizesCurrency: string,
    // startAt: string | Date,
    // endAt: string | Date,
    // owner: {
    //     id: string,
    //     phone: string,
    //     name: null | string,
    //     username: string,
    //     avatarUrl: string | null
    // }
    id: number,
    logoUrl: null | string,
    showInQydha: boolean

}

export interface ITournamentDetailed extends ITournament {
    moderators:any[] ,
    referees :[]
    requesterPrivilege :{ privilege:Privilege, permissions: string[]|null }
    owner: {
    id: string,
        phone: string,
        name: null|string,
        username: string,
        avatarUrl: string
    },
}