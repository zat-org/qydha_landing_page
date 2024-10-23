<template>

  <UForm :state="state" :schema="schema" ref="notificationForm" @submit="onSubmit">
    <UFormGroup label="title" name="title">
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup label="description" name="description">
      <UInput v-model="state.description" />
    </UFormGroup>
    <UFormGroup label="type" name="actionType">
      <USelect v-model="state.actionType" :options="notificationActionsArray" />
    </UFormGroup>
    <UFormGroup label="path" name="actionPath" v-if="state.actionType != NotificationActionType.NoAction">
      <UInput v-model="state.actionPath" v-if="state.actionType == NotificationActionType.GoToURL" />
      <USelect v-model="state.actionPath"
        :options="state.actionType == NotificationActionType.GoToScreen ? screenOptions : tabOptions"
        v-if="state.actionType == NotificationActionType.GoToScreen || state.actionType == NotificationActionType.GoToTab" />
    </UFormGroup>
    <!-- 
    <UFormGroup label="popUpImage" name="popUpImage" v-if="state.actionType == NotificationActionType.no">
      <UInput @change="filechange" type="file" />
    </UFormGroup> -->
  </UForm>
</template>

<script lang="ts" setup>
import { string, object } from 'yup'
import { NotificationActionType, type INotificationCreate } from '~/models/notification';
const  Form= ref<HTMLFormElement>() 

const modal =useModal()
const state = reactive<INotificationCreate>({
  title: '',
  description: '',
  actionPath: '_',
  actionType: NotificationActionType.NoAction,
  // popUpImage: null
})
const schema = object({
  title: string().required(),
  description: string(),
  actionPath: string(),
  actionType: string().required(),
  popUpImage: string()
})
// screen name options
const screenOptions = [
  { label: 'البلوت', value: "/baloot-game" },
  { label: 'الهند', value: "/hand-game" },
  { label: '  الاعدادات الفرق', value: "/team-settings" },
  { label: "تعديل البرفيل", value: "/edit-profile" },
  { label: "الاعدادات", value: "/app-settings" },
  { label: "مسح المستخدم", value: "/delete-user" },
  { label: "تغيير كلمة المرور", value: "/change-password" },
  { label: "عنا", value: "/about-us" },
  { label: "قوانين الخصوصية", value: "/privacy-policy" }]
// tab names options 
const tabOptions = [
  { label: "الصفحة الشخصية", value: 'profile' },
  { label: "المتجر", value: 'store' },
  { label: "الاحصائيات", value: 'statistics' },
  { label: "الكتاب", value: 'books' },
  { label: " الرئيسية", value: 'home' },

]
// handel file input 
// const filechange = (event: FileList) => {
//   if (event.item(0)) {
//     console.log(event.item(0))
//     state.popUpImage = event.item(0)
//   }
// }
// handel notification action type data
const notificationActionsArray = Object.values(NotificationActionType).map(action => ({
  value: action,
  label: action,
}));

watch(() => state.actionType, (newValue, oldValue) => {
  state.actionPath = ""
  if (newValue == NotificationActionType.NoAction) {
    schema.fields.actionPath = string()
    state.actionPath = "_"

  } else if (newValue == NotificationActionType.GoToURL) {

    schema.fields.actionPath = string().url().required()
  }
  else {
    schema.fields.actionPath = string().required()

  }



}, { immediate: true })


function  AddNotificatoion (){
  console.log("Hello ")
  // Form.value?.submit()
}

// handel sent req on form submit 
const addREQ =await  useNotification().sendNotificationToAllUsers() 

const onSubmit =async()=>{
  console.log(state)
  await addREQ.fetchREQ(state)
  if (addREQ.status.value =="success")
  modal.close()
}

defineExpose({ AddNotificatoion ,})


</script>

<style></style>