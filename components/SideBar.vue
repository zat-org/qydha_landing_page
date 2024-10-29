<template>
    <USlideover side="left" :ui="{base:'w-[200px]' ,width: 'w-[250px] max-w-[250px]',}">
        <UVerticalNavigation :links="links" :ui="{size:'text-lg'}"/>
    </USlideover>

</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const userStore =useMyAuthStore()

const links :{label:string ,to:string,icon:string,labelClass?:string}[] =[
    {label:"المستخدم",to:"/deleteuser",icon:"mdi:user"},
    {label:"البطولات",to:"/tournament",icon:"mdi:tournament"},
  
    ]
if(userStore.roles?.includes('SuperAdmin')||userStore.roles?.includes('StaffAdmin')){
    links.push(
    {label:"اكواد المؤثرين",to:"/influncerCode",icon:"tdesign:user-vip"},
    {label:"اكواد ",to:"/promoCode",icon:"mdi:voucher"},
    {label:"المستخدمين ",to:"/user",icon:"mdi:users"},
    {label:"الاشعارات ",to:"/notification",icon:"mdi:bell"},
    {label:"الاكونتات البرمجية ",to:"/ServiceAccount",icon:"pajamas:code"},
    {label:"الملف الثابت",to:"/assets",icon:"mdi:files"},
    )
}
 if (userStore.roles?.includes('Streamer')){
    links.push(
    {label:"البث",to:"/stream",icon:"material-symbols-light:live-tv-outline"},
    )
 }
</script>

<style>

</style>