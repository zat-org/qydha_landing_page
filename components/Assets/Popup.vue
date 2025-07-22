<template>
  <div class="grid w-full h-full grid-cols-1 md:grid-cols-2 gap-8 p-6">
    <div class="flex flex-col gap-6 items-center">
      <!-- Status Badge -->
      <div class="w-full text-center">
        <UBadge 
          :color="popUp?.show ? 'success' : 'neutral'"
          :label="popUp?.show ? 'يعرض على التطبيق' : 'لا يعرض على التطبيق'" 
          size="lg"
          class="text-lg"
        />
      </div>

      <!-- Action Type Info -->
      <UCard class="w-full">
        <template #header>
          <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">نوع الإجراء</h3>
        </template>
        
        <div class="p-4">
          <div v-if="popUp?.actionType == AssetPopUpActionType.PopUpWithNoAction" 
            class="text-gray-600 dark:text-gray-400 text-center">
            لا يوجد إجراء محدد
          </div>

          <div v-else-if="popUp?.actionType == AssetPopUpActionType.PopUpWithGoToURL" 
            class="flex flex-col items-center gap-2">
            <span class="text-gray-600 dark:text-gray-400">الرابط المحدد:</span>
            <UButton
              :to="popUp.actionPath"
              target="_blank"
              color="primary"
              icon="i-heroicons-link"
              class="w-full"
            >
              فتح الرابط
            </UButton>
          </div>

          <div v-else-if="popUp?.actionType == AssetPopUpActionType.PopUpWithGoToTab"
            class="flex flex-col items-center gap-2">
            <span class="text-gray-600 dark:text-gray-400">التبويب المحدد:</span>
            <UBadge :label="popUp.actionPath" class="text-lg" />
          </div>

          <div v-else-if="popUp?.actionType == AssetPopUpActionType.PopUpWithGoToScreen"
            class="flex flex-col items-center gap-2">
            <span class="text-gray-600 dark:text-gray-400">الشاشة المحددة:</span>
            <UBadge :label="popUp.actionPath" class="text-lg" />
          </div>

          <div v-else class="text-gray-600 dark:text-gray-400 text-center">
            لا توجد معلومات متاحة
          </div>
        </div>
      </UCard>
    </div>

    <!-- Image Section -->
    <div class="flex flex-col items-center justify-center">
      <UCard v-if="popUp?.imageUrl" class="w-full max-w-md overflow-hidden">
        <img 
          :src="popUp.imageUrl" 
          alt="صورة النافذة المنبثقة" 
          class="w-full h-auto object-cover rounded-lg hover:scale-105 transition-transform duration-300"
          loading="lazy"
        >
      </UCard>
      
      <div v-else class="text-center text-gray-500 dark:text-gray-400">
        <UIcon name="i-heroicons-photo" class="w-16 h-16 mx-auto mb-2" />
        <p>لا توجد صورة متاحة</p>
      </div>
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

<style scoped>
.grid {
  min-height: 400px;
}
</style>