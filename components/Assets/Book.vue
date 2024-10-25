<template>
<div class="w-full flex justify-center mt-20 ">

  
  <UButtonGroup size="xl" >
    <UButton target="_blank" :to="getBookREQ.data.value?.data.url" icon="material-symbols:book" label="book" />
    <UBadge  color="gray" >
      <UIcon name="mdi:clock"  class="text-2xl"/>
      <span class="p-2"> {{ new Date(getBookREQ.data.value?.data.lastUpdateAt as string ).toDateString() }}</span>
    </UBadge>
  </UButtonGroup>

  </div>


</template>

<script lang="ts" setup>
const getBookREQ=await useAssets().getBook()

</script>

<style>

</style>