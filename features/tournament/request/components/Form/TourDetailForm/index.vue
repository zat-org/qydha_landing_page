<template>
  <UCard
    :ui="{
      body: 'flex-none overflow-visible px-3 py-1 sm:p-1',
      header: 'px-2 py-1 sm:p-1',
      footer: 'px-2 py-1 sm:p-1',
      root: 'h-auto flex-none overflow-visible',
    }"
    class="mx-auto w-full max-w-7xl bg-gray-50 dark:bg-gray-900"
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

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
      </div>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import { minFinalStartDate } from "~/features/tournament/request/composables/tournamentRequestDateUtils";

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

const onLocationParsed = () => {
  props.onFieldBlur?.("location");
  props.onFieldBlur?.("locationDescription");
};
</script>
