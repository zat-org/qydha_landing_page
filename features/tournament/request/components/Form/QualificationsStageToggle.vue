<template>
  <UFormField name="qualificationsStageInfo" :error="error">
    <div class="flex flex-col gap-3 rounded-lg border border-gray-200 bg-white/60 p-4 dark:border-gray-700 dark:bg-gray-800/60">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            مرحلة التصفيات
          </p>
          <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            فعّل لإضافة أماكن تصفيات متعددة للبطولة
          </p>
        </div>
        <USwitch
          :model-value="enabled"
          :disabled="disabled"
          size="xl"
          @update:model-value="onToggle"
        />
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {{ enabled ? "مع تصفيات — يجب إضافة مكان واحد على الأقل" : "بدون تصفيات — نهائيات مباشرة" }}
      </p>
    </div>
  </UFormField>
</template>

<script lang="ts" setup>
import {
  createEmptyTournamentPlace,
  type QualificationsStageInfo,
} from "~/features/tournament/models/place";

const model = defineModel<QualificationsStageInfo | null>({ required: true });

defineProps<{
  disabled?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  blur: [];
}>();

const enabled = computed(() => model.value != null);

const onToggle = (value: boolean) => {
  if (value) {
    model.value = { places: [createEmptyTournamentPlace()] };
  } else {
    model.value = null;
  }
  emit("blur");
};
</script>
