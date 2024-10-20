<template>
  <UCard :ui="{ base: 'h-full flex flex-col  ',body:{base:'grow '} }">
    <template #header>
      <h1 class="text-3xl">
        الاكواد
      </h1>
    </template>

    <UTable :rows="rows" :columns="cols">
      <template #user-data="{row}"> 
        <span>{{row.user.username}}</span>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-end"> 
        <UButton label="اضافة بروموكود" @click="openModal" />
      </div>
    </template>
  </UCard>


</template>

<script lang="ts" setup>
import AddModal from './AddModal.vue';


const promoCodeApi = usePromoCode()
const getREQ = await promoCodeApi.getPromoCodes()

const modal = useModal()
const rows = computed(() => {
  return getREQ.data.value?.data
})
const cols = [
  {label:'الكود',key:'code'},
  {label:'عدد الايام',key:'numberOfDays'},
  {label:'المستخدم',key:'user'},


  

]

const openModal = ()=>{
  modal.open(AddModal)
}


</script>

<style></style>