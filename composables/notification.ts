
import type { INotificationCreate, INotificationPopupCreate } from '~/models/notification';
export const useNotification = () => {
  const { $api } = useNuxtApp();
  const getAllNotifications = async () => {

    const { data, pending, error, refresh, status } = await useAsyncData(
      'getAllNotifications',
      () => $api('/notifications/users/anonymous')
    );
    return { data, pending, error, refresh, status }
  }
  const sendNotificationToAllUsers = async () => {
    const target= ref("")
    const body = ref<FormData>(new FormData())
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'sendNotificationToAllUsers',
      () => $api(`/notifications/users/${target.value}`, { method: 'post', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (new_notification: INotificationCreate | INotificationPopupCreate ,to:"All"|"User"|"Anonymos"="All",user?:string ) => {
      body.value.append('actionPath', new_notification.actionPath)
      body.value.append('actionType', new_notification.actionType)
      body.value.append('description', new_notification.description)
      body.value.append('title', new_notification.title)
      if ("popUpImage" in new_notification) {
        body.value.append('popUpImage', new_notification.popUpImage as File)
      }
      if (to =="User" && user){
        target.value = user
      }else if(to=="Anonymos"){
        target.value="anonymous"
      }
      

      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  return { sendNotificationToAllUsers ,getAllNotifications}
}
