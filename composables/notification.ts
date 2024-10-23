
import type { INotificationCreate } from '~/models/notification';
import { Body } from './../.nuxt/components.d';
export const useNotification = () => {
  const { $api } = useNuxtApp();
const getAllNotifications=async()=>{
   const { data, pending, error, refresh,status } = await useAsyncData(
      'getAllNotifications',
      () => $api('/notifications/users/anonymous')
  );
  return {data, pending, error, refresh,status}
}
const sendNotificationToAllUsers = async()=>{
  const body = ref<FormData>(new FormData())
  const { data, pending, error, refresh,status,execute } = await useAsyncData(
      'sendNotificationToAllUsers',
      () => $api('/notifications/users/',{method:'post',body:body.value}),{immediate:false}
  );
  const fetchREQ =async(new_notification:INotificationCreate)=>{
    body.value.append('actionPath',new_notification.actionPath)
    body.value.append('actionType',new_notification.actionType)
    body.value.append('description',new_notification.description)
    body.value.append('title',new_notification.title)
    // body.value.append('popUpImage',new_notification.popUpImage as File)

    await execute()
  }
  return { data, pending, error, refresh,status,fetchREQ }
}

return {sendNotificationToAllUsers}
}
