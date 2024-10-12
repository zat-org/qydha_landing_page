<template>

    <UVerticalNavigation :links="links" />

</template>

<script lang="ts" setup>
const links =[{label:"المستخدم",to:"/deleteuser",icon:"mdi:user"},{label:"البطولات",to:"/tournament",icon:"mdi:tournament"}]
</script>

<style>

</style>