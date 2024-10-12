<template>
  <UCard >
    <template #header>
      <p> اعدادات المستخدم </p>
    </template>
    <div>
<UButton color="red"   icon="mdi:delete" @click="openDeleteModal">مسح المستخدم</UButton>
    </div>


  </UCard>
</template>

<script lang="ts" setup>
import  UserDeleteModal  from './DeleteModal.vue';

const modal  =useModal()
const openDeleteModal=()=>{
  modal.open(UserDeleteModal)
}
</script>

<style>

</style>