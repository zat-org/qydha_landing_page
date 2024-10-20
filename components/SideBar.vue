<template>

    <UVerticalNavigation :links="links" />

</template>

<script lang="ts" setup>
const links =[
    {label:"المستخدم",to:"/deleteuser",icon:"mdi:user"},
    {label:"البطولات",to:"/tournament",icon:"mdi:tournament"},
    {label:"اكواد المؤثرين",to:"/influncerCode",icon:"mdi:tournament"},
    {label:"اكواد ",to:"/promoCode",icon:"mdi:tournament"},
    {label:"المستخدمين ",to:"/user",icon:"mdi:users"},
    {label:"الاشعارات ",to:"/tournament",icon:"mdi:tournament"},
    {label:"الاكونتات البرمجية ",to:"/tournament",icon:"mdi:tournament"},


    ]
</script>

<style>

</style>