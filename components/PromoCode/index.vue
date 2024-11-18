<template>

<div class="flex flex-col justify-center    h-full">
  <UTable :rows="rows" :columns="cols" :ui="{td:{padding:'py-1'}}">
    <template #user-data="{row}"> 
      <span>{{row.user.username}}</span>
    </template>
  </UTable> 
  
  <UPagination class="mx-auto mt-auto " v-model="page" :page-count="10" :total="getREQ.data.value?.data.totalCount!" />
</div>
    <!-- <template #footer>
      <div class="flex justify-end"> 
        <UButton label="اضافة بروموكود" @click="openModal" />
      </div>
    </template> -->

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

watch(page,(newValue,oldValue)=>{
  getREQ.fetchREQ(newValue.toString())
})

</script>

<style></style>