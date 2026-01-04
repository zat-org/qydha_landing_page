<template>
  <div
    v-if="rounds.length > 0"
    class="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800"
  >
    <div class="grid grid-cols-4 gap-4">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">إجمالي الوقت</p>
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
          {{ formatTime(totalTime) }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">الوقت المتاح لليوم</p>
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400" v-if="dayNumber >= 1">
          {{ formatTime(timePerDay) }}
        </p>
      </div>

      <div class="text-right">
        <p class="text-sm text-gray-600 dark:text-gray-400">عدد الأدوار</p>
        <p class="text-2xl font-semibold">{{ rounds.length }}</p>
      </div>

      <div class="text-right">
        <p class="text-sm text-gray-600 dark:text-gray-400">عدد المباريات</p>
        <p class="text-2xl font-semibold">{{ totalMatches }}</p>
      </div>
    </div>
  </div>

  <div v-else class="text-center py-12">
    <div class="text-gray-400 dark:text-gray-600 mb-4">
      <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
    <p class="text-gray-500 dark:text-gray-400">أدخل عدد الفرق والطاولات لعرض الأدوار</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  rounds: any[];
  totalTime: number;
  timePerDay: number;
  totalMatches: number;
  dayNumber: number;
  formatTime: (minutes: number) => string;
}>();

const { rounds, totalTime, timePerDay, totalMatches, dayNumber, formatTime } = toRefs( props);
</script>




