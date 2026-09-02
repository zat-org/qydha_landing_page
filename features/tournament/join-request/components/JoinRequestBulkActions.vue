<template>
  <div
    v-if="canMutate"
    :class="
      compact
        ? 'contents'
        : 'flex flex-col gap-3 rounded-xl border border-gray-200/80 bg-white/60 p-3 dark:border-gray-800 dark:bg-gray-900/40'
    "
  >
    <UFormField
      v-if="showRandom && !compact"
      label="مكان الاعتماد"
      class="max-w-md"
    >
      <USelect
        v-model="targetPlaceId"
        :items="placeOptions"
        value-key="value"
        label-key="label"
        placeholder="اختر مكان التصفيات"
        class="w-full"
      />
    </UFormField>

    <p v-if="showRandom && !compact" class="text-xs text-gray-500 dark:text-gray-400">
      الاختيار العشوائي: عدد للموافقة عليه + مكان واحد نسحب منه فقط — ليس من
      كل الطلبات. «موافقة على كل الأماكن» يوزّع النظام على جميع الأماكن.
    </p>
    <p
      v-else-if="!compact"
      class="text-xs text-gray-500 dark:text-gray-400"
    >
      «موافقة أولية على كل الأماكن» يوزّع النظام تلقائياً دون تحديد مكان.
    </p>

    <div
      :class="
        compact
          ? 'contents'
          : 'flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end'
      "
    >
      <UButton
        color="primary"
        :variant="'soft'"
        :size="compact ? 'sm' : 'md'"
        label="موافقة أولية على كل الأماكن"
        icon="i-mdi-check-all"
        :loading="patching"
        :disabled="patching"
        @click="runAllApplicable"
      />
      <UFieldGroup v-if="showRandom" class="min-w-0 flex-1 sm:max-w-md">
        <UInput
          v-model.number="randomCount"
          type="number"
          :min="1"
          placeholder="عدد الفرق"
          class="min-w-24"
        />
        <UButton
          color="primary"
          label="اختيار عشوائي"
          :loading="patching"
          :disabled="!canRunRandom"
          @click="runRandom"
        />
      </UFieldGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import {
  getJoinRequestTargetPlaces,
  placeOptionLabel,
} from "~/features/tournament/join-request/composables/joinRequestPlaces.utils";
import { useTournamentJoinRequest } from "~/features/tournament/join-request/composables/TournamentJoinRequest";

const props = withDefaults(
  defineProps<{
    tournamentId: string;
    places: GetTournamentPlace[];
    canMutate: boolean;
    /** Hide random consider (e.g. dashboard summary). */
    showRandom?: boolean;
    /** Inline toolbar: button only, no wrapper copy. */
    compact?: boolean;
  }>(),
  { showRandom: true, compact: false },
);

const emit = defineEmits<{ success: [] }>();

const targetPlaceId = defineModel<string | null>("targetPlaceId", {
  default: null,
});

const { considerAllApplicable, considerRandom } = useTournamentJoinRequest();

const patching = ref(false);
const randomCount = ref(1);

const targetPlaces = computed(() => getJoinRequestTargetPlaces(props.places));

const placeOptions = computed(() =>
  targetPlaces.value.map((p) => ({
    label: placeOptionLabel(p),
    value: p.id,
  })),
);

const canRunRandom = computed(
  () =>
    props.showRandom &&
    props.canMutate &&
    !patching.value &&
    !!targetPlaceId.value &&
    randomCount.value > 0,
);

async function runAllApplicable() {
  patching.value = true;
  try {
    const ok = await considerAllApplicable(props.tournamentId);
    if (ok) emit("success");
  } finally {
    patching.value = false;
  }
}

async function runRandom() {
  if (!targetPlaceId.value || randomCount.value < 1) return;
  patching.value = true;
  try {
    const ok = await considerRandom(
      props.tournamentId,
      randomCount.value,
      targetPlaceId.value,
    );
    if (ok) emit("success");
  } finally {
    patching.value = false;
  }
}
</script>
