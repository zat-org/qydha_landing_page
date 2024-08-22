<template>
 <div class=" flex flex-col gap-5    items-center h-screen  w-full  bg-[url(~/assets/images/bg.png)] bg-center bg-cover bg-no-repeat">
<div class="flex gap-5 md:gap-20 justify-between p-5 transition-all duration-300">
  <img src="https://saudigames.sa/sg24-frontend/images/sg24-colored-logo.svg" class="w-16 md:w-20 h-16 md:h-20"/>
  <img src="https://www.sfms.sa/assets/front/images/fav.png"  class="w-16 md:w-20 h-16 md:h-20"/>
  <img src="~/assets/images/zat-logo-black.svg"  class="w-16 md:w-20 h-16 md:h-20"/>
  <img src="~/assets/images/01_app_icon.png" class="w-16 md:w-20 h-16 md:h-20" />

</div>
 
 <UCard class="w-[80%] max-w-[800px] self-center">
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
