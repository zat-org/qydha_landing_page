<template>
<div class="h-full flex flex-col justify-between">

  <UTable  :rows="rows" :columns="cols" :ui="{td:{padding:'py-1'}}">
    <template #user-data="{row}"> 
      <span>{{row.user.username}}</span>
    </template>
  </UTable> 
  
  <UPagination class="mx-auto   " v-model="page" :page-count="10" :total="getREQ.data.value?.data.totalCount!" />
  <!-- <template #footer>
    <div class="flex justify-end"> 
      <UButton label="اضافة بروموكود" @click="openModal" />
    </div>
  </template> -->
  
</div>
</template>

<script lang="ts" setup>
import AddModal from './AddModal.vue';


const promoCodeApi = usePromoCode()
const getREQ = await promoCodeApi.getPromoCodes()
await getREQ.fetchREQ()
const modal = useModal()
const rows = computed(() => {
  return getREQ.data.value?.data.items
})
const cols = [
  {label:'الكود',key:'code'},
  {label:'عدد الايام',key:'numberOfDays'},
  {label:'المستخدم',key:'user'},


]

const openModal = ()=>{
  modal.open(AddModal)
}

const page = ref(getREQ.data.value?.data.currentPage!)

watch(page,async(newValue,oldValue)=>{
 await  getREQ.fetchREQ(newValue.toString())
})

</script>

<style></style>