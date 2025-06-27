<template>
  <UCard >
    <template #header>
      <div class="flex justify-between items-cenetr ">
        <p>
        notfictions    
        </p>
        <UButton label="اضافة" color="primary" @click="openAddModal" />

      </div>
    </template>
    
    <div>

test
    </div>


  </UCard>
  
</template>

<script lang="ts" setup>
import AddNotificationModal from './AddNotificationModal.vue';

const overlay = useOverlay()
const toast = useToast()
// const getAllNotREQ = await useNotification().getAllNotifications()
// if (getAllNotREQ.status.value=="error"){
// toast.add({title:"error in get notifications"})
// }
// const  nots=computed(()=>{
//     return getAllNotREQ.data.value
// })
const openAddModal =()=>{
  overlay.create(AddNotificationModal).open()
}

</script>

<style>

</style>