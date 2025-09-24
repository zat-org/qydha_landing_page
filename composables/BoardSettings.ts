import type {  IUpdateBalootBoardSettings } from "~/models/BoardSettings"
import { useMyAuthStore } from "~/store/Auth";

export const useBoardSettings = () => {
    const { $api } = useNuxtApp();
    const {user} = storeToRefs(useMyAuthStore())
    const updateBalootBoardSettings = async () => {

    const body = ref<IUpdateBalootBoardSettings>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
        'updateBoardSettings',
        () => $api('/users/me/board-settings/baloot', { method: 'put',body:body.value }), { immediate: false }
    );
    const fetchREQ = async (_body: IUpdateBalootBoardSettings) => {
        body.value = _body
        await execute()
        if (status.value == "success") {
            user.value!.boardSettings.baloot.portrait = body.value?.portrait
            console.log(user.value!.boardSettings.baloot.portrait)
        }
    }
    return { data, pending, error, refresh, status, fetchREQ }
 }
    return {
        updateBalootBoardSettings
    }
}