<template>
  <div v-if="rounds.length > 0" class="space-y-1 overflow-y-auto px-1" ref="calculatorRoundsRoot">
    <h2 class="text-xl font-semibold">الأدوار</h2>
    <div class="grid grid-cols-1 gap-3">
      <UCard
        :ui="{ body: 'p-1 sm:p-1' }"
        v-for="round in rounds"
        :key="round.id"
        class="hover:shadow-md transition-shadow"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-bold flex-shrink-0"
              >
                {{ round.id }}
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-lg truncate">{{ round.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ round.matches }} مباراة
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 md:gap-4">
            <div class="text-center min-w-0">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">عدد الصكات</p>
              <USelect
                v-model="round.sakkanumber"
                :items="sakkaOptions"
                label-key="label"
                value-key="value"
                size="sm"
                class="w-full max-w-24 mx-auto"
              />
            </div>

            <div class="text-center min-w-0">
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1">الوقت</p>
              <p class="text-lg font-semibold text-primary-600 dark:text-primary-400 truncate">
                {{ formatTime(round.Time) }}
              </p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs, watch, nextTick, ref } from 'vue'

const props = defineProps<{
  rounds: {
    id: number;
    name: string;
    matches: number;
    level: number;
    sakkanumber: number;
    Time: number;
    waves: number;
  }[];
  sakkaOptions: { label: string; value: number }[];
  formatTime: (minutes: number) => string;
}>();

const { rounds, sakkaOptions, formatTime } = toRefs(props);
const calculatorRoundsRoot = ref<HTMLElement | null>(null);


</script>


