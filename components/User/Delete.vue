<template>
  <UCard  :ui="{base:'h-full  flex flex-col  ',body:{base:'grow'} }">
    <template #header>
      <div class="flex justify-between ">

        <h2 class="text-2xl  mx-auto ">  اعدادات المستخدم </h2>
        <UButton color="red" class=""   icon="mdi:delete" @click="openDeleteModal">مسح المستخدم</UButton>
      </div>

    </template>
    <div class="flex flex-col gap-3  text-2xl "> 
      <p > الاسم {{  user?.user.username  }} </p>
      <p> الهاتف {{  user?.user.phone  }} </p>
      <p>  الفئة {{  user?.user.roles.join(',')  }} </p>



     

    </div>


  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';
import  UserDeleteModal  from './DeleteModal.vue';
const userStore =useMyAuthStore() 
const {user} = storeToRefs(userStore)
const overlay = useOverlay()
const openDeleteModal=()=>{
  overlay.create(UserDeleteModal).open()
}
</script>

<style>

</style>