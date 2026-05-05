<template>
  <div class="flex flex-col fixed top-0 left-0 right-0 z-50">
    <UButtonGroup
      v-if="tourStore.tournament.length > 0"
      orientation="horizontal"
      class="flex flex-wrap"
    >
      <UButton
        v-for="item in tourStore.tournament"
        :key="item.data.id"
        class="basis-[20px] grow"
        :label="`${item.data.name}`"
        block
        :color="tourStore.selectedGroup?.data.id == item.data.id ? 'success' : 'neutral'"
        @click="handleGroupSelection(item.data.id.toString())"
      />
    </UButtonGroup>
    <div
      v-if="isAdminOrStaff && tourStore.selectedGroup"
      class="flex flex-wrap items-center gap-2 border-b border-gray-200/80 bg-white/90 p-2 dark:border-gray-800 dark:bg-gray-950/60"
    >
      <UButton
        v-if="showRegenerateFinalMatchesButton"
        icon="i-mdi-refresh"
        color="primary"
        variant="soft"
        size="sm"
        label="اعادة انشاء المباريات"
        class="min-h-9"
        :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
        :disabled="!isFinalGroupSelected"
        @click="emit('regenerate-final-matches')"
      />

      <UButton
        v-if="showStartTournamentCta"
        label="بدء البطولة"
        icon="i-mdi-play"
        size="sm"
        color="primary"
        variant="solid"
        class="min-h-9"
        :title="!isFinalGroupSelected ? 'متاح للمجموعة النهائية فقط' : undefined"
        :disabled="!isFinalGroupSelected"
        @click="emit('open-start-confirm')"
      />

      <template v-if="tourStore.rounds.length > 0">
        <USelectMenu
          v-model="selectedRoundId"
          :items="tourStore.rounds"
          label-key="name"
          value-key="id"
          :search-attributes="['name']"
          class="w-[220px]"
          :placeholder="tourStore.selectedRound?.name || 'اختر الجولة'"
          @update:model-value="onRoundSelected"
        />

        <UButton
          icon="i-heroicons-pencil"
          color="warning"
          variant="soft"
          :disabled="!canEditSelectedRound"
          @click="openSelectedRoundEdit"
        >
          تعديل
        </UButton>

        <UButton
          icon="i-heroicons-x-mark"
          color="neutral"
          variant="soft"
          :disabled="!tourStore.selectedRound"
          @click="clearRoundSelection"
        >
          مسح
        </UButton>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GroupState, GroupType, type RoundGroupDetails } from "~/features/tournament/models/group";
import {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";
import { useMyTournamentStore } from "~/features/tournament/core/stores/tournament";
import { useMyAuthStore } from "~/store/Auth";

const emit = defineEmits<{
  "regenerate-final-matches": [];
  "open-start-confirm": [];
  "edit-round": [round: RoundGroupDetails["rounds"][0]];
}>();

const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);

const tourStore = useMyTournamentStore();

const isAdminOrStaff = computed(() => {
  const roles = user.value?.user.roles;
  return !!roles?.includes("SuperAdmin") || !!roles?.includes("StaffAdmin");
});

const finalGroup = computed(() =>
  tourStore.tournamentDashboard?.groups?.find((g) => g.type === GroupType.Final),
);

const isFinalGroupSelected = computed(
  () => tourStore.selectedGroup?.data.type === GroupType.Final,
);

const showRegenerateFinalMatchesButton = computed(
  () =>
    tourStore.tournamentDashboard?.detailedState ===
    TournamentDetailedState.ManagingFinalGroupBracket,
);

const showStartTournamentCta = computed(
  () =>
    tourStore.tournamentDashboard?.state === TournamentState.Upcoming &&
    finalGroup.value?.state === GroupState.MatchesGenerated,
);

const selectedRoundId = ref<string | undefined>(tourStore.selectedRound?.id);

watch(
  () => tourStore.selectedRound?.id,
  (id) => {
    selectedRoundId.value = id;
  },
);

const handleGroupSelection = (group_id: string) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};

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
      tourStore.selectedRound?.id &&
      tourStore.tournamentDashboard?.state == TournamentState.Upcoming,
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
