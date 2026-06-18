<template>
  <div class="flex flex-col gap-2">
    <UFormField
      :label="label"
      :name="name"
      :help="helpText"
      :error="displayError"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start">
        <UInput
          v-model="url"
          class="flex-1"
          dir="ltr"
          type="url"
          :placeholder="placeholder"
          :disabled="disabled || parsing"
          @keydown.enter.prevent="parseUrl"
        />
        <UButton
          label="استخراج الموقع"
          icon="i-heroicons-map-pin"
          :disabled="disabled || !url.trim() || parsing"
          :loading="parsing"
          @click="parseUrl"
        />
      </div>
    </UFormField>

    <div
      v-if="parsing"
      class="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800/60"
    >
      <UIcon
        name="i-heroicons-arrow-path"
        class="size-5 shrink-0 animate-spin text-primary-500"
      />
      <p class="text-sm text-gray-600 dark:text-gray-300">
        جاري استخراج الموقع من الرابط...
      </p>
    </div>


  </div>
</template>

<script lang="ts" setup>
import {
  buildGoogleMapsUrl,
  parseGoogleMapsUrlAsync,
  type ParsedGoogleMapsLocation,
} from "~/utils/parseGoogleMapsUrl";

export interface LocationValue {
  latitude: number;
  longitude: number;
}

const props = withDefaults(
  defineProps<{
    label?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    help?: string;
    autoApply?: boolean;
  }>(),
  {
    label: "رابط خرائط Google",
    name: "googleMapsUrl",
    placeholder: "https://maps.app.goo.gl/... أو https://www.google.com/maps/place/...",
    disabled: false,
    help: "الصق رابط Google Maps (القصير أو الكامل) ثم اضغط استخراج الموقع",
    autoApply: true,
  },
);

const location = defineModel<LocationValue>("location", { required: true });
const locationName = defineModel<string | null>("locationName");

const emit = defineEmits<{
  parsed: [value: ParsedGoogleMapsLocation];
  error: [message: string];
}>();

const url = ref("");
const parsing = ref(false);
const errorMessage = ref<string | null>(null);
const parsedPreview = ref<ParsedGoogleMapsLocation | null>(null);

const helpText = computed(() => props.help);
const displayError = computed(() => errorMessage.value ?? undefined);

const hasValidCoords = (value?: LocationValue | null) =>
  value != null &&
  Number.isFinite(value.latitude) &&
  Number.isFinite(value.longitude) &&
  (value.latitude !== 0 || value.longitude !== 0);

const displayData = computed(() => {
  if (parsedPreview.value) {
    return parsedPreview.value;
  }

  if (!hasValidCoords(location.value)) {
    return null;
  }

  return {
    latitude: location.value.latitude,
    longitude: location.value.longitude,
    name: locationName.value,
  };
});

const syncFromExistingLocation = () => {
  if (!hasValidCoords(location.value)) return;

  parsedPreview.value = {
    latitude: location.value.latitude,
    longitude: location.value.longitude,
    name: locationName.value ?? null,
  };

  url.value = buildGoogleMapsUrl(
    location.value.latitude,
    location.value.longitude,
    locationName.value,
  );
};

watch(
  () => [location.value.latitude, location.value.longitude, locationName.value],
  () => {
    if (!hasValidCoords(location.value)) {
      parsedPreview.value = null;
      return;
    }

    if (url.value.trim()) return;

    syncFromExistingLocation();
  },
  { immediate: true },
);

const applyParsed = (parsed: ParsedGoogleMapsLocation) => {
  parsedPreview.value = parsed;
  errorMessage.value = null;

  if (props.autoApply) {
    location.value = {
      latitude: parsed.latitude,
      longitude: parsed.longitude,
    };

    if (parsed.name) {
      locationName.value = parsed.name;
    }
  }

  emit("parsed", parsed);
};

const parseUrl = async () => {
  errorMessage.value = null;

  const value = url.value.trim();
  if (!value) {
    parsedPreview.value = null;
    errorMessage.value = "يرجى إدخال رابط Google Maps";
    emit("error", errorMessage.value);
    return;
  }

  parsing.value = true;

  try {
    const parsed = await parseGoogleMapsUrlAsync(value);

    if (!parsed) {
      parsedPreview.value = null;
      errorMessage.value =
        "تعذر استخراج الموقع. تأكد أن الرابط من Google Maps ويحتوي على إحداثيات.";
      emit("error", errorMessage.value);
      return;
    }

    applyParsed(parsed);
  } catch {
    parsedPreview.value = null;
    errorMessage.value =
      "تعذر فتح الرابط القصير. جرّب نسخ الرابط الكامل من Google Maps.";
    emit("error", errorMessage.value);
  } finally {
    parsing.value = false;
  }
};
</script>
