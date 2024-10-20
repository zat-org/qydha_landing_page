import type { InfluncerCode } from "./influncerCode"
import type { IPromoCode } from "./PromoCode"
import type { IPurchase } from "./purchase"

export enum Privilege {
  Admin = 'Admin',
  Owner = "Owner",
  Moderatore = "Moderatore",
  ServiceAccount = "ServiceAccount",
  User = "User"
}
// for auth user
export interface IUserData {

  boardLink: string
  jwtToken: string
  user: User

}

// for single user detail data 

export interface ISingleUser {
  influencerCodes: InfluncerCode[]
  promoCodes: IPromoCode []
  purchases: IPurchase[]
  user: User
}

export interface User {
  id: string
  username: string
  name: any
  phone: string
  email: any
  birthDate: any
  createdOn: string
  lastLogin: string
  avatarUrl: any
  expireDate: string
  roles: string[]
}

export interface GeneralSettings {
  enableVibration: boolean
}

export interface HandSettings {
  roundsCount: number
  maxLimit: number
  teamsCount: number
  playersCountInTeam: number
  winUsingZat: boolean
  takweeshPoints: number
}

export interface BalootSettings {
  isFlipped: boolean
  isAdvancedRecording: boolean
  isSakkahMashdodahMode: boolean
  showWhoWonDialogOnDraw: boolean
  isNumbersSoundEnabled: boolean
  isCommentsSoundEnabled: boolean
  isEkakShown: boolean
  isAklatShown: boolean
  sakkasCount: number
}

export interface Player {
  id: number
  url?: string
  name: string
}
