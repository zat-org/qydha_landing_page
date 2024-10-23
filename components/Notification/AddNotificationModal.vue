<template>
  <UModal prevent-close>
    <UCard>

      <UTabs :items="tabItems">
        <template #notification> 
        <NotificationForm  ref="notificationForm"/>
        </template>
        <template #popup>
      hello in pop uup 
        
        </template>
      </UTabs>
      <template #footer >
        <div class="flex justify-between items-center">
          <UButton label="close" color="red" @click="modal.close()"  />
          <UButton label="add" color="green"  @click="onAdd"  />
        </div>

      </template>
    </UCard>

  </UModal>
</template>

<script lang="ts" setup>
import NotificationForm from './Form.vue'
const  notificationForm = ref()

const modal =useModal()

const tabItems = [{slot:'notification',label:'اشعار'},{slot:'popup',label:' اشعار المنبثق'}]


const onAdd=()=>{
  console.log(notificationForm.value)
  notificationForm.value?.AddNotificatoion()

}

</script>

<style>

</style>