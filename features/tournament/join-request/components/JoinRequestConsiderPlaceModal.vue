<template>
  <UModal v-model:open="open">
    <template #header>
      <span class="font-semibold">موافقة أولية — اختيار المكان</span>
    </template>
    <template #body>
      <div class="space-y-4">
        <p v-if="rows.length > 1" class="text-sm text-gray-600 dark:text-gray-300">
          {{ rows.length }} طلب/فريق محدد. الفرق ذات مكان مفضل تُسند إليه تلقائياً.
        </p>
        <p v-else-if="rows[0]?.teamName" class="text-sm font-medium">
          {{ rows[0].teamName }}
        </p>

        <UAlert
          v-if="lockedPlaceId"
          color="info"
          variant="subtle"
          :title="`سيُسند إلى: ${lockedPlaceLabel}`"
          description="هذا الفريق اختار هذا المكان مسبقاً."
        />

        <UFormField v-else label="مكان التصفيات" required>
          <USelect
            v-model="selectedPlaceId"
            :items="placeOptions"
            value-key="value"
            label-key="label"
            placeholder="اختر مكان الاعتماد"
            class="w-full"
          />
        </UFormField>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="open = false">
          إلغاء
        </UButton>
        <UButton
          color="primary"
          :loading="loading"
          :disabled="!canConfirm"
          @click="onConfirm"
        >
          تأكيد الموافقة
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import type { TeamJoinRequestListItem } from "~/features/tournament/models/TournamentJoinRequest";
import {
  getJoinRequestTargetPlaces,
  placeOptionLabel,
} from "~/features/tournament/join-request/composables/joinRequestPlaces.utils";

const props = defineProps<{
  places: GetTournamentPlace[];
  rows: TeamJoinRequestListItem[];
  loading?: boolean;
  resolvePlaceLabel: (placeId: string | null | undefined) => string;
}>();

const emit = defineEmits<{ confirm: [placeId: string] }>();

const open = defineModel<boolean>("open", { default: false });

const selectedPlaceId = ref<string | null>(null);

const targetPlaces = computed(() => getJoinRequestTargetPlaces(props.places));

const placeOptions = computed(() =>
  targetPlaces.value.map((p) => ({
    label: placeOptionLabel(p),
    value: p.id,
  })),
);

/** Single row with preferred place, or all rows share the same preference. */
const lockedPlaceId = computed(() => {
  if (!props.rows.length) return null;
  const ids = props.rows.map((r) => r.selectedQualificationsPlaceId).filter(Boolean);
  if (props.rows.length === 1 && props.rows[0].selectedQualificationsPlaceId) {
    return props.rows[0].selectedQualificationsPlaceId;
  }
  if (ids.length === props.rows.length && new Set(ids).size === 1) {
    return ids[0] as string;
  }
  return null;
});

const lockedPlaceLabel = computed(() =>
  lockedPlaceId.value
    ? props.resolvePlaceLabel(lockedPlaceId.value)
    : "",
);

const canConfirm = computed(
  () => !!lockedPlaceId.value || !!selectedPlaceId.value,
);

watch(open, (isOpen) => {
  if (isOpen) {
    selectedPlaceId.value = lockedPlaceId.value ?? null;
  }
});

function onConfirm() {
  const placeId = lockedPlaceId.value ?? selectedPlaceId.value;
  if (!placeId) return;
  emit("confirm", placeId);
}
</script>
