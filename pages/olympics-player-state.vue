<template>
  <div
    class=" flex flex-col gap-5 items-center h-screen w-full  bg-[url(~/assets/images/bg.png)] bg-center bg-cover bg-no-repeat">
    <div class="flex gap-5 md:gap-20 justify-between p-5 transition-all duration-300">
      <a href="https://saudigames.sa/" target="_blank">
        <img src="https://saudigames.sa/sg24-frontend/images/sg24-colored-logo.svg" class="w-16 md:w-20 h-16 md:h-20" />
      </a>
      <a href="https://www.sfms.sa" target="_blank">
        <img src="https://www.sfms.sa/assets/front/images/fav.png" class="w-16 md:w-20 h-16 md:h-20" />
      </a>

      <!-- <a href="https://zatbaloot.com/" target="_blank">
        <img src="~/assets/images/zat-logo-black.svg" class="w-16 md:w-20 h-16 md:h-20" />
      </a>

      <a href="https://qydha.com/" target="_blank">
        <img src="~/assets/images/01_app_icon.png" class="w-16 md:w-20 h-16 md:h-20" />
      </a> -->
    </div>
    <UCard class="w-[95%] md:w-[80%] max-w-[800px] self-center mb-3 overflow-y-scroll">
      <template #header>
        <h1 class="lg:text-3xl font-semibold text-center">تأكد من قبولك في بطولة البلوت</h1>
        <h1 class="lg:text-lg mt-1 font-semibold text-center">(دورة الألعاب السعودية الثالثة)</h1>
      </template>
      <div class="flex flex-col gap-10 justify-center ">
        <StateCheck />
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
