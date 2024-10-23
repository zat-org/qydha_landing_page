<template>
  <UCard :ui="{base:'flex h-full flex-col ',body:{base:'grow'}}">
    <template #header>
      notfictions    
    </template>
    <div>
      notfictions    

    </div>
    <template #footer >
      <UButton label="add" color="green" @click="openAddModal" />
    </template>

  </UCard>
  
</template>

<script lang="ts" setup>
import AddNotificationModal from './AddNotificationModal.vue';

const modal =useModal()

const openAddModal =()=>{
  modal.open(AddNotificationModal)
}

</script>

<style>

</style>