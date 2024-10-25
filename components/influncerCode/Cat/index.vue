<template>
  <UTable    :rows="catRow" :columns="cols">
    <template #action-data="{row}">
    <UButtonGroup>
      <UButton icon="material-symbols:edit" color='yellow' @click="openupdateModal(row)" /> 
      <UButton icon="material-symbols:delete" color="red" @click="deletecat(row) "/>
    </UButtonGroup>    
    </template>
  </UTable>
</template>

<script lang="ts" setup>
import type { ICategory } from '~/models/influncerCode';
import UpdateCatModal from './updateCatModal.vue';

const modal =useModal()
const categoryApi = useCategory()
const getCatREQ = await categoryApi.getAllcategory()
const deleteCatREQ = await categoryApi.deleteCategry()

const catRow = computed(() => {
  return getCatREQ.data.value?.data
})

const cols =[
  {label:'الاسم',key:'categoryName'},
  {label:'عدد الاستخدامات المتاحة',key:'maxCodesPerUserInGroup'},
  {label:'#',key:'action'}
]
const openupdateModal = (row:ICategory)=>{
  console.log(row)
modal.open(UpdateCatModal , {
  cat:row
})
}

const deletecat =async  (row:ICategory)=>{
  await deleteCatREQ.fetchREQ(row.id)
  if (deleteCatREQ.status.value=="success"){
    refreshNuxtData("getAllcategory")
  }
}
</script>

<style>

</style>