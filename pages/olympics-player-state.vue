<template>
 <div class=" flex justify-center  items-center h-screen  w-full">
 <UCard class="w-[80%] max-w-[800px]">
  <template #header>
    <h1 class="lg:text-3xl font-semibold text-center">تاكد  من تواجدك في  بطولة المملكة </h1>
  </template>
 <div class="flex flex-col gap-10  justify-center">
  
      <StateCheck  />
  </div>
</UCard>
</div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "custom",
});
</script>

<style></style>
