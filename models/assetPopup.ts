import type { popUpActionType } from "./notification";

export interface IAssetPopUp {
    actionPath: string,
    actionType: AssetPopUpActionType,
    show: boolean,
    imageUrl: string
}
export interface IAssetPopUpUpdate {
    actionPath: string,
    actionType: AssetPopUpActionType,
    show: boolean,

}
export enum AssetPopUpActionType {
    PopUpWithNoAction = "NoAction",
    PopUpWithGoToURL = "GoToURL",
    PopUpWithGoToScreen = "GoToScreen",
    PopUpWithGoToTab = "GoToTab"
}
