<template>
  <UCard
    :ui="{ body: 'px-3 py-1 sm:p-1', header: 'px-2 py-1 sm:p-1 ', footer: 'px-2 py-1 sm:p-1', root: 'min-h-full overflow-visible' }"
    class="mx-auto min-h-full max-w-7xl bg-gray-50 dark:bg-gray-900"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 md:text-2xl">
          مرحلة النهائي
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          مكان ومواعيد النهائي — البداية بعد آخر نهاية تصفيات
        </p>
      </div>
    </template>

    <UForm :state="model" class="flex flex-col space-y-4">
      <UFormField
        label="موقع النهائي"
        name="location"
        required
        :error="errors?.location"
        :help="
          model.location.latitude != 0 && model.location.longitude != 0
            ? `الإحداثيات: ${model.location.latitude}, ${model.location.longitude}`
            : 'يرجى لصق رابط Google Maps واستخراج الموقع'
        "
      >
        <MapGoogleMapsUrlInput
          v-model:location="model.location"
          v-model:location-name="model.locationDescription"
          :disabled="disabledFields?.location"
          name="location"
          label="رابط Google Maps"
          @parsed="onLocationParsed"
        />
      </UFormField>

      <UFormField
        label="مكان النهائي"
        name="locationDescription"
        required
        :error="errors?.locationDescription"
      >
        <UInput
          v-model="model.locationDescription"
          :disabled="disabledFields?.locationDescription"
          placeholder="أدخل عنوان مكان النهائي"
          @blur="onFieldBlur?.('locationDescription')"
        />
      </UFormField>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <UFormField label="بداية النهائي" name="startAt" :error="errors?.startAt">
          <AsyncDatePicker
            v-model="model.startAt"
            :disabled="disabledFields?.startAt"
            :min-date="minFinalStart"
            @update:model-value="onFieldBlur?.('startAt')"
          />
        </UFormField>
        <UFormField label="نهاية النهائي" name="endAt" :error="errors?.endAt">
          <AsyncDatePicker
            v-model="model.endAt"
            :disabled="disabledFields?.endAt"
            :min-date="model.startAt || minFinalStart"
            @update:model-value="onFieldBlur?.('endAt')"
          />
        </UFormField>
      </div>

      <TournamentRequestFormTourDetailFormPrizeManagement v-model="model" />

      <div class="grid grid-cols-3 gap-4">
        <UFormField
          label="عدد الفرق في النهائي"
          name="teamsCount"
          :error="errors?.teamsCount"
          :help="teamsCountHelp"
        >
          <div class="flex flex-col items-center gap-2">
            <USelect
              v-model="TeamsCount"
              :disabled="disabledFields?.teamsCount"
              :items="TeamsCountOptions"
              @update:model-value="onFieldBlur?.('teamsCount')"
            />
            <AppNumberInput
              v-if="TeamsCount === 'custom'"
              v-model="model.teamsCount"
              integer
              :min="1"
              :disabled="disabledFields?.teamsCount"
              placeholder="0"
              @blur="onFieldBlur?.('teamsCount')"
            />
          </div>
        </UFormField>

        <UFormField label="عدد الطاولات في النهائي" name="tablesCount" :error="errors?.tablesCount">
          <AppNumberInput
            v-model="model.tablesCount"
            integer
            :min="1"
            :disabled="disabledFields?.tablesCount"
            placeholder="0"
            @blur="onFieldBlur?.('tablesCount')"
          />
        </UFormField>

        <UFormField label="عدد الأيام" name="dayNumber">
          <AppNumberInput v-model="dayNumber" integer :min="1" placeholder="أدخل عدد الأيام" size="xs" />
        </UFormField>
        <UFormField label="وقت صكة واحدة (دقيقة)" name="sakkTime">
          <AppNumberInput v-model="sakkTime" integer :min="1" placeholder="وقت صكة واحدة" size="xs" />
        </UFormField>
        <UFormField label="وقت 3 صكات (دقيقة)" name="sakkTime3">
          <AppNumberInput v-model="sakkTime3" integer :min="1" placeholder="وقت 3 صكات" size="xs" />
        </UFormField>
        <UFormField label="وقت 5 صكات (دقيقة)" name="sakkTime5">
          <AppNumberInput v-model="sakkTime5" integer :min="1" placeholder="وقت 5 صكات" size="xs" />
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
import TournamentRequestFormTourDetailFormPrizeManagement from "~/features/tournament/request/components/Form/TourDetailForm/PrizeManagement.vue";
import {
  calcTotalTablesForCalculator,
  calcTotalTeamsForCalculator,
  minFinalStartDate,
} from "~/features/tournament/request/composables/tournamentRequestDateUtils";
import { useTourCalc } from "~/features/tournament/request/composables/useTourCalc";

const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
}>();

const { errors, onFieldBlur, disabledFields } = toRefs(props);
const model = defineModel<any>({ required: true });

const minFinalStart = computed(() =>
  minFinalStartDate(
    model.value.addPlayersByQydha,
    model.value.joinRequestEndAt,
    model.value.qualificationsStageInfo,
  ),
);

const qualificationPlacesCount = computed(
  () => model.value.qualificationsStageInfo?.places?.length ?? 0,
);

const hasQualificationStage = computed(() => qualificationPlacesCount.value > 0);

const teamsCountHelp = computed(() => {
  const count = qualificationPlacesCount.value;
  if (!count) return undefined;
  const examples = [count, count * 2, count * 3, count * 4].join("، ");
  return `يجب أن يكون من مضاعفات عدد أماكن التصفيات (${examples}، …)`;
});

const TeamsCount = ref<number | string>(model.value.teamsCount);
watch(TeamsCount, (newVal) => {
  if (newVal !== "custom") model.value.teamsCount = newVal as number;
});

const TeamsCountOptions = computed(() => {
  const base = [
    { label: "16 فريق", value: 16 },
    { label: "32 فريق", value: 32 },
    { label: "64 فريق", value: 64 },
    { label: "128 فريق", value: 128 },
    { label: "عدد آخر", value: "custom" },
  ];
  const count = qualificationPlacesCount.value;
  if (!count) return base;
  return base.filter((option) => option.value === "custom" || (option.value as number) % count === 0);
});

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

const onLocationParsed = () => {
  props.onFieldBlur?.("location");
  props.onFieldBlur?.("locationDescription");
};

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

const validatePositiveNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = parseInt(input.value);
  if (value < 1) input.value = "1";
};
</script>
