<template>
  <div v-if="model" class="flex flex-col gap-3">
    <div class="flex items-center justify-between gap-2">
      <div>
        <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
          أماكن مرحلة التصفيات
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          أضف مكاناً واحداً أو أكثر للتصفيات
        </p>
      </div>
      <UButton
        label="إضافة مكان"
        color="primary"
        variant="soft"
        size="sm"
        icon="i-heroicons-plus-circle"
        :disabled="disabled"
        @click="addPlace"
      />
    </div>

    <UAlert
      v-if="error"
      color="error"
      variant="soft"
      :title="error"
      class="text-sm"
    />

    <QualificationPlaceCard
      v-for="(_place, index) in model.places"
      :key="index"
      v-model="model.places[index]!"
      :index="index"
      :can-remove="model.places.length > 1"
      :disabled="disabled"
      :errors="placeErrors(index)"
      @remove="removePlace(index)"
      @blur="emit('blur')"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  createEmptyTournamentPlace,
  type QualificationsStageInfo,
} from "~/features/tournament/models/place";
import QualificationPlaceCard from "./QualificationPlaceCard.vue";

const model = defineModel<QualificationsStageInfo | null>({ required: true });

const props = defineProps<{
  disabled?: boolean;
  error?: string;
  errors?: Record<string, string | undefined>;
}>();

const emit = defineEmits<{
  blur: [];
}>();

const addPlace = () => {
  if (!model.value) {
    model.value = { places: [createEmptyTournamentPlace()] };
  } else {
    model.value.places.push(createEmptyTournamentPlace());
  }
  emit("blur");
};

const removePlace = (index: number) => {
  if (!model.value || model.value.places.length <= 1) return;
  model.value.places.splice(index, 1);
  emit("blur");
};

const placeErrors = (index: number) => {
  const e = props.errors ?? {};
  const prefix = `qualificationsStageInfo.places[${index}]`;
  return {
    locationDescription: e[`${prefix}.locationDescription`] ?? e[`${prefix}.locationDescription`],
    location: e[`${prefix}.location`],
    startAt: e[`${prefix}.startAt`],
    endAt: e[`${prefix}.endAt`],
    availableTablesCount: e[`${prefix}.availableTablesCount`],
  };
};
</script>
