<template>
  <div class="fixed top-0 left-0 right-0 z-50 flex flex-col backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs">
    <BracketGroupPills />

    <!-- Admin actions and rounds toolbar -->
    <div
      v-if="isAdminOrStaff && tourStore.selectedGroup"
      class="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200/60 dark:border-gray-800/60 px-3 py-1.5 bg-gray-50/70 dark:bg-gray-900/40"
    >
      <!-- Action buttons -->
      <div class="flex flex-wrap items-center gap-1.5">
        <UButton
          v-if="showRegenerateFinalMatchesButton"
          icon="i-mdi-refresh"
          color="primary"
          variant="soft"
          size="xs"
          label="إعادة إنشاء المباريات"
          :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
          :disabled="!isFinalGroupSelected"
          @click="emit('regenerate-final-matches')"
        />

        <UButton
          v-if="showRegenerateFinalMatchesButton"
          label="التأكيد على الخريطة"
          icon="i-mdi-play-circle"
          size="xs"
          color="primary"
          variant="solid"
          :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
          :disabled="!isFinalGroupSelected"
          @click="emit('open-start-confirm-map')"
        />

        <UButton
          v-if="showStartTournamentCta"
          label="بدء البطولة"
          icon="i-mdi-play"
          size="xs"
          color="primary"
          variant="solid"
          :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
          :disabled="!isFinalGroupSelected"
          @click="emit('open-start-confirm')"
        />

        <UButton
          v-if="showFinishTournamentCta"
          label="إنهاء البطولة"
          icon="i-mdi-check"
          size="xs"
          color="primary"
          variant="solid"
          :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
          :disabled="!isFinalGroupSelected"
          @click="emit('finish-tournament')"
        />

        <UButton
          v-if="showResumeFinalGroupAfterFinishCta"
          label="استكمال البطولة"
          icon="i-mdi-play"
          size="xs"
          color="primary"
          variant="solid"
          :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
          :disabled="!isFinalGroupSelected"
          @click="emit('resume-final-group-after-finish')"
        />
      </div>

      <!-- Rounds filter -->
      <div
        v-if="tourStore.rounds && tourStore.rounds.length > 0"
        class="flex items-center gap-1.5 mr-auto"
      >
        <USelectMenu
          v-model="selectedRoundId"
          :items="tourStore.rounds"
          label-key="name"
          value-key="id"
          size="xs"
          :search-attributes="['name']"
          class="w-48"
          :placeholder="tourStore.selectedRound?.name || 'اختر الجولة'"
          @update:model-value="onRoundSelected"
        />

        <UButton
          icon="i-heroicons-pencil"
          color="warning"
          variant="soft"
          size="xs"
          :disabled="!canEditSelectedRound"
          @click="openSelectedRoundEdit"
        >
          تعديل
        </UButton>

        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="soft"
          size="xs"
          :disabled="!tourStore.selectedRound"
          @click="clearRoundSelection"
        >
          مسح
        </UButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GroupType, type RoundGroupDetails } from "~/features/tournament/models/group";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";
import { useMyAuthStore } from "~/store/Auth";
import { useTournamentPhaseStore } from "~/store/tournamentPhase";
import {
  canShowRegenerateFinalMatches,
  finishAction,
  resumeAction,
  startAction,
} from "~/features/tournament/phase/phaseActions";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import BracketGroupPills from "./BracketGroupPills.vue";

const emit = defineEmits<{
  "regenerate-final-matches": [];
  "open-start-confirm": [];
  "edit-round": [round: RoundGroupDetails["rounds"][0]];
  "finish-tournament": [];
  "resume-final-group-after-finish": [];
  "open-start-confirm-map": [];
}>();

const userStore = useMyAuthStore();
const { user, isAdmin } = storeToRefs(userStore);
const phaseStore = useTournamentPhaseStore();

const tourStore = useTournamentBracketStore();
const route = useRoute();
const tourid = route.params.id?.toString() || '';
const getTourRequest = await useSingleTournament().getSingelTournament(tourid);
const tour = computed(() => getTourRequest.data.value);

watch(
  [tour, isAdmin],
  ([nextTour, admin]) => {
    if (nextTour) phaseStore.syncFromTour(nextTour, admin);
  },
  { immediate: true },
);

const isAdminOrStaff = computed(() => {
  const roles = user.value?.user.roles;
  return !!roles?.includes("SuperAdmin") || !!roles?.includes("StaffAdmin");
});

const isFinalGroupSelected = computed(
  () => tourStore.selectedGroup?.data.type === GroupType.Final,
);

const showRegenerateFinalMatchesButton = computed(() =>
  canShowRegenerateFinalMatches(phaseStore.context),
);

const showStartTournamentCta = computed(() =>
  startAction.canExecute(phaseStore.context),
);

const showFinishTournamentCta = computed(() =>
  finishAction.canExecute(phaseStore.context),
);

const showResumeFinalGroupAfterFinishCta = computed(() =>
  resumeAction.canExecute(phaseStore.context),
);

const selectedRoundId = ref<string | undefined>(tourStore.selectedRound?.id);

watch(
  () => tourStore.selectedRound?.id,
  (id) => {
    selectedRoundId.value = id;
  },
);

const onRoundSelected = (id?: string) => {
  if (!id) return;
  tourStore.handleRoundSelection(id);
};

const clearRoundSelection = () => {
  if (tourStore.selectedRound?.id) {
    tourStore.handleRoundSelection(tourStore.selectedRound.id);
  }
  selectedRoundId.value = undefined;
};

const canEditSelectedRound = computed(() => {
  return Boolean(
    isAdminOrStaff.value &&
    tourStore.selectedGroup &&
    tourStore.selectedRound?.id
  );
});

const openSelectedRoundEdit = () => {
  const roundId = tourStore.selectedRound?.id;
  if (!roundId) return;
  const round = tourStore.rounds.find((r) => r.id === roundId) || null;
  if (!round || !tourStore.selectedGroup) return;
  emit("edit-round", round);
};
</script>
