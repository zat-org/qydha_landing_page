<template>
  <section
    class="mx-4 mt-5 rounded-2xl border border-amber-200/80 bg-linear-to-b from-amber-50/85 to-white p-4 shadow-sm dark:border-amber-700/40 dark:from-amber-900/20 dark:to-gray-950/30 sm:mx-8 sm:p-5"
  >
    <div class="mb-3 flex items-center gap-2">
      <UIcon name="i-mdi-trophy-award" class="size-5 text-amber-500 dark:text-amber-400" />
      <h3 class="text-base font-bold text-gray-900 dark:text-white">الفائزون</h3>
    </div>
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
      <article
        v-for="winner in winners"
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
          {{ teamCache[winner.teamId]?.team?.name ?? winner.teamName }}
        </p>

        <div class="mt-3 space-y-2 border-t border-amber-100 pt-3 dark:border-amber-800/40">
          <div class="flex items-center gap-1.5">
            <UIcon name="i-mdi-account-multiple" class="size-4 text-amber-600 dark:text-amber-400" />
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

          <div
            v-for="player in teamCache[winner.teamId]?.team?.players ?? []"
            :key="player.id"
            class="rounded-lg border border-gray-200/80 bg-gray-50/80 p-2.5 dark:border-gray-700 dark:bg-gray-950/40"
          >
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {{ player.name }}
            </p>
            <p
              v-if="player.phone"
              class="mt-0.5 text-xs text-gray-500"
              dir="ltr"
            >
              {{ player.phone }}
            </p>
            <p
              v-if="player.email"
              class="mt-0.5 text-xs text-gray-500"
              dir="ltr"
            >
              {{ player.email }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { TournamentWinner } from '~/features/tournament/models/tournament';
import type { ITeam } from '~/features/tournament/models/tournamentTeam';
import { useTourrnamentTeam } from '~/features/tournament/teams/composables/tourrnamentTeam';

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

async function loadWinnerTeams(winners: TournamentWinner[]) {
  const teamIds = winners
    .map((w) => w.teamId)
    .filter((id): id is string => !!id);
  await Promise.all(teamIds.map((id) => loadWinnerTeam(id)));
}

watch(
  () => [props.tournamentId, props.winners.map((w) => w.teamId).join(',')] as const,
  () => {
    void loadWinnerTeams(props.winners);
  },
  { immediate: true },
);
</script>
