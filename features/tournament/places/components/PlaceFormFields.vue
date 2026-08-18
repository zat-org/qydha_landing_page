<template>
  <div class="flex flex-col gap-4">
    <UFormField
      label="وصف المكان"
      name="locationDescription"
      required
    >
      <UInput
        v-model="place.locationDescription"
        maxlength="255"
        placeholder="أدخل عنوان المكان"
      />
    </UFormField>

    <UFormField
      label="موقع المكان"
      name="location"
      required
      :help="
        place.location.latitude != 0 && place.location.longitude != 0
          ? `الإحداثيات: ${place.location.latitude}, ${place.location.longitude}`
          : 'يرجى لصق رابط Google Maps واستخراج الموقع'
      "
    >
      <MapGoogleMapsUrlInput
        v-model:location="place.location"
        v-model:location-name="place.locationDescription"
        name="place-location"
        label="رابط Google Maps"
      />
    </UFormField>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <UFormField label="تاريخ البداية" name="startAt" required>
        <AsyncDatePicker v-model="place.startAt" :min-date="new Date()" />
      </UFormField>
      <UFormField label="تاريخ النهاية" name="endAt" required>
        <AsyncDatePicker
          v-model="place.endAt"
          :min-date="place.startAt || undefined"
        />
      </UFormField>
      <UFormField
        label="عدد الطاولات المتاحة"
        name="availableTablesCount"
        required
      >
        <UInput
          v-model.number="place.availableTablesCount"
          type="number"
          :min="minTablesCount"
          placeholder="1"
        />
      </UFormField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CreateTournamentPlaceDto } from "~/features/tournament/models/place";

const place = defineModel<CreateTournamentPlaceDto>({ required: true });

withDefaults(
  defineProps<{
    minTablesCount?: number;
  }>(),
  { minTablesCount: 1 },
);
</script>
