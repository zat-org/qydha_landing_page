<template>
  <UCard
    :ui="{
      body: 'flex-none overflow-visible px-3 py-3 sm:p-4',
      header: 'px-3 py-2 sm:px-4 sm:py-3',
      root: 'h-auto flex-none overflow-visible',
    }"
    class="mx-auto w-full max-w-7xl bg-gray-50 dark:bg-gray-900"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 md:text-2xl">
          حاسبة البطولة
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          تقدير زمن الجولات بناءً على عدد الفرق والطاولات
        </p>
      </div>
    </template>

    <UForm :state="model" class="flex flex-col space-y-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <UFormField label="عدد الأيام" name="dayNumber">
          <AppNumberInput v-model="dayNumber" integer :min="1" placeholder="أدخل عدد الأيام" />
        </UFormField>
        <UFormField label="وقت صكة واحدة (دقيقة)" name="sakkTime">
          <AppNumberInput v-model="sakkTime" integer :min="1" placeholder="وقت صكة واحدة" />
        </UFormField>
        <UFormField label="وقت 3 صكات (دقيقة)" name="sakkTime3">
          <AppNumberInput v-model="sakkTime3" integer :min="1" placeholder="وقت 3 صكات" />
        </UFormField>
        <UFormField label="وقت 5 صكات (دقيقة)" name="sakkTime5">
          <AppNumberInput v-model="sakkTime5" integer :min="1" placeholder="وقت 5 صكات" />
        </UFormField>
      </div>

      <UAlert
        v-if="hasQualificationStage"
        color="info"
        variant="soft"
        title="حاسبة البطولة"
        :description="calculatorSummaryText"
        class="text-sm"
      />

      <TournamentRequestCalculatorRounds
        :rounds="rounds"
        :sakka-options="sakkaOptions"
        :format-time="formatTime"
      />
      <TournamentRequestCalculatorSummary
        :rounds="rounds"
        :total-time="totalTime"
        :time-per-day="timePerDay"
        :total-matches="totalMatches"
        :day-number="dayNumber"
        :format-time="formatTime"
      />
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import TournamentRequestCalculatorRounds from "~/features/tournament/request/components/CalculatorRounds.vue";
import TournamentRequestCalculatorSummary from "~/features/tournament/request/components/CalculatorSummary.vue";
import {
  calcTotalTablesForCalculator,
  calcTotalTeamsForCalculator,
} from "~/features/tournament/request/composables/tournamentRequestDateUtils";
import { useTourCalc } from "~/features/tournament/request/composables/useTourCalc";

defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
}>();

const model = defineModel<any>({ required: true });

const qualificationPlacesCount = computed(
  () => model.value.qualificationsStageInfo?.places?.length ?? 0,
);

const hasQualificationStage = computed(() => qualificationPlacesCount.value > 0);

const { rounds, teamsCount, tablesCount, sakkTime, sakkTime3, sakkTime5, totalTime, timePerDay, totalMatches, dayNumber } =
  useTourCalc();

const calculatorTeamsTotal = computed(() =>
  calcTotalTeamsForCalculator(model.value.teamsCount, model.value.qualificationsStageInfo),
);

const calculatorTablesTotal = computed(() =>
  calcTotalTablesForCalculator(model.value.tablesCount, model.value.qualificationsStageInfo),
);

const calculatorSummaryText = computed(() => {
  const finalTeams = Number(model.value.teamsCount) || 0;
  const finalTables = Number(model.value.tablesCount) || 0;
  const qualTeams = calculatorTeamsTotal.value - finalTeams;
  const qualTables = calculatorTablesTotal.value - finalTables;
  return `الحاسبة تستخدم ${calculatorTeamsTotal.value} فريق (${finalTeams} نهائي + ${qualTeams} تصفيات) و ${calculatorTablesTotal.value} طاولة (${finalTables} نهائي + ${qualTables} تصفيات).`;
});

watch(
  calculatorTablesTotal,
  (value) => {
    tablesCount.value = value;
  },
  { immediate: true },
);

watch(
  calculatorTeamsTotal,
  (value) => {
    teamsCount.value = value;
  },
  { immediate: true },
);

const sakkaOptions = [
  { label: "1", value: 1 },
  { label: "3", value: 3 },
  { label: "5", value: 5 },
];

const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes.toFixed(0)} دقيقة`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours.toFixed(0)} ساعة`;
  return `${hours.toFixed(0)} ساعة و ${mins.toFixed(0)} دقيقة`;
};
</script>
