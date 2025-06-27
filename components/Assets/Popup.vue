<template>
  <div class="grid w-full h-full grid-cols-2">
    <div class="row-1 flex flex-col gap-10 items-center  ">

      <UBadge :color="popUp!.show ? 'success' : 'neutral'" label="الظهور في قيدها" size="lg" />

      <p v-if="popUp?.actionType ==
        AssetPopUpActionType.PopUpWithNoAction">
        لا يوجد اكشن
      </p>
      <p v-else-if="popUp?.actionType == AssetPopUpActionType.PopUpWithGoToURL">
        الذهاب الي لينك ما : <a :href="popUp.actionPath" class=" text-blue-500 text-2xl"> الينك</a>
      </p>
      <p v-else-if="popUp?.actionType == AssetPopUpActionType.PopUpWithGoToTab">
        الذهاب الي تابه :{{ popUp.actionPath }}
      </p>
      <p v-else-if="popUp?.actionType == AssetPopUpActionType.PopUpWithGoToScreen">
        الذهاب الي شاشة :{{ popUp.actionPath }}
      </p>
      <p v-else>
        لا توجد
      </p>

    </div>
    <div class="row-2 ">
      <img :src="popUp?.imageUrl" alt="pop up image" v-if="popUp?.imageUrl" class="w-[300px] h-[300px]">
      <p v-else>
        لا صور
      </p>
    </div>

  </div>


</template>
<script lang="ts" setup>
import { AssetPopUpActionType } from '~/models/assetPopup';
import { popUpActionType } from '~/models/notification';
const popupGetREQ = await useAssets().getPopup()
const popUp = computed(() => {
  return popupGetREQ.data.value?.data
})
</script>

<style></style>