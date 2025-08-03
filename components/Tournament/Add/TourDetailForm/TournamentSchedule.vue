<template>
  <div class="space-y-6">
    <div class="text-center">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">جدولة البطولة</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">خطط جدولك الزمني للبطولة</p>
    </div>

    <!-- Sakka Impact Summary -->
    <!-- <div v-if="props.sakkaOptions && props.sakkaOptions.length > 0" 
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="text-blue-600 dark:text-blue-400 text-lg">⚡</div>
        <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">تأثير الصكات على الجدولة</h4>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div v-for="sakka in props.sakkaOptions" :key="sakka.group" 
          class="bg-white dark:bg-gray-800 p-2 rounded border border-blue-100 dark:border-blue-800">
          <div class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ sakka.group }}</div>
          <div class="text-blue-600 dark:text-blue-400">{{ sakka.sakka }} صكة = {{ formatTime(getMatchTimeForRound(sakka.group)) }}</div>
        </div>
      </div>
    </div> -->
    <div class="flex gap-4 items-center justify-center">
      <UFormField label="عدد أيام البطولة" name="TournamentDaysNumber" class="w-max mx-auto"
        :hint="`أفضل عدد ساعات لإدارة البطولة ${bestTime ? formatTime(bestTime) : '0'} ساعة`" required>
        <div
          class="flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
          <UInput type="number" v-model="model.TournamentDaysNumber" min="1" @input="updateTournamentDates"
            class="text-center w-20 text-base font-medium" />
          <span class="text-base text-gray-700 dark:text-gray-300">يوم</span>
        </div>
      </UFormField>

      <div v-if="model.TournamentDaysNumber > 0"
        class="flex items-center justify-between  w-max mx-auto  bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-trophy" class="text-primary-500 dark:text-primary-400 text-lg" />
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">الأدوار</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ tournamentRounds.length }}</div>
            </div>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-flag" class="text-primary-500 dark:text-primary-400 text-lg" />
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">المباريات</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ totalMatches }}</div>
            </div>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-clock" class="text-primary-500 dark:text-primary-400 text-lg" />
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">الوقت المطلوب</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ formatTime(bestTime || 0) }}</div>
            </div>
          </div>
          <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="text-primary-500 dark:text-primary-400 text-lg" />
            <div>
              <div class="text-sm text-gray-600 dark:text-gray-400">الوقت المتاح</div>
              <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ formatTime(availableTime) }}</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="model.TournamentDaysNumber > 0" class="space-y-6 ">
      <!-- Tournament Overview Stats -->


      <!-- Main Layout: Detail Pane + Sidebar -->
      <div class="flex flex-col lg:flex-row gap-6">


        <!-- Sidebar (Right side on desktop, bottom on mobile) -->
        <div class="w-full lg:w-80 lg:flex-shrink-0 min-h-[100px] max-h-[500px] overflow-y-auto">
          <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <!-- Sidebar Header -->
            <div class="bg-gray-200 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600">
              <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">أيام البطولة</h4>
            </div>

            <!-- Days List -->
            <div class="divide-y divide-gray-200 dark:divide-gray-600">
              <div v-for="(date, index) in model.TournamentDates" :key="index" @click="selectedDayIndex = index" :class="[
                'p-4 cursor-pointer transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700',
                selectedDayIndex === index
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-r-4 border-blue-500 dark:border-blue-400'
                  : ''
              ]">
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <div class="flex items-center gap-3">
                      <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        اليوم {{ index + 1 }}
                      </div>
                      <div class="text-xs px-2 py-1 rounded" :class="getDayStatusBadgeClass(index)">
                        {{ getDayStatus(index) }}
                      </div>
                    </div>

                    <div class="mt-2 space-y-1">
                      <div class="text-sm text-gray-600 dark:text-gray-400">
                        📅 {{ date.date || 'لم يتم تحديد التاريخ' }}
                      </div>
                      <div v-if="date.startTime && date.endTime" class="text-sm text-gray-600 dark:text-gray-400">
                        🕐 {{ date.startTime }} - {{ date.endTime }}
                      </div>
                      <div v-else class="text-sm text-gray-500 dark:text-gray-500">
                        لم يتم تحديد الأوقات
                      </div>
                    </div>

                    <!-- Quick stats -->
                    <div v-if="date.startTime && date.endTime" class="mt-3 flex items-center gap-4 text-xs">
                      <span class="text-gray-600 dark:text-gray-400">
                        ⏱️ {{ formatTime(getDayAvailableTime(index)) }}
                      </span>
                      <span class="text-gray-600 dark:text-gray-400">
                        🎯 {{ roundDistribution[index]?.length || 0 }} دور
                      </span>
                      <span :class="getDayUtilizationColor(index)">
                        {{ getUtilizationPercentage(index) }}%
                      </span>
                    </div>
                  </div>

                  <!-- Arrow indicator for selected day -->
                  <div v-if="selectedDayIndex === index" class="text-blue-500 dark:text-blue-400">
                    ←
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="flex-1 lg:flex-[2]">
          <div class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <!-- Detail Header -->
            <div class="bg-gray-200 dark:bg-gray-700 px-4 py-3 border-b border-gray-300 dark:border-gray-600">
              <div class="flex items-center justify-between">
                <h4 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {{ selectedDayIndex !== null ? `اليوم ${selectedDayIndex + 1}` : 'اختر يوماً لعرض التفاصيل' }}
                </h4>
                <div v-if="selectedDayIndex !== null"
                  class="text-xs px-2 py-1 bg-white dark:bg-gray-800 rounded text-gray-700 dark:text-gray-300">
                  {{ getDayStatus(selectedDayIndex) }}
                </div>
              </div>
            </div>

            <!-- Detail Content -->
            <div class="p-4  min-h-[100px] max-h-[500px] overflow-y-auto">
              <div v-if="selectedDayIndex !== null" class="space-y-4  ">
                <!-- Date and Time Inputs -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sticky   bg-white dark:bg-gray-800 ">
                  <UFormField label="التاريخ" :name="`TournamentDates[${selectedDayIndex}].date`">
                    <UInput type="date" v-model="model.TournamentDates[selectedDayIndex].date" class="text-sm" />
                  </UFormField>

                  <UFormField label="وقت البداية" :name="`TournamentDates[${selectedDayIndex}].startTime`">
                    <UInput type="time" v-model="model.TournamentDates[selectedDayIndex].startTime" class="text-sm"
                      @input="calculateRoundDistribution" />
                  </UFormField>

                  <UFormField label="وقت النهاية" :name="`TournamentDates[${selectedDayIndex}].endTime`">
                    <UInput type="time" v-model="model.TournamentDates[selectedDayIndex].endTime" class="text-sm"
                      @input="calculateRoundDistribution" />
                  </UFormField>
                </div>

                <!-- Time Summary -->
                <div
                  v-if="model.TournamentDates[selectedDayIndex].startTime && model.TournamentDates[selectedDayIndex].endTime"
                  class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 ">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">الوقت المتاح:</span>
                      <span class="font-medium text-gray-900 dark:text-gray-100">
                        {{ formatTime(getDayAvailableTime(selectedDayIndex)) }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">الوقت المستخدم:</span>
                      <span class="font-medium" :class="getDayUtilizationColor(selectedDayIndex)">
                        {{ formatTime(dayTotalTime[selectedDayIndex] || 0) }}
                      </span>
                    </div>
                  </div>
                  <!-- Progress Bar -->
                  <div class="mt-3">
                    <div class="bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                      <div class="h-full transition-all duration-300 rounded-full"
                        :class="getProgressBarColor(selectedDayIndex)"
                        :style="{ width: `${Math.min(getUtilizationPercentage(selectedDayIndex), 100)}%` }"></div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                      {{ getUtilizationPercentage(selectedDayIndex) }}% استخدام
                    </p>
                  </div>
                </div>

                <!-- Rounds Schedule -->
                <div v-if="roundDistribution && roundDistribution[selectedDayIndex] && roundDistribution[selectedDayIndex].length > 0" class="space-y-6">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <UIcon name="i-heroicons-calendar-days" class="text-primary-500 dark:text-primary-400 text-xl" />
                      <h5 class="text-lg font-semibold text-gray-900 dark:text-gray-100">الأدوار المقررة</h5>
                    </div>
                    <div class="flex items-center gap-2">
                      <UBadge size="lg" color="primary">
                        {{ roundDistribution[selectedDayIndex].length }} دور
                      </UBadge>
              
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div v-for="(round, roundIndex) in roundDistribution[selectedDayIndex]" 
                         :key="`${round.name}-${selectedDayIndex}`"
                         class="relative overflow-hidden group transition-all duration-200 hover:scale-[1.01]">
                      
                      <!-- Status Indicator Strip -->
                      <div class="absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-200"
                           :class="{
                             'bg-success-500 dark:bg-success-400': !round.isPartial && round.matchesPlayed === round.totalMatches,
                             'bg-warning-500 dark:bg-warning-400': round.isPartial,
                             'bg-primary-500 dark:bg-primary-400': !round.isPartial && round.matchesPlayed < round.totalMatches
                           }">
                      </div>

                      <div class="flex items-center gap-4 p-5 pl-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 shadow-sm hover:shadow-md">
                        <!-- Round Info -->
                        <div class="flex items-center gap-3 w-48">
                          <div class="flex flex-col">
                            <UBadge color="primary" size="sm" class="mb-1.5 group-hover:scale-105 transition-transform w-max">دور {{ roundIndex + 1 }}</UBadge>
                            <span class="font-semibold text-gray-900 dark:text-gray-100 text-lg">{{ round.name }}</span>
                          </div>
                        </div>

                        <!-- Stats Grid -->
                        <div class="flex-1">
                          <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                            <div class="flex items-center gap-6 justify-between">
                              <!-- Matches Status -->
                              <div class="flex items-center gap-3">
                                <UIcon name="i-heroicons-flag" class="text-primary-500 text-2xl" />
                                <div>
                                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">المباريات</div>
                                  <div class="flex items-center gap-1">
                                    <span class="text-lg font-semibold text-primary-600 dark:text-primary-400">{{ round.matchesPlayed }}</span>
                                    <span class="text-lg font-semibold text-gray-400 dark:text-gray-500">/</span>
                                    <span class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ round.totalMatches }}</span>
                                  </div>
                                </div>
                              </div>

                              <div class="h-12 w-px bg-gray-200 dark:bg-gray-600"></div>

                              <!-- Sakka Count -->
                              <div class="flex items-center gap-3">
                                <UIcon name="i-heroicons-bolt" class="text-warning-500 text-2xl" />
                                <div>
                                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">الصكات</div>
                                  <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {{ getSakkaCountForRound(round.name) }}
                                  </div>
                                </div>
                              </div>

                              <div class="h-12 w-px bg-gray-200 dark:bg-gray-600"></div>

                              <!-- Tables -->
                              <div class="flex items-center gap-3">
                                <UIcon name="i-heroicons-table-cells" class="text-info-500 text-2xl" />
                                <div>
                                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">الطاولات</div>
                                  <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {{ round.tablesNeeded }}
                                  </div>
                                </div>
                              </div>

                              <div class="h-12 w-px bg-gray-200 dark:bg-gray-600"></div>

                              <!-- Time -->
                              <div class="flex items-center gap-3">
                                <UIcon name="i-heroicons-clock" class="text-success-500 text-2xl" />
                                <div>
                                  <div class="text-sm text-gray-600 dark:text-gray-300 mb-1">الوقت</div>
                                  <div class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {{ formatTime(round.timeUsed) }}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Status Badge -->
                        <div class="w-40 flex justify-end">
                          <UBadge
                            :color="round.isPartial ? 'warning' : (round.matchesPlayed === round.totalMatches ? 'success' : 'primary')"
                            variant="subtle"
                            size="lg"
                            class="text-sm font-medium transition-transform group-hover:scale-105"
                          >
                            {{ round.isPartial ? 'جزئي' : (round.matchesPlayed === round.totalMatches ? 'مكتمل' : 'قيد التنفيذ') }}
                          </UBadge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Empty State -->
                <div
                  v-else-if="model.TournamentDates[selectedDayIndex].startTime && model.TournamentDates[selectedDayIndex].endTime"
                  class="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div class="text-4xl mb-3">📅</div>
                  <p class="text-gray-500 dark:text-gray-400 text-base">
                    لم يتم تحديد أدوار لهذا اليوم
                  </p>
                </div>

                <!-- Day Status Footer -->
                <div v-if="getDayAvailableTime(selectedDayIndex) > 0"
                  class="bg-gray-50 dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600 dark:text-gray-400">حالة اليوم:</span>
                    <span :class="getDayStatusColor(selectedDayIndex)" class="font-medium">
                      {{ getDayStatusText(selectedDayIndex) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- No day selected state -->
              <div v-else class="text-center py-12">
                <div class="text-4xl mb-3">👈</div>
                <p class="text-gray-500 dark:text-gray-400 text-base">
                  اختر يوماً من القائمة لعرض التفاصيل
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Unscheduled Rounds Warning -->
      <div v-if="unscheduledRounds.length > 0"
        class="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-600 rounded-lg p-4 sm:p-6">
        <div class="flex items-start gap-3">
          <div class="text-red-600 dark:text-red-400 text-lg sm:text-xl">⚠️</div>
          <div class="flex-1 min-w-0">
            <h4 class="text-base sm:text-lg font-semibold text-red-800 dark:text-red-200 mb-3 sm:mb-4">
              أدوار لم يتم جدولتها
            </h4>

            <!-- Wide screen layout -->
            <div class="hidden lg:block">
              <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3 mb-4">
                <div v-for="round in unscheduledRounds" :key="round.name"
                  class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 p-3 rounded">
                  <h5 class="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">{{ round.name }}</h5>
                  <div class="grid grid-cols-3 gap-2 text-xs">
                    <div class="text-center">
                      <div class="text-gray-500 dark:text-gray-400">الوقت</div>
                      <div class="font-medium text-gray-900 dark:text-gray-100">{{ formatTime(round.timeNeeded) }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-gray-500 dark:text-gray-400">الطاولات</div>
                      <div class="font-medium text-gray-900 dark:text-gray-100">{{ round.tablesNeeded }}</div>
                    </div>
                    <div class="text-center">
                      <div class="text-gray-500 dark:text-gray-400">المباريات</div>
                      <div class="font-medium text-gray-900 dark:text-gray-100">{{ round.matches }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Small screen layout -->
            <div class="lg:hidden space-y-2 mb-4">
              <div v-for="round in unscheduledRounds" :key="round.name"
                class="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-700 p-3 rounded">
                <h5 class="font-medium text-gray-900 dark:text-gray-100 mb-2 text-sm">{{ round.name }}</h5>
                <div class="flex justify-between text-xs">
                  <span class="text-gray-600 dark:text-gray-400">{{ formatTime(round.timeNeeded) }} • {{
                    round.tablesNeeded }} طاولة • {{ round.matches }} مباراة</span>
                </div>
              </div>
            </div>

            <div
              class="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600 rounded p-3 sm:p-4">
              <p class="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
                اقتراحات للحل:
              </p>
              <ul class="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                <li>• قم بزيادة عدد الأيام</li>
                <li>• قم بزيادة الوقت المتاح في الأيام الحالية</li>
                <li>• قم بزيادة عدد الطاولات لتسريع الأدوار</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

interface TournamentDate {
  date: string;
  startTime: string;
  endTime: string;
}

interface ScheduleData {
  TournamentDaysNumber: number;
  TournamentDates: TournamentDate[];
}

interface TournamentRound {
  name: string;
  matches: number;
  timeNeeded: number;
  tablesNeeded: number;
}

interface PartialRound {
  name: string;
  totalMatches: number;
  matchesPlayed: number;
  timeUsed: number;
  tablesNeeded: number;
  isPartial: boolean;
  partialType?: 'start' | 'continue' | 'middle' | 'end';
  originalRound: TournamentRound;
}

const model = defineModel<ScheduleData>({ required: true })

const props = defineProps<{
  bestTime?: number;
  timeAvailable?: number;
  teamsCount?: number;
  tablesCount?: number;
  sakkaOptions?: { group: string, sakka: string }[];
}>();

const emit = defineEmits<{
  'timeValidationChange': [isValid: boolean];
}>();

// Selected day state
const selectedDayIndex = ref<number | null>(null);

// Auto-select first day when days are created
watch(() => model.value.TournamentDaysNumber, (newVal) => {
  if (newVal > 0 && selectedDayIndex.value === null) {
    selectedDayIndex.value = 0;
  }
}, { immediate: true });

// Use the tournament calculations composable
const {
  calculateTournamentRounds,
  calculateTotalMatches,
  calculateDayAvailableTime,
  calculateAvailableTime,
  calculateMatchTime,
  getSakkaForRound,
  formatTime,
  BASE_TIME_OF_MATCH
} = useTournamentCalculations();

// UI Helper Functions
const getDayStatus = (dayIndex: number): string => {
  const hasRounds = roundDistribution.value[dayIndex]?.length > 0;
  const hasTime = model.value.TournamentDates[dayIndex]?.startTime && model.value.TournamentDates[dayIndex]?.endTime;

  if (!hasTime) return "غير مكتمل";
  if (!hasRounds) return "جاهز";
  return "مجدول";
};

const getDayStatusBadgeClass = (dayIndex: number): string => {
  const status = getDayStatus(dayIndex);
  switch (status) {
    case "غير مكتمل": return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
    case "جاهز": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    case "مجدول": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
    default: return "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300";
  }
};

const getDayStatusText = (dayIndex: number): string => {
  const availableTime = getDayAvailableTime(dayIndex);
  const usedTime = dayTotalTime.value[dayIndex] || 0;

  if (usedTime === 0) return "فارغ";
  if (usedTime > availableTime) return "مكتظ";
  if (usedTime === availableTime) return "ممتلئ";
  return "متاح";
};

const getDayStatusColor = (dayIndex: number): string => {
  const statusText = getDayStatusText(dayIndex);
  switch (statusText) {
    case "فارغ": return "text-gray-500 dark:text-gray-400";
    case "مكتظ": return "text-red-600 dark:text-red-400";
    case "ممتلئ": return "text-orange-600 dark:text-orange-400";
    case "متاح": return "text-green-600 dark:text-green-400";
    default: return "text-gray-500 dark:text-gray-400";
  }
};

const getDayUtilizationColor = (dayIndex: number): string => {
  const percentage = getUtilizationPercentage(dayIndex);
  if (percentage > 100) return "text-red-600 dark:text-red-400";
  if (percentage > 80) return "text-orange-600 dark:text-orange-400";
  if (percentage > 50) return "text-green-600 dark:text-green-400";
  return "text-gray-900 dark:text-gray-100";
};

const getProgressBarColor = (dayIndex: number): string => {
  const percentage = getUtilizationPercentage(dayIndex);
  if (percentage > 100) return "bg-red-500 dark:bg-red-400";
  if (percentage > 80) return "bg-orange-500 dark:bg-orange-400";
  if (percentage > 50) return "bg-green-500 dark:bg-green-400";
  return "bg-gray-500 dark:bg-gray-400";
};

const getUtilizationPercentage = (dayIndex: number): number => {
  const availableTime = getDayAvailableTime(dayIndex);
  const usedTime = dayTotalTime.value[dayIndex] || 0;
  if (availableTime === 0) return 0;
  return Math.round((usedTime / availableTime) * 100);
};

const getPartialStatusText = (round: PartialRound): string => {
  switch (round.partialType) {
    case 'start': return "يكمل في اليوم التالي";
    case 'continue': return "مكمل من اليوم السابق";
    case 'middle': return "يكمل في الأيام التالية";
    case 'end': return "مكمل من الأيام السابقة";
    default: return "";
  }
};

// Helper functions for sakka display in rounds
const getSakkaCountForRound = (roundName: string): number => {
  return getSakkaForRound(roundName, props.sakkaOptions || []);
};

const getMatchTimeForRound = (roundName: string): number => {
  const sakkaCount = getSakkaCountForRound(roundName);
  return calculateMatchTime(sakkaCount);
};

// Tournament rounds calculation using composable
const tournamentRounds = computed((): TournamentRound[] => {
  const teamsCount = props.teamsCount || 0;
  const tablesCount = props.tablesCount || 1;
  const sakkaOptions = props.sakkaOptions || [];
  return calculateTournamentRounds(teamsCount, tablesCount, sakkaOptions);
});

// Calculate total matches using composable
const totalMatches = computed(() => {
  return calculateTotalMatches(tournamentRounds.value);
});

// Round distribution across days
const roundDistribution = ref<PartialRound[][]>([]);
const dayTotalTime = ref<number[]>([]);
const unscheduledRounds = ref<TournamentRound[]>([]);

// Calculate available time for each day using composable
const getDayAvailableTime = (dayIndex: number): number => {
  const date = model.value.TournamentDates[dayIndex];
  if (!date) return 0;
  return calculateDayAvailableTime(date);
};

// Calculate available time using composable
const availableTime = computed(() => {
  return calculateAvailableTime(model.value.TournamentDates);
});

// Enhanced round distribution algorithm that handles splitting rounds across days with dynamic sakka times
const calculateRoundDistribution = () => {
  const rounds = [...tournamentRounds.value];
  const distribution: PartialRound[][] = Array(model.value.TournamentDaysNumber).fill(null).map(() => []);
  const dayTimes: number[] = Array(model.value.TournamentDaysNumber).fill(0);
  const unscheduled: TournamentRound[] = [];

  for (const round of rounds) {
    let remainingMatches = round.matches;
    let roundScheduled = false;
    const sakkaCount = getSakkaForRound(round.name, props.sakkaOptions || []);
    const matchTime = calculateMatchTime(sakkaCount);

    for (let dayIndex = 0; dayIndex < model.value.TournamentDaysNumber && remainingMatches > 0; dayIndex++) {
      const availableTime = getDayAvailableTime(dayIndex);
      const currentTime = dayTimes[dayIndex];
      const remainingTime = availableTime - currentTime;

      if (remainingTime <= 0) continue; // No time left in this day

      // Calculate how many matches can fit in remaining time using dynamic match time
      const timeSlotsAvailable = Math.floor(remainingTime / matchTime);
      const matchesCanPlay = Math.min(
        timeSlotsAvailable * props.tablesCount!,
        remainingMatches
      );

      if (matchesCanPlay > 0) {
        const timeUsed = Math.ceil(matchesCanPlay / props.tablesCount!) * matchTime;

        // Determine partial type
        let partialType: 'start' | 'continue' | 'middle' | 'end' | undefined;
        const isPartial = matchesCanPlay < round.matches;

        if (isPartial) {
          if (remainingMatches === round.matches) {
            // First part of the round
            partialType = remainingMatches - matchesCanPlay > 0 ? 'start' : undefined;
          } else if (remainingMatches === matchesCanPlay) {
            // Last part of the round
            partialType = 'end';
          } else {
            // Middle part of the round
            partialType = 'middle';
          }
        }

        distribution[dayIndex].push({
          name: round.name,
          totalMatches: round.matches,
          matchesPlayed: matchesCanPlay,
          timeUsed,
          tablesNeeded: Math.min(matchesCanPlay, props.tablesCount!),
          isPartial,
          partialType,
          originalRound: round
        });

        dayTimes[dayIndex] += timeUsed;
        remainingMatches -= matchesCanPlay;
        roundScheduled = true;
      }
    }

    // If round couldn't be fully scheduled, add remaining to unscheduled
    if (remainingMatches > 0) {
      unscheduled.push({
        ...round,
        matches: remainingMatches,
        timeNeeded: Math.ceil(remainingMatches / props.tablesCount!) * matchTime
      });
    }
  }

  roundDistribution.value = distribution;
  dayTotalTime.value = dayTimes;
  unscheduledRounds.value = unscheduled;
};

// Show warning if time is insufficient
const showTimeWarning = computed(() => {
  return props.bestTime && props.bestTime > availableTime.value;
});

// Emit validation change
watch(showTimeWarning, (newVal) => {
  emit('timeValidationChange', !newVal);
});

// Watch for changes that should trigger recalculation
watch([() => props.teamsCount, () => props.tablesCount, () => props.sakkaOptions], () => {
  calculateRoundDistribution();
}, { immediate: true, deep: true });

watch(() => model.value.TournamentDates, () => {
  calculateRoundDistribution();
}, { deep: true });

const updateTournamentDates = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);

  const updatedDates = Array.from({ length: value || 1 }, (_, i) => ({
    date: "",
    startTime: "",
    endTime: "",
  }));

  model.value.TournamentDates = updatedDates;

  // Reset selected day if it's out of range
  if (selectedDayIndex.value !== null && selectedDayIndex.value >= value) {
    selectedDayIndex.value = value > 0 ? 0 : null;
  }

  // Recalculate round distribution after updating dates
  nextTick(() => {
    calculateRoundDistribution();
  });
};
</script>