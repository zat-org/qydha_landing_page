<template>

  <UCard>
    <UButtonGroup>
      <UButton v-for="item in assetItems" :key="item.id" :label="item.label" :value="item.id"
        @click="tabChange(item.id)" :color="tabindex == item.id ? 'primary' : 'neutral'" />
    </UButtonGroup>
    <template v-if="tabindex == 0">
      <AssetsBook />
    </template>

    <template v-if="tabindex == 1">
      <AssetsPopup />
    </template>




    <template #footer>
      <UButton label="تعديل" color="warning" @click="openModal" />
    </template>

  </UCard>

</template>

<script lang="ts" setup>
import EditBookModal from './EditBookModal.vue';
import EditPopupModal from './EditPopupModal.vue';

const tabindex = ref(0)
const tabChange = (index: number) => { tabindex.value = index }
const assetItems = [
  { id: 0, slot: 'book', label: 'الكتاب' },
  { id: 1, slot: 'popup', label: 'النافذة المنبثقة' }
]
const overlay = useOverlay();
const openModal = () => {
  if (tabindex.value == 0) {
    overlay.create(EditBookModal).open()

  } else if (tabindex.value == 1) {
    overlay.create(EditPopupModal).open()
  }
}
</script>

<style></style>