<template>

  <UCard :ui="{ base: 'flex flex-col h-full', body: { base: 'grow' } }">
    <UTabs :items="assetItems" @change="tabChange">
      <template #book>
        <AssetsBook />
      </template>

      <template #popup>
        <AssetsPopup />
      </template>

    </UTabs>



    <template #footer>
      <UButton label="update" color="yellow" @click="openModal" />
    </template>

  </UCard>

</template>

<script lang="ts" setup>
import EditBookModal from './EditBookModal.vue';
import EditPopupModal from './EditPopupModal.vue';

const tabindex = ref(0)
const tabChange = (index: number) => { tabindex.value = index }
const assetItems = [
  { slot: 'book', label: 'الكتاب' },
  { slot: 'popup', label: 'النافذة المنبثقة' }
]
const modal = useModal()
const openModal = () => {
  if (tabindex.value == 0) {
    modal.open(EditBookModal)
  } else if (tabindex.value == 1) {
    modal.open(EditPopupModal)
  }
}
</script>

<style></style>