<template>
  <section
    class="mx-4 mt-5 rounded-2xl border border-amber-200/80 bg-linear-to-b from-amber-50/85 to-white p-4 shadow-sm dark:border-amber-700/40 dark:from-amber-900/20 dark:to-gray-950/30 sm:mx-8 sm:p-5"
  >
    <div class="mb-3 flex items-center gap-2">
      <UIcon name="i-mdi-trophy-award" class="size-5 text-amber-500 dark:text-amber-400" />
      <h3 class="text-base font-bold text-gray-900 dark:text-white">الفائزون</h3>
      <UBadge color="warning" variant="soft" size="xs" class="rounded-full">
        {{ winners.length }}
      </UBadge>
    </div>

    <UAccordion
      v-model="openWinners"
      type="multiple"
      collapsible
      dir="rtl"
      :items="accordionItems"
      class="w-full"
      :ui="{
        root: 'space-y-2',
        item: 'rounded-xl border border-amber-200/70 overflow-hidden bg-white/90 dark:border-amber-700/40 dark:bg-gray-900/60',
        trigger: 'px-3 py-3 text-start hover:bg-amber-50/70 dark:hover:bg-amber-950/20',
        content: 'px-3 pb-3',
      }"
    >
      <template
        v-for="winner in winners"
        :key="winner.teamId"
        #[`winner-${winner.teamId}`]
      >
        <div class="space-y-2 border-t border-amber-100 pt-3 dark:border-amber-800/40">
          <div class="flex items-center gap-1.5">
            <UIcon
              name="i-mdi-account-multiple"
              class="size-4 text-amber-600 dark:text-amber-400"
            />
            <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
              اللاعبون
            </span>
            <UBadge
              v-if="teamCache[winner.teamId]?.team?.players?.length"
              color="neutral"
              variant="soft"
              size="xs"
              class="rounded-full"
            >
              {{ teamCache[winner.teamId]!.team!.players.length }}
            </UBadge>
            <UIcon
              v-if="teamCache[winner.teamId]?.pending"
              name="i-mdi-loading"
              class="size-3.5 animate-spin text-amber-500"
            />
          </div>

          <p
            v-if="teamCache[winner.teamId]?.error"
            class="text-xs text-red-500"
          >
            تعذر تحميل بيانات الفريق
          </p>

          <div
            v-else-if="teamCache[winner.teamId]?.pending && !teamCache[winner.teamId]?.team"
            class="flex items-center gap-2 py-2 text-xs text-gray-500"
          >
            <UIcon name="i-mdi-loading" class="size-3.5 animate-spin" />
            جاري تحميل اللاعبين…
          </div>

          <div
            v-else-if="!teamCache[winner.teamId]?.team?.players?.length"
            class="rounded-lg border border-dashed border-gray-300 px-3 py-4 text-center text-xs text-gray-500 dark:border-gray-700"
          >
            لا يوجد لاعبون في هذا الفريق
          </div>

          <div v-else class="grid gap-2 sm:grid-cols-2">
            <PlayerContactCard
              v-for="player in teamCache[winner.teamId]?.team?.players ?? []"
              :key="player.id"
              :player="player"
            />
          </div>
        </div>
      </template>
    </UAccordion>
  </section>
</template>

<script lang="ts" setup>
import type { TournamentWinner } from '~/features/tournament/models/tournament';
import type { ITeam } from '~/features/tournament/models/tournamentTeam';
import { useTourrnamentTeam } from '~/features/tournament/teams/composables/tourrnamentTeam';
import PlayerContactCard from '~/features/tournament/teams/components/PlayerContactCard.vue';

type CachedTeam = {
  pending: boolean;
  error: boolean;
  team: ITeam | null;
};

const props = defineProps<{
  tournamentId: string;
  winners: TournamentWinner[];
}>();

const { getTourTeam } = useTourrnamentTeam();
const { fetchREQ } = getTourTeam();
const teamCache = reactive<Record<string, CachedTeam>>({});
const openWinners = ref<string[]>([]);

const accordionItems = computed(() =>
  props.winners.map((winner) => {
    const teamName =
      teamCache[winner.teamId]?.team?.name ?? winner.teamName ?? 'فريق';
    return {
      label: `المركز ${winner.order} — ${teamName}`,
      value: winner.teamId,
      slot: `winner-${winner.teamId}`,
      icon: 'i-mdi-trophy',
    };
  }),
);

async function loadWinnerTeam(teamId: string) {
  if (!teamId || !props.tournamentId) return;
  const cached = teamCache[teamId];
  if (cached?.team || cached?.pending) return;

  teamCache[teamId] = { pending: true, error: false, team: null };
  try {
    const team = await fetchREQ(props.tournamentId, teamId);
    teamCache[teamId] = {
      pending: false,
      error: !team,
      team,
    };
  } catch {
    teamCache[teamId] = { pending: false, error: true, team: null };
  }
}

watch(
  openWinners,
  (opened) => {
    for (const teamId of opened) {
      void loadWinnerTeam(teamId);
    }
  },
  { deep: true },
);

watch(
  () => [props.tournamentId, props.winners.map((w) => w.teamId).join(',')] as const,
  () => {
    openWinners.value = [];
    for (const key of Object.keys(teamCache)) {
      delete teamCache[key];
    }
  },
);
</script>
