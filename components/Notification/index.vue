<template>
  <UCard :ui="{base:'flex h-full flex-col ',body:{base:'grow'}}">
    <template #header>
      notfictions    
    </template>
    
    <div>

test
    </div>

    <template #footer >
      <UButton label="add" color="green" @click="openAddModal" />
    </template>

  </UCard>
  
</template>

<script lang="ts" setup>
import AddNotificationModal from './AddNotificationModal.vue';

const modal =useModal()
const toast = useToast()
// const getAllNotREQ = await useNotification().getAllNotifications()
// if (getAllNotREQ.status.value=="error"){
// toast.add({title:"error in get notifications"})
// }
// const  nots=computed(()=>{
//   return getAllNotREQ.data.value
// })
const openAddModal =()=>{
  modal.open(AddNotificationModal)
}

</script>

<style>

</style>