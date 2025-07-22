<template>
  <div class="space-y-6">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">جدولة البطولة</h3>
    
    <UFormField 
      label="عدد أيام البطولة" 
      name="TournamentDaysNumber"
      :hint="`أفضل عدد ساعات لإدارة البطولة ${Math.ceil(bestTime / 60)} ساعة`" 
      required
    >
      <div class="relative flex items-center gap-2">
        <UInput 
          type="number" 
          v-model="modelValue.TournamentDaysNumber" 
          min="1" 
          @input="updateTournamentDates"
          class="hover:border-primary-300 text-center w-20" 
        />
        <span class="text-gray-600 dark:text-gray-400">يوم</span>
      </div>
    </UFormField>

    <div v-if="modelValue.TournamentDaysNumber > 0" class="space-y-4 mt-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div 
          v-for="(date, index) in modelValue.TournamentDates" 
          :key="index"
          class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition-colors duration-200"
        >
          <UFormField :label="`اليوم ${index + 1}`" :name="`TournamentDates[${index}]`">
            <div class="space-y-2">
              <UFormField label="التاريخ" :name="`TournamentDates[${index}].date`">
                <UInput 
                  type="date" 
                  v-model="modelValue.TournamentDates[index].date"
                  class="hover:border-primary-300" 
                />
              </UFormField>
              
              <div class="flex gap-2">
                <UFormField 
                  label="وقت البداية" 
                  class="flex-1" 
                  :name="`TournamentDates[${index}].startTime`"
                >
                  <UInput 
                    type="time" 
                    v-model="modelValue.TournamentDates[index].startTime"
                    class="hover:border-primary-300" 
                  />
                </UFormField>
                
                <UFormField 
                  label="وقت النهاية" 
                  class="flex-1" 
                  :name="`TournamentDates[${index}].endTime`"
                >
                  <UInput 
                    type="time" 
                    v-model="modelValue.TournamentDates[index].endTime"
                    class="hover:border-primary-300" 
                  />
                </UFormField>
              </div>
            </div>
          </UFormField>
        </div>
      </div>
    </div>

    <!-- Time validation warning -->
    <div v-if="showTimeWarning" class="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
      <div class="flex">
        <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5 text-orange-400" />
        <div class="ml-3">
          <h3 class="text-sm font-medium text-orange-800 dark:text-orange-200">
            تحذير: وقت غير كافي
          </h3>
          <div class="mt-2 text-sm text-orange-700 dark:text-orange-300">
            <p>
              الوقت المحدد للبطولة {{ Math.ceil(bestTime / 60) }} ساعة والوقت المتاح {{ Math.ceil(availableTime / 60) }} ساعة.
              يرجى إضافة المزيد من الوقت.
            </p>
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

const props = defineProps<{
  modelValue: ScheduleData;
  bestTime?: number;
  teamsCount?: number;
  tablesCount?: number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: ScheduleData];
  'timeValidationChange': [isValid: boolean];
}>();

// Calculate available time
const availableTime = computed(() => {
  let totalMinutes = 0;
  
  props.modelValue.TournamentDates.forEach(date => {
    if (date.startTime && date.endTime) {
      const startTime = new Date(`1970-01-01T${date.startTime}`);
      const endTime = new Date(`1970-01-01T${date.endTime}`);
      const diffMs = Math.abs(endTime.getTime() - startTime.getTime());
      const diffMinutes = diffMs / (1000 * 60);
      totalMinutes += diffMinutes;
    }
  });
  
  return totalMinutes;
});

// Show warning if time is insufficient
const showTimeWarning = computed(() => {
  return props.bestTime && props.bestTime > availableTime.value;
});

// Emit validation change
watch(showTimeWarning, (newVal) => {
  emit('timeValidationChange', !newVal);
});

const updateTournamentDates = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = Number(target.value);
  
  const updatedDates = Array.from({ length: value || 1 }, (_, i) => ({
    date: "",
    startTime: "",
    endTime: "",
  }));
  
  emit('update:modelValue', {
    ...props.modelValue,
    TournamentDates: updatedDates
  });
};
</script> 