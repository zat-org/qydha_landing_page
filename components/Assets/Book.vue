<template>
  <div class="w-full flex flex-col items-center mt-10 p-6">
    <UCard class="max-w-xl w-full">
      <template #header>
        <h2 class="text-2xl font-bold text-center mb-4">كتاب التطبيق</h2>
      </template>

      <div class="flex flex-col items-center gap-6">
        <!-- Book Preview Card -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 w-full">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <UIcon name="material-symbols:book" class="text-3xl text-primary-500"/>
              <span class="text-lg font-medium">دليل المستخدم</span>
            </div>
            
            <UBadge color="primary" class="flex items-center gap-2">
              <UIcon name="mdi:clock" class="text-xl"/>
              <span>{{ new Date(getBookREQ.data.value?.data.lastUpdateAt as string).toLocaleDateString('ar-SA') }}</span>
            </UBadge>
          </div>

          <p class="text-gray-600 dark:text-gray-300 mb-6">
            دليل شامل يحتوي على كل ما تحتاج معرفته عن استخدام التطبيق
          </p>

          <UButton
            block
            color="primary"
            size="xl"
            :loading="!getBookREQ.data.value?.data.url"
            :to="getBookREQ.data.value?.data.url"
            target="_blank"
            icon="material-symbols:book"
          >
            فتح الكتاب
          </UButton>
        </div>

        <!-- Download Info -->
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center">
          * سيتم فتح الكتاب في نافذة جديدة في متصفحك
        </p>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
const getBookREQ = await useAssets().getBook()
</script>

<style scoped>
.u-button {
  transition: all 0.2s ease;
}
.u-button:hover {
  transform: translateY(-2px);
}
</style>