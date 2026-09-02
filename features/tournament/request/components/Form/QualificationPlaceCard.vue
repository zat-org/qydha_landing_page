<template>
  <div
    class="rounded-lg border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-800/80"
  >
    <div class="mb-4 flex items-center justify-between gap-2">
      <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        مكان التصفيات {{ index + 1 }}
      </h4>
      <UButton
        v-if="canRemove"
        color="error"
        variant="ghost"
        size="sm"
        icon="i-heroicons-trash"
        :disabled="disabled"
        @click="emit('remove')"
      />
    </div>

    <div class="flex flex-col gap-4">
      <UFormField
        label="وصف المكان"
        :name="`qualificationsStageInfo.places[${index}].locationDescription`"
        required
        :error="errors?.locationDescription"
      >
        <UInput
          v-model="place.locationDescription"
          :disabled="disabled"
          maxlength="255"
          placeholder="أدخل عنوان مكان التصفيات"
          @blur="emit('blur')"
        />
      </UFormField>

      <UFormField
        label="موقع المكان"
        :name="`qualificationsStageInfo.places[${index}].location`"
        required
        :error="errors?.location"
        :help="
          place.location.latitude != 0 && place.location.longitude != 0
            ? `الإحداثيات: ${place.location.latitude}, ${place.location.longitude}`
            : 'يرجى لصق رابط Google Maps واستخراج الموقع'
        "
      >
        <MapGoogleMapsUrlInput
          v-model:location="place.location"
          v-model:location-name="place.locationDescription"
          :disabled="disabled"
          :name="`place-location-${index}`"
          label="رابط Google Maps"
          @parsed="emit('blur')"
        />
      </UFormField>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <UFormField
          label="تاريخ البداية"
          :name="`qualificationsStageInfo.places[${index}].startAt`"
          required
          :error="errors?.startAt"
        >
          <AsyncDatePicker
            v-model="place.startAt"
            :disabled="disabled"
            :min-date="minStartDate ?? new Date()"
            @update:model-value="emit('blur')"
          />
        </UFormField>
        <UFormField
          label="تاريخ النهاية"
          :name="`qualificationsStageInfo.places[${index}].endAt`"
          required
          :error="errors?.endAt"
        >
          <AsyncDatePicker
            v-model="place.endAt"
            :disabled="disabled"
            :min-date="place.startAt || undefined"
            @update:model-value="emit('blur')"
          />
        </UFormField>
        <UFormField
          label="عدد الفرق المتنافسة"
          :name="`qualificationsStageInfo.places[${index}].competingTeamsCount`"
          required
          :error="errors?.competingTeamsCount"
        >
          <UInput
            v-model.number="place.competingTeamsCount"
            type="number"
            min="1"
            :disabled="disabled"
            placeholder="1"
            @blur="emit('blur')"
          />
        </UFormField>
        <UFormField
          label="عدد الطاولات المتاحة"
          :name="`qualificationsStageInfo.places[${index}].availableTablesCount`"
          required
          :error="errors?.availableTablesCount"
        >
          <UInput
            v-model.number="place.availableTablesCount"
            type="number"
            min="1"
            :disabled="disabled"
            placeholder="1"
            @blur="emit('blur')"
          />
        </UFormField>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CreateTournamentPlaceDto } from "~/features/tournament/models/place";

const place = defineModel<CreateTournamentPlaceDto>({ required: true });

defineProps<{
  index: number;
  canRemove: boolean;
  disabled?: boolean;
  minStartDate?: Date;
  errors?: {
    locationDescription?: string;
    location?: string;
    startAt?: string;
    endAt?: string;
    competingTeamsCount?: string;
    availableTablesCount?: string;
  };
}>();

const emit = defineEmits<{
  remove: [];
  blur: [];
}>();
</script>
