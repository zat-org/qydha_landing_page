<template>
  <UCard
    class="mx-auto w-full max-w-[min(100%,96rem)] shadow-lg shadow-gray-900/5 dark:shadow-none ring-1 ring-gray-200/80 dark:ring-gray-800/80"
    :ui="{
      root: 'overflow-hidden rounded-2xl',
      header: 'p-0 border-b border-gray-200/90 dark:border-gray-800/90 bg-gray-50/40 dark:bg-gray-950/30',
      body: 'p-0',
    }"
  >
    <template v-if="tour" #header>
      <TournamentGetHeader
        :id="id"
        :is-admin="isAdmin"
        :tournament="tour?.tournament"
        @back="returnToTournament"
        @refreshed="refreshTournament"
      />
    </template>
    
    <Loading v-if="pending && !tour" class="py-20" />
    <div v-else-if="tour" class="flex flex-col">
      <TournamentGetHero
        v-model:hero-accordion-open="heroAccordionOpen"
        v-model:details-sections-open="detailsSectionsOpen"
        :tour="tour"
        :hero-accordion-items="heroAccordionItems"
        :details-accordion-items="detailsAccordionItems"
        :detailed-state="detailedState"
        :get-state="getState"
        :get-type="getType"
        :get-currency="getCurrency"
      />
      <section
        v-if="showWinnersSection"
        class="mx-4 mt-5 rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/85 to-white p-4 shadow-sm dark:border-amber-700/40 dark:from-amber-900/20 dark:to-gray-950/30 sm:mx-8 sm:p-5"
      >
        <div class="mb-3 flex items-center gap-2">
          <UIcon name="i-mdi-trophy-award" class="size-5 text-amber-500 dark:text-amber-400" />
          <h3 class="text-base font-bold text-gray-900 dark:text-white">الفائزون</h3>
        </div>
        <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="winner in winnersSorted"
            :key="winner.teamId"
            class="rounded-xl border border-amber-200/70 bg-white/90 p-3 shadow-sm dark:border-amber-700/40 dark:bg-gray-900/60"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-bold text-gray-900 dark:text-white">
                المركز {{ winner.order }}
              </p>
              <UBadge color="warning" variant="soft" size="sm">#{{ winner.order }}</UBadge>
            </div>
            <p class="mt-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {{ winner.teamName }}
            </p>
          </article>
        </div>
      </section>
      <TournamentGetManagementBoard
        :id="id"
        :detailed-state="detailedState"
        :is-admin="isAdmin"
        :tournament-state="tour.tournament.state"
        :final-group-state="finalGroup?.state"
        :has-qualifications-stage="tour.tournament.hasQualificationsStage"
        @refreshed="refreshTournament"
      />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import TournamentGetHeader from './TournamentGetHeader.vue';
import TournamentGetHero from './TournamentGetHero.vue';
import TournamentGetManagementBoard from './TournamentGetManagementBoard.vue';
import { provideTournamentGetWorkspace } from './useTournamentGetWorkspace';
import { useMyAuthStore } from "~/store/Auth";
import Loading from "~/components/loading.vue";
import {
  TournamentState,
  TournamentDetailedState,
} from "~/features/tournament/models/tournament";
import type { TournamentType } from "~/features/tournament/models/tournamenetType";
import type { TournamentPrizeCurrency } from "~/features/tournament/models/tournamentPrize";
import { GroupType } from "~/features/tournament/models/group";
import { useSingleTournamnetMangmentStore } from "~/store/SingleTournamnetMangment";

const userStore = useMyAuthStore();
const tournamentManagementStore = useSingleTournamnetMangmentStore();
const router = useRouter();
const returnToTournament = () => {
  router.back();
  tournamentManagementStore.setActiveStep(0);
};

const isAdmin = computed((): boolean => {
  const roles = userStore.user?.user.roles;
  return !!roles?.includes("SuperAdmin") || !!roles?.includes("StaffAdmin");
});

const HERO_ACCORDION_ITEM_VALUE = "tournament-hero";
const heroAccordionOpen = ref<string | undefined>(undefined);
const heroAccordionItems = [
  {
    value: HERO_ACCORDION_ITEM_VALUE,
    slot: "tournament-hero",
    label: "",
  },
];

const detailsSectionsOpen = ref<string[]>([]);

const props = defineProps<{ id: string }>();

provideTournamentGetWorkspace(props.id);

const { getSingelTournament, getTournamnetStateOptions } = useTournament();
const { getTournamentTypeOptions, getTournamentPrizeCurrency } =
  useTournamentRequest();
const getREQ = await getSingelTournament(props.id);
const pending = computed(() => getREQ.pending.value);
const tour = computed(() => getREQ.data.value?.data);

const refreshTournament = async () => {
  await getREQ.refresh();
};

const detailsAccordionItems = computed(() => {
  const t = tour.value?.tournament;
  if (!t) return [] as { label: string; slot: string; icon: string }[];

  const items: { label: string; slot: string; icon: string }[] = [];

  if (t.sponsors?.length) {
    items.push({
      label: "الرعاة",
      slot: "acc-sponsors",
      icon: "i-mdi-handshake-outline",
    });
  }

  items.push({
    label: "الجوائز",
    slot: "acc-prizes",
    icon: "i-mdi-trophy-variant-outline",
  });

  if (t.tournamentRules?.length) {
    items.push({
      label: "قواعد البطولة",
      slot: "acc-rules",
      icon: "i-mdi-book-open-page-variant",
    });
  }

  if (t.moderators?.length) {
    items.push({
      label: "المشرفون",
      slot: "acc-moderators",
      icon: "i-mdi-account-supervisor-outline",
    });
  }

  return items;
});

const finalGroup = computed(() =>
  tour.value?.tournament?.groups?.find((g) => g.type === GroupType.Final),
);
const winnersSorted = computed(() =>
  [...(tour.value?.tournament?.winners ?? [])].sort((a, b) => a.order - b.order),
);
const showWinnersSection = computed(
  () =>
    tour.value?.tournament?.state === TournamentState.Finished &&
    winnersSorted.value.length > 0,
);

const detailedState = computed(() => tour.value?.tournament?.detailedState);

const states = getTournamnetStateOptions();
const getState = (value: TournamentState) => {
  const result = states.find((s) => s.value == value);
  if (result) return result;
};
const types = getTournamentTypeOptions();
const getType = (value: TournamentType) => {
  const result = types.find((s) => s.value == value);
  if (result) return result;
};
const currencies = getTournamentPrizeCurrency();
const getCurrency = (value: TournamentPrizeCurrency) => {
  const result = currencies.find((cur) => cur.value == value);
  if (result) return result;
};
</script>
