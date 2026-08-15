<template>
  <UTable    :data="catRow" :columns="cols">
    <template #action-cell="{row}">
    <UFieldGroup>
      <UButton icon="material-symbols:edit" color='primary' @click="openupdateModal(row.original as unknown as ICategory)" /> 
      <UButton icon="material-symbols:delete" color="error" @click="deletecat(row.original as unknown as ICategory) "/>
    </UFieldGroup>    
    </template>
  </UTable>
</template>

<script lang="ts" setup>
import type { ICategory } from '~/models/influncerCode';
import UpdateCatModal from './updateCatModal.vue';

const overlay = useOverlay()
const categoryApi = useCategory()
const getCatREQ = await categoryApi.getAllCategory()
const deleteCatREQ = categoryApi.deleteCategory()

const catRow = computed(() => {
  return getCatREQ.data.value
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

const deletecat = async (row: ICategory) => {
  await deleteCatREQ.fetchREQ(row.id)
}
</script>

<style>

</style>