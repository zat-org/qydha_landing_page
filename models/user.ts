
export enum Privilege {
  Admin = 'Admin',
  Owner = "Owner",
  Moderatore="Moderatore",
  ServiceAccount="ServiceAccount",
  User="User"
}
  export interface IUserData {
  
    generalSettings: GeneralSettings
    handSettings: HandSettings
    balootSettings: BalootSettings
    players: Player[]
    boardLink: string
    jwtToken: string
    refreshTokenExpirationDate: string
    refreshToken: string
    user:User

    
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
  