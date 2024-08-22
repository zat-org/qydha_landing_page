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
     <Confirm  />
   </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'custom'
})
</script>

<style>

</style>