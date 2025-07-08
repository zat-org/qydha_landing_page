<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">إحصائيات التطبيق</h2>
        <USelect v-model="timeRange" :items="[
          { label: 'آخر 7 أيام', value: '7d' },
          { label: 'آخر 30 يوم', value: '30d' },
          { label: 'آخر 90 يوم', value: '90d' }
        ]" />
      </div>
    </template>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard class="bg-emerald-50 dark:bg-emerald-900/20">
        <div class="text-center">
          <div class="text-emerald-600 dark:text-emerald-400 text-3xl font-bold">125K</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">التنزيلات الكلية</div>
          <div class="text-emerald-600 dark:text-emerald-400 text-sm mt-2">↑ 12% من الشهر الماضي</div>
        </div>
      </UCard>

      <UCard class="bg-blue-50 dark:bg-blue-900/20">
        <div class="text-center">
          <div class="text-blue-600 dark:text-blue-400 text-3xl font-bold">45K</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">المستخدمين النشطين</div>
          <div class="text-blue-600 dark:text-blue-400 text-sm mt-2">↑ 8% من الشهر الماضي</div>
        </div>
      </UCard>

      <UCard class="bg-amber-50 dark:bg-amber-900/20">
        <div class="text-center">
          <div class="text-amber-600 dark:text-amber-400 text-3xl font-bold">4.8</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">متوسط التقييم</div>
          <div class="text-amber-600 dark:text-amber-400 text-sm mt-2">↑ 0.2 من الشهر الماضي</div>
        </div>
      </UCard>

      <UCard class="bg-purple-50 dark:bg-purple-900/20">
        <div class="text-center">
          <div class="text-purple-600 dark:text-purple-400 text-3xl font-bold">89%</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">معدل الاحتفاظ</div>
          <div class="text-purple-600 dark:text-purple-400 text-sm mt-2">↑ 5% من الشهر الماضي</div>
        </div>
      </UCard>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Downloads Chart -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">التنزيلات اليومية</h3>
        </template>
        <div class="h-80">
          <!-- Chart placeholder -->
          <div class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            رسم بياني للتنزيلات
          </div>
        </div>
      </UCard>

      <!-- Active Users Chart -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">المستخدمين النشطين</h3>
        </template>
        <div class="h-80">
          <!-- Chart placeholder -->
          <div class="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            رسم بياني للمستخدمين النشطين
          </div>
        </div>
      </UCard>
    </div>

    <!-- Reviews Section -->
    <div class="mt-8">
      <UCard>
        <template #header>
          <h3 class="font-semibold">آخر التقييمات</h3>
        </template>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="i in 3" :key="i" class="py-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <UAvatar :src="`https://i.pravatar.cc/150?img=${i}`" />
              </div>
              <div class="ml-4 flex-1">
                <div class="flex items-center">
                  <h4 class="text-sm font-medium">مستخدم {{ i }}</h4>
                  <div class="ml-2 flex">
                    <UIcon v-for="star in 5" :key="star" name="i-heroicons-star-solid" 
                          class="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  تطبيق رائع! سهل الاستخدام وواجهة مستخدم جميلة
                </p>
              </div>
            </div>
          </li>
        </ul>
      </UCard>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
const timeRange = ref('7d')
</script>

<style></style>
