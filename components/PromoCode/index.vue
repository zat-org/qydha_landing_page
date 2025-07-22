<template>

  <UTable 
   :data="rows" 
   :columns="cols"
   :loading="getREQ.status.value === 'pending'"
   >
    <template #user-cell="{row}"> 
      <span>{{row.original.user.username}}</span>
    </template>
  </UTable> 
  
  <UPagination class="mx-auto rtl" v-model:page="page" :page-count="10" :total="getREQ.data.value?.data.totalCount!"  />

  
</template>

<script lang="ts" setup>
import AddModal from './AddModal.vue';


const promoCodeApi = usePromoCode()
const getREQ = await promoCodeApi.getPromoCodes()
await getREQ.fetchREQ()
const overlay = useOverlay()
const rows = computed(() => {
  return getREQ.data.value?.data.items
})
const cols = [
  {accessorKey:'code',header:'الكود'},
  {accessorKey:'numberOfDays',header:'عدد الايام'},
  {accessorKey:'user',header:'المستخدم'},


]

const openModal = ()=>{
  overlay.create(AddModal).open()
}

const page = ref(getREQ.data.value?.data.currentPage!)

watch(page,async(newValue,oldValue)=>{
 await  getREQ.fetchREQ(newValue.toString())
})

</script>

<style>
.rtl{
  direction: rtl;
}
</style>