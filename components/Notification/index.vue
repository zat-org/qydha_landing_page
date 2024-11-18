<template>
  <UCard :ui="{base:'flex h-full flex-col ',body:{base:'grow'}}">
    <template #header>
      <div class="flex justify-between items-cenetr ">
        <p>
        notfictions    
        </p>
        <UButton label="add" color="green" @click="openAddModal" />

      </div>
    </template>
    
    <div>

test
    </div>


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
//     return getAllNotREQ.data.value
// })
const openAddModal =()=>{
  modal.open(AddNotificationModal)
}

</script>

<style>

</style>