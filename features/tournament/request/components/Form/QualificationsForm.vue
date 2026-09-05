<template>
  <UCard
    :ui="{
      root: 'min-h-full overflow-visible',
      body: 'px-3 py-3 sm:p-4',
      header: 'px-3 py-2 sm:px-4 sm:py-3',
    }"
    class="mx-auto min-h-full max-w-7xl bg-gray-50 dark:bg-gray-900"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 md:text-2xl">
          أماكن مرحلة التصفيات
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          اختياري — فعّل التصفيات وأضف أماكن اللعب. البداية بعد نهاية طلبات الانضمام
        </p>
        <UButton
          v-if="managePlacesHref"
          class="mt-2"
          size="xs"
          variant="soft"
          icon="i-heroicons-map-pin"
          :to="managePlacesHref"
          label="إدارة الأماكن من صفحة الأماكن"
        />
      </div>
    </template>

    <UForm :state="model" class="flex flex-col gap-4">
      <QualificationsStageToggle
        v-model="model.qualificationsStageInfo"
        :disabled="disabledFields?.qualificationsStageInfo"
        :error="errors?.qualificationsStageInfo"
        @blur="onFieldBlur?.('qualificationsStageInfo')"
      />
      <QualificationPlacesEditor
        v-model="model.qualificationsStageInfo"
        :disabled="disabledFields?.qualificationsStageInfo"
        :error="errors?.qualificationsStageInfo"
        :errors="errors"
        :min-start-date="minStartDate"
        @blur="onFieldBlur?.('qualificationsStageInfo')"
      />
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import QualificationsStageToggle from "~/features/tournament/request/components/Form/QualificationsStageToggle.vue";
import QualificationPlacesEditor from "~/features/tournament/request/components/Form/QualificationPlacesEditor.vue";
import { minQualificationStartDate } from "~/features/tournament/request/composables/tournamentRequestDateUtils";

const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
}>();

const { errors, onFieldBlur, disabledFields } = toRefs(props);
const model = defineModel<any>({ required: true });

const minStartDate = computed(() =>
  minQualificationStartDate(model.value.addPlayersByQydha, model.value.joinRequestEndAt),
);

const route = useRoute();
const managePlacesHref = computed(() => {
  const id = route.params.id?.toString();
  if (id && route.path.includes("/edit")) {
    return `/tournament/${id}/places`;
  }
  return null;
});
</script>
