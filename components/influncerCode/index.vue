<template>
  <UCard :ui="{ base: 'h-full  flex flex-col ', body: { base: 'grow' } } ">
    <UTabs :items="items" @change="onChange">
      <template #infCode>
       <UTable :rows="codes" :columns="cols"></UTable>

      </template>
      <template #category>
        <InfluncerCodeCat />

      </template>

    </UTabs>

    <template #footer>
      <UButton @click="openModal()" color="green" label="add" />
    </template>

  </UCard>
</template>
<script lang="ts" setup>
import AddCodeModal from './addCodeModal.vue';
import AddCatModal from './Cat/addCatModal.vue';

const tabIndex = ref(0)

const items = [
  { slot: 'infCode', label: 'اكواد المؤثرين' },
  { slot: 'category', label: 'الفئات' }
]

const modal = useModal()
const onChange = (index: number) => {
  tabIndex.value = index
}
const openModal = () => {
  // in the infcode
  if (tabIndex.value == 0) {
    modal.open(AddCodeModal)
  }

  //in cat  
  else if (tabIndex.value == 1) {
    modal.open(AddCatModal)


  }
}

const getcodesREQ = await useInfluncerCode().getinfluncerCodes()
const codes=computed(()=>{
  return getcodesREQ.data.value?.data
})
const cols=[
  {key:"code",label:"الاسم"},
  {key:"numberOfDays",label:"عدد الايام"},
  {key:"usedCount",label:"مرات الاستخدام"},
  {key:"categoryName",label:"الفئة"},


]
</script>
<style></style>