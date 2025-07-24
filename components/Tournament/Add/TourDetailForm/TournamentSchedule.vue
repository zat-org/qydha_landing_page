<template>
  <div class="space-y-6">
    <div class="text-center">
      <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">جدولة البطولة</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">خطط جدولك الزمني للبطولة</p>
    </div>

    <UFormField label="عدد أيام البطولة" name="TournamentDaysNumber"
      :hint="`أفضل عدد ساعات لإدارة البطولة ${bestTime ? formatTime(bestTime) : '0'} ساعة`" required>
      <div
        class="flex items-center justify-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-300 dark:border-gray-600">
        <UInput type="number" v-model="model.TournamentDaysNumber" min="1" @input="updateTournamentDates"
          class="text-center w-20 text-base font-medium" />
        <span class="text-base text-gray-700 dark:text-gray-300">يوم</span>
      </div>
    </UFormField>

    <div v-if="model.TournamentDaysNumber > 0" class="space-y-6">
      <!-- Tournament Overview Stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded-lg text-center">
          <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{{ tournamentRounds.length }}</div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">إجمالي الأدوار</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded-lg text-center">
          <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{{ totalMatches }}</div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">إجمالي المباريات</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded-lg text-center">
          <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatTime(bestTime || 0) }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">ساعات مطلوبة</div>
        </div>
        <div
          class="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-3 sm:p-4 rounded-lg text-center">
          <div class="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">{{ formatTime(availableTime) }}
          </div>
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">الوقت المتاح</div>
        </div>
      </div>

      <!-- Main Layout: Detail Pane + Sidebar -->
      <div class="flex flex-col lg:flex-row gap-6">
        

        <!-- Sidebar (Right side on desktop, bottom on mobile) -->
        <div class="w-full lg:w-80 lg:flex-shrink-0 min-h-[100px] max-h-[500px] overflow-y-auto" >
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
                <div
                  v-if="roundDistribution && roundDistribution[selectedDayIndex] && roundDistribution[selectedDayIndex].length > 0">
                  <div class="flex items-center justify-between mb-4">
                    <h5 class="text-lg font-semibold text-gray-900 dark:text-gray-100">الأدوار المقررة</h5>
                    <span
                      class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded text-sm">
                      {{ roundDistribution[selectedDayIndex].length }} دور
                    </span>
                  </div>

                  <div class="space-y-4 ">
                    <div v-for="(round, roundIndex) in roundDistribution[selectedDayIndex]"
                      :key="`${round.name}-${selectedDayIndex}`" :class="[
                        'border rounded-lg p-4',
                        round.isPartial
                          ? 'border-orange-300 dark:border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      ]">
                      <!-- Round Header -->
                      <div class="flex justify-between items-start mb-3">
                        <div class="flex-1">
                          <h6 class="font-semibold text-gray-900 dark:text-gray-100 text-base mb-1">
                            {{ round.name }}
                          </h6>
                          <div v-if="round.isPartial" class="text-sm text-orange-600 dark:text-orange-400">
                            {{ getPartialStatusText(round) }}
                          </div>
                        </div>
                        <span
                          class="text-sm bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded">
                          دور #{{ roundIndex + 1 }}
                        </span>
                      </div>

                      <!-- Round Stats -->
                      <div class="grid grid-cols-3 gap-4">
                        <div class="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
                          <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">الوقت المطلوب</div>
                          <div class="font-semibold text-gray-900 dark:text-gray-100">{{ formatTime(round.timeUsed) }}
                          </div>
                        </div>
                        <div class="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
                          <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">الطاولات المطلوبة</div>
                          <div class="font-semibold text-gray-900 dark:text-gray-100">{{ round.tablesNeeded }}</div>
                        </div>
                        <div class="text-center bg-gray-100 dark:bg-gray-700 p-3 rounded">
                          <div class="text-sm text-gray-600 dark:text-gray-400 mb-1">المباريات</div>
                          <div class="font-semibold text-gray-900 dark:text-gray-100">
                            {{ round.matchesPlayed }}/{{ round.totalMatches }}
                          </div>
                        </div>
                      </div>

                      <!-- Progress Bar for Partial Rounds -->
                      <div v-if="round.isPartial" class="mt-3">
                        <div class="bg-gray-300 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                          <div class="bg-orange-500 dark:bg-orange-400 h-full transition-all duration-300"
                            :style="{ width: `${(round.matchesPlayed / round.totalMatches) * 100}%` }"></div>
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
  formatTime,
  TIME_OF_MATCH 
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

// Tournament rounds calculation using composable
const tournamentRounds = computed((): TournamentRound[] => {
  const teamsCount = props.teamsCount || 0;
  const tablesCount = props.tablesCount || 1;
  return calculateTournamentRounds(teamsCount, tablesCount);
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

// Enhanced round distribution algorithm that handles splitting rounds across days
const calculateRoundDistribution = () => {
  const rounds = [...tournamentRounds.value];
  const distribution: PartialRound[][] = Array(model.value.TournamentDaysNumber).fill(null).map(() => []);
  const dayTimes: number[] = Array(model.value.TournamentDaysNumber).fill(0);
  const unscheduled: TournamentRound[] = [];

  for (const round of rounds) {
    let remainingMatches = round.matches;
    let roundScheduled = false;

    for (let dayIndex = 0; dayIndex < model.value.TournamentDaysNumber && remainingMatches > 0; dayIndex++) {
      const availableTime = getDayAvailableTime(dayIndex);
      console.log("availableTime", availableTime)
      const currentTime = dayTimes[dayIndex];
      console.log("currentTime", currentTime)
      const remainingTime = availableTime - currentTime;

      if (remainingTime <= 0) continue; // No time left in this day

      // Calculate how many matches can fit in remaining time
      const timeSlotsAvailable = Math.floor(remainingTime / TIME_OF_MATCH);
      const matchesCanPlay = Math.min(
        timeSlotsAvailable * props.tablesCount!,
        remainingMatches
      );

      if (matchesCanPlay > 0) {
        const timeUsed = Math.ceil(matchesCanPlay / props.tablesCount!) * TIME_OF_MATCH;

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
        timeNeeded: Math.ceil(remainingMatches / props.tablesCount!) * TIME_OF_MATCH
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
watch([() => props.teamsCount, () => props.tablesCount], () => {
  calculateRoundDistribution();
}, { immediate: true });

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