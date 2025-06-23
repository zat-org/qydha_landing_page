// import { extendNuxtSchema } from "nuxt/kit";
import type { IAssetPopUp, IAssetPopUpUpdate } from "~/models/assetPopup";
// import type { popUpActionType } from "~/models/notification";

export const useAssets = () => {
  const { $api } = useNuxtApp();
  const getBook = async () => {
    const { data, pending, error, refresh } = await useAsyncData<{ data: { url: string, lastUpdateAt: string }, message: string }>(
      'getBook',
      () => $api('/assets/baloot-book')
    );
    return { data, pending, error, refresh }
  }
  const updateBook = async () => {
    const body = ref<FormData>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateBook',
      () => $api('/assets/baloot-book', { method: "put", body: body.value }), { immediate: false }
    );
    const fetchREQ = async (file: File) => {
      body.value = new FormData()
      body.value.append('file', file)
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }


  const getPopup = async () => {
    const { data, pending, error, refresh } = await useAsyncData
      <{
        data: IAssetPopUp,
        messsage: string
      }>
      (
        'getPopup',
        () => $api('/assets/popup')
      );
    return { data, pending, error, refresh }
  }

  const updatePopupData = async () => {
    const body = ref<IAssetPopUpUpdate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updatePopupData',
      () => $api('/assets/popup', { method: 'put',body:body.value }), { immediate: false }
    );
    const fetchREQ = async(_new_popup:IAssetPopUpUpdate) => {
      body.value=_new_popup
      await execute()
      if (status.value=='success'){
        refreshNuxtData('getPopup')
      }
    }


    return {data, pending, error, refresh, status,fetchREQ}

  }
  const updatePopUpImage =async()=>{
    const body =ref<FormData>(new FormData())
    const { data, pending, error, refresh,status,execute } = await useAsyncData(
        '',
        () => $api('/assets/popup/image',{method:'put',body:body.value}),{immediate:false}
    );
    const fetchREQ =async(_image:File)=>{
      body.value =new FormData()
      body.value.append('file',_image)

      await execute()
      if (status.value=='success'){
        refreshNuxtData('getPopup')
      }
    }
    return { data, pending, error, refresh ,status,fetchREQ}
  }


  return { getBook, updateBook, getPopup ,updatePopupData,updatePopUpImage}
}
