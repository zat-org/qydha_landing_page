<template>
  <UCard class="h-full flex flex-col">
    <template #header>
      <div class="flex justify-between">
        <UButton  label="اضافة " @click="openAddModal"/>
      </div>
    </template>

    marketing test 
  </UCard>
</template>

<script lang="ts" setup>
import AddModal from './AddModal.vue';

const overlay = useOverlay()
const openAddModal=()=>{
overlay.create(AddModal).open()
}

</script>

<style>

</style>