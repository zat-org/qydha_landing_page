<template>

  <UForm :state="state" :schema="schema" ref="notificationForm" @submit="onSubmit"  class="flex flex-col gap-2">
    <UButtonGroup class="mx-auto">
      <UButton :color="target == 'All' ? 'gray' : 'green'" @click="target = 'All'" label="All" />
      <UButton :color="target == 'Anonymos' ? 'gray' : 'green'" @click="target = 'Anonymos'" label="anonymous" />
      <UButton :color="target == 'User' ? 'gray' : 'green'" @click="target = 'User'" label="user" />
    </UButtonGroup>
    <UFormGroup label="user" name="user" v-if="target == 'User'">
      <UInputMenu v-model="state.user" :loading="usergetREQ.status.value=='pending'" :options="users" :search="search" option-attribute="username" value-attribute="id"  />
    </UFormGroup>
    <UFormGroup label="title" name="title">
      <UInput v-model="state.title" />
    </UFormGroup>
    <UFormGroup label="description" name="description">
      <UInput v-model="state.description" />
    </UFormGroup>
    <UFormGroup label="type" name="actionType">
      <USelect v-model="state.actionType" :options="notificationActionsArray" />
    </UFormGroup>
    <UFormGroup label="path" name="actionPath" v-if="state.actionType != popUpActionType.PopUpWithNoAction">
      <UInput v-model="state.actionPath" v-if="state.actionType == popUpActionType.PopUpWithGoToURL" />
      <USelect v-model="state.actionPath"
        :options="state.actionType == popUpActionType.PopUpWithGoToScreen ? screenOptions : tabOptions"
        v-if="state.actionType == popUpActionType.PopUpWithGoToScreen || state.actionType == popUpActionType.PopUpWithGoToTab " />
    </UFormGroup>
    <div class="flex justify-between items-center">
      <UFormGroup label="popUpImage" name="popUpImage" >
        <UInput @change="filechange" type="file" />
      </UFormGroup>
      <img  :src="imageUrl" class="w-[100px] h-[100]"/>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { string, object } from 'yup'
import {  popUpActionType, type INotificationPopupCreate } from '~/models/notification';
const notificationForm = ref<HTMLFormElement>()
const toast =useToast()
const modal = useModal()
const imageUrl = ref("")

const AddNotificatoion = () => {
  notificationForm.value?.submit()
}

defineExpose({ AddNotificatoion })
const usergetREQ  = await useUsers().getAllUsers()
await usergetREQ.fetchREQ("")
const users =computed(()=>{
  return  usergetREQ.data.value?.data.items
}) 

const target = ref<"All" | "User" | "Anonymos">("All")
watch(target, (newValue, oldValue) => {
  schema.fields.user = string()
  if (newValue == "User") {
    schema.fields.user = string().required()
  }
})
const search = async (q: string) => {
  await usergetREQ.fetchREQ(q)
  return users.value!
}


const state = reactive<INotificationPopupCreate>({
  title: '',
  description: '',
  actionPath: '_',
  actionType: popUpActionType.PopUpWithNoAction,
  popUpImage: "",
  user:""
})
const schema = object({
  title: string().required(),
  description: string(),
  actionPath: string(),
  actionType: string().required(),
  popUpImage: string().required(),
  user:string()
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
const filechange = (event: FileList) => {
  imageUrl.value =""
  const file =event.item(0)
  if (file) {
    state.popUpImage =file
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string // Get the image URL
    }
    reader.readAsDataURL(file)
  }
}
// handel notification action type data
const notificationActionsArray = Object.values(popUpActionType).map(action => ({
  value: action,
  label: action,
}));

watch(() => state.actionType, (newValue, oldValue) => {
  state.actionPath = ""
  if (newValue == popUpActionType.PopUpWithNoAction) {
    schema.fields.actionPath = string()
    state.actionPath = "_"

  } else if (newValue == popUpActionType.PopUpWithGoToURL) {

    schema.fields.actionPath = string().url().required()
  }
  else {
    schema.fields.actionPath = string().required()
  }
}, { immediate: true })


// handel sent req on form submit 

const onSubmit = async () => {
  console.log(state)
  await addREQ.fetchREQ(state,target.value,state.user)
  if (addREQ.status.value == "success")
    toast.add({ title:"add new notification doen "})
    modal.close()
}


const addREQ = await useNotification().sendNotificationToAllUsers()


</script>

<style></style>