import type { MinUser } from "./user"

export interface IModeratorCreate {
    username: string,
    permissions: string[]
}

export interface IModerator {

    user: MinUser
    permissions: string[]
}

export interface IModeratorUpdate {

    permissions: string[]
}