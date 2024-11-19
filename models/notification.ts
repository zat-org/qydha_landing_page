export enum NotificationActionType {
    NoAction = 'NoAction',
    GoToURL = 'GotoURL',
    GoToScreen = 'GoToScreen',
    GoToTab = 'GoToTab',
 
}

export enum popUpActionType {
    PopUpWithNoAction = "PopUpWithNoAction",
    PopUpWithGoToURL = "PopUpWithGoToURL",
    PopUpWithGoToScreen = "PopUpWithGoToScreen",
    PopUpWithGoToTab = "PopUpWithGoToTab"
}

export interface INotificationCreate {
    title: string
    description: string
    actionPath: string
    actionType: NotificationActionType
    user:string
    // popUpImage: File|string|null

}

export interface INotificationPopupCreate {
    title: string
    description: string
    actionPath: string
    actionType: popUpActionType
    popUpImage: File|string|null
    user:string
}