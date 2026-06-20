<template>
  <UCard
    class="mx-auto w-full max-w-[min(100%,96rem)] shadow-lg shadow-gray-900/5 dark:shadow-none ring-1 ring-gray-200/80 dark:ring-gray-800/80"
    :ui="{
      root: 'overflow-hidden rounded-2xl',
      header:
        'p-0 border-b border-gray-200/90 dark:border-gray-800/90 bg-gray-50/40 dark:bg-gray-950/30',
      body: 'p-0',
    }"
  >
    <template v-if="tour" #header>
      <TournamentGetHeader
        :id="id"
        :is-admin="isAdmin"
        :tournament="tour.tournament"
        @refreshed="wrappedRefresh"
      />
    </template>

    <Loading v-if="pending && !tour" class="py-20" />
    <div v-else-if="tour" class="flex flex-col">
      <TournamentGetHero :tour="tour" />

      <TournamentGetWinnersSection
        v-if="showWinnersSection"
        :winners="winnersSorted"
      />

      <TournamentGetManagementBoard :id="id" @refreshed="wrappedRefresh">
        <slot />
      </TournamentGetManagementBoard>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import TournamentGetHeader from "./TournamentGetHeader.vue";
import TournamentGetHero from "./TournamentGetHero.vue";
import TournamentGetWinnersSection from "./TournamentGetWinnersSection.vue";
import TournamentGetManagementBoard from "./TournamentGetManagementBoard.vue";
import { useMyAuthStore } from "~/store/Auth";
import { useTournamentPhaseStore } from "~/store/tournamentPhase";
import { useTournamentOutletRouteSync } from "~/features/tournament/detail/composables/logic/useTournamentOutletRouteSync";
import Loading from "~/components/loading.vue";

const props = defineProps<{ id: string }>();

const userStore = useMyAuthStore();
const { isAdmin } = storeToRefs(userStore);
const phaseStore = useTournamentPhaseStore();
const { pending, tour, refresh, winnersSorted, showWinnersSection } =
  await useTournamentDetailPage(props.id);

watch(
  [tour, isAdmin],
  ([nextTour, admin]) => {
    if (nextTour) phaseStore.syncFromTour(nextTour, admin);
  },
  { immediate: true, deep: true },
);

onUnmounted(() => {
  phaseStore.reset();
});

const wrappedRefresh = async () => {
  await refresh();
  if (tour.value) phaseStore.syncFromTour(tour.value, isAdmin.value);
};

useTournamentOutletRouteSync(() => props.id);
</script>
