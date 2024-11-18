<template>
    <USlideover side="left" :ui="{base:'w-[200px]' ,width: 'w-[250px] max-w-[250px]',}">
        <UVerticalNavigation :links="links" :ui="{size:'text-lg'}"/>
    </USlideover>

</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const slideover = useSlideover()
const userStore =useMyAuthStore()
import {type VerticalNavigationLink  }from'#ui/types'
const links :VerticalNavigationLink[] =[
    {label:"المستخدم",to:"/deleteuser",icon:"mdi:user",click(...args) { slideover.close() },},
    {label:"البطولات",to:"/tournament",icon:"mdi:tournament",click(...args) { slideover.close() },},
  
    ]
if(userStore.roles?.includes('SuperAdmin')||userStore.roles?.includes('StaffAdmin')){
    links.push(
    {label:"اكواد ",to:"/influncerCode",icon:"mdi:voucher",click(...args) { slideover.close() },},
    // {label:"اكواد ",to:"/promoCode",icon:"mdi:voucher",click(...args) { slideover.close() },},
    {label:"المستخدمين ",to:"/user",icon:"mdi:users",click(...args) { slideover.close() },},
    {label:"الاشعارات ",to:"/notification",icon:"mdi:bell",click(...args) { slideover.close() },},
    {label:"الاكونتات البرمجية ",to:"/ServiceAccount",icon:"pajamas:code",click(...args) { slideover.close() },},
    {label:"الملف الثابت",to:"/assets",icon:"mdi:files",click(...args) { slideover.close() },},
    {label:"الاحصائيات",to:"/statistics",icon:"mdi:chart-line",click(...args) { slideover.close() },},
    
    )
}
 if (userStore.roles?.includes('Streamer')){
    links.push(
    {label:"البث",to:"/stream",icon:"material-symbols-light:live-tv-outline",click(...args) { slideover.close() },},
    )
 }
</script>

<style>

</style>