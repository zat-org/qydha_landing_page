<template>
  <UTable    :data="catRow" :columns="cols">
    <template #action-cell="{row}">
    <UButtonGroup>
      <UButton icon="material-symbols:edit" color='primary' @click="openupdateModal(row.original as ICategory)" /> 
      <UButton icon="material-symbols:delete" color="error" @click="deletecat(row.original as ICategory) "/>
    </UButtonGroup>    
    </template>
  </UTable>
</template>

<script lang="ts" setup>
import type { ICategory } from '~/models/influncerCode';
import UpdateCatModal from './updateCatModal.vue';

const overlay = useOverlay()
const categoryApi = useCategory()
const getCatREQ = await categoryApi.getAllcategory()
const deleteCatREQ = await categoryApi.deleteCategry()

const catRow = computed(() => {
  return getCatREQ.data.value?.data
})

const cols =[
  {accessorKey:'categoryName',header:'الاسم'},
  {accessorKey:'maxCodesPerUserInGroup',header:'عدد الاستخدامات المتاحة'},
  {accessorKey:'action',header:'#'}
]
const openupdateModal = (row:ICategory)=>{
  overlay.create(UpdateCatModal, {
    props: {
      cat: row
    }
  }).open();
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