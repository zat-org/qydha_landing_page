<template>
  <UCard :ui="{ base: 'h-full  flex flex-col  ', body: { base: 'grow flex flex-col justifiy-center ' } }">
    <UTabs :items="items" :ui="{ base: 'h-full', height: 'h-full', container: 'h-full' }" @change="onChange">
      <template #infCode>
        <UTable :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }" :rows="codes" :columns="cols"></UTable>
      </template>
      <template #category>
        <InfluncerCodeCat />
      </template>
      <template #code>
        <PromoCode />
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
import AddUserCodeModal from '../PromoCode/AddModal.vue'
const tabIndex = ref(0)

const items = [
  { slot: 'infCode', label: 'اكواد المؤثرين' },
  { slot: 'category', label: 'الفئات' },
  { slot: 'code', label: 'الاكواد المستخدمين' },

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

  } else if (tabIndex.value == 2) {
    modal.open(AddUserCodeModal)
  }
}

const getcodesREQ = await useInfluncerCode().getinfluncerCodes()
const codes = computed(() => {
  return getcodesREQ.data.value?.data
})
const cols = [
  { key: "code", label: "الاسم" },
  { key: "numberOfDays", label: "عدد الايام" },
  { key: "usedCount", label: "مرات الاستخدام" },
  { key: "categoryName", label: "الفئة" },


]
</script>
<style></style>