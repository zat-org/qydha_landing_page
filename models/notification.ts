export enum NotificationActionType {
    NoAction = ' NoAction',
    GoToURL = 'GotoURL',
    GoToScreen = 'GoToScreen',
    GoToTab = 'GoToTab',
 
}

export enum popUpActionType {
    PopUp = 'PopUp',
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
    // popUpImage: File|string|null

}