<template>

    <UVerticalNavigation :links="links" />

</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const userStore =useMyAuthStore()

const links =[
    {label:"المستخدم",to:"/deleteuser",icon:"mdi:user"},
    {label:"البطولات",to:"/tournament",icon:"mdi:tournament"},
  
    ]
if(userStore.roles?.includes('SuperAdmin')||userStore.roles?.includes('StaffAdmin')){
    links.push(
    {label:"اكواد المؤثرين",to:"/influncerCode",icon:"mdi:tournament"},
    {label:"اكواد ",to:"/promoCode",icon:"mdi:tournament"},
    {label:"المستخدمين ",to:"/user",icon:"mdi:users"},
    {label:"الاشعارات ",to:"/notification",icon:"mdi:tournament"},
    {label:"الاكونتات البرمجية ",to:"/tournament",icon:"mdi:tournament"},
    )
}
</script>

<style>

</style>