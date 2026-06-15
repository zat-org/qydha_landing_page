<template>
  <UModal
    class="status-modal  max-w-4xl sm:max-w-2xl "
    title="الاحصائيات"
    description="الاحصائيات للمباراة"
  :ui="{body:'p-0 px-0 py-0 sm:p-0'}"
  >
    <template #body>
      <UTabs
        :items="items"
        class="w-full p-2 sm:p-4 md:p-5"
        :ui="{ list: 'overflow-x-auto [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]' }"
      >
        <template #status>
          <div
            class="my-2 w-full max-w-full mx-auto sm:my-3
              px-2 py-3 sm:px-4 sm:py-4 lg:px-5 lg:py-5
              border-2 sm:border-[2.5px] lg:border-[3px]
              border-slate-800 dark:border-slate-700
              rounded-xl sm:rounded-2xl
              bg-linear-to-b from-slate-50 via-slate-100 to-slate-200/80
              dark:from-zinc-900 dark:via-zinc-950 dark:to-black
              shadow-[0_8px_24px_rgba(15,23,42,0.1)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]
              transition-[background,box-shadow,border-color] duration-300"
          >
            <div class="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4">
           
              <div class="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 w-full px-1">
                <span class="max-w-36 sm:max-w-48 truncate">{{ themTeamPrimary }}</span>
             
                <span
                  class="shrink-0 text-base sm:text-xl md:text-2xl font-extrabold italic leading-none text-slate-800 dark:text-white dark:drop-shadow-md"
                  aria-hidden="true"
                >
                  Vs
                </span>
                <span class="max-w-36 sm:max-w-48 truncate">{{ usTeamPrimary }}</span>
              
              </div>
              
            </div>

            <div class="flex flex-col gap-1">
              <div
                v-for="row in statRows"
                :key="row.key"
                class="grid gap-1 sm:gap-1.5 md:gap-2
                  grid-cols-[minmax(2rem,1fr)_minmax(0,1.45fr)_minmax(2rem,1fr)]
                  min-[480px]:grid-cols-[minmax(2.5rem,1fr)_minmax(0,1.55fr)_minmax(2.5rem,1fr)]
                  sm:grid-cols-[minmax(0,1fr)_minmax(0,1.65fr)_minmax(0,1fr)]
                  lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.85fr)_minmax(0,1.1fr)]"
              >
                <div
                  class="flex items-center justify-center min-h-8 
                    px-1 sm:px-2 rounded-md sm:rounded-lg
                    bg-white text-slate-900 border border-slate-200/90
                    dark:bg-slate-50 dark:text-slate-900 dark:border-white/10
                    text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-center
                    shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                    transition-colors duration-300"
                >
                  {{ row.them ?? 0 }}
                </div>
                <div
                  class="flex items-center justify-center min-h-8 
                    px-1 sm:px-1.5 rounded-md sm:rounded-lg
                    bg-linear-to-b from-slate-800 to-slate-900 text-white
                    text-[10px] sm:text-xs md:text-sm font-bold text-center leading-tight
                    wrap-break-word hyphens-auto"
                >
                  {{ row.label }}
                </div>
                <div
                  class="flex items-center justify-center min-h-8 
                    px-1 sm:px-2 rounded-md sm:rounded-lg
                    bg-white text-slate-900 border border-slate-200/90
                    dark:bg-slate-50 dark:text-slate-900 dark:border-white/10
                    text-sm sm:text-base md:text-lg lg:text-xl font-extrabold text-center
                    shadow-sm dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                    transition-colors duration-300"
                >
                  {{ row.us ?? 0 }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #news>
          <div class="flex flex-col items-center gap-2 sm:gap-4 w-full overflow-y-auto min-h-[50vh] max-h-[min(70vh,32rem)] sm:max-h-[500px] p-2 sm:p-4">
            <div class="flex gap-2 sm:gap-4 items-center w-full max-w-2xl">
              <div class="flex-1 flex flex-col gap-1 sm:gap-2 items-center p-2 sm:p-4 rounded-xl border transition-colors duration-200" :class="{ 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700': game?.game.winner == 'Them', 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700': game?.game.winner == 'Us', 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700': !game?.game.winner }">
                <div class="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                  <p>{{ m.themTeamName.split("|")[0] }}</p>
                  <p>{{ m.themTeamName.split("|")[1] }}</p>
                </div>
                <span class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-gray-200/80 text-gray-800 dark:bg-gray-700 dark:text-gray-100">{{ game?.game.themGameScore }} صكة</span>
              </div>
              <div class="flex items-center">
                <UIcon name="fxemoji:squaredvs" class="text-lg sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-400" />
              </div>
              <div class="flex-1 flex flex-col gap-1 sm:gap-2 items-center p-2 sm:p-4 rounded-xl border transition-colors duration-200" :class="{ 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700': game?.game.winner == 'Us', 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700': game?.game.winner == 'Them', 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700': !game?.game.winner }">
                <div class="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                  <p>{{ m.usTeamName.split("|")[0] }}</p>
                  <p>{{ m.usTeamName.split("|")[1] }}</p>
                </div>
                <span class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-gray-200/80 text-gray-800 dark:bg-gray-700 dark:text-gray-100">{{ game?.game.usGameScore }} صكة</span>
              </div>
            </div>
            <div class="w-full max-w-2xl space-y-2 sm:space-y-4">
              <div v-for="(sakka, index) in game?.game.sakkas" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="bg-gray-50 dark:bg-gray-900 p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-center">
                    <UBadge :color="sakka.winner && sakka.winner == 'Them' ? 'success' : 'error'" class="text-xs sm:text-sm">{{ sakka.themSakkaScore }}</UBadge>
                    <span class="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">الصكة {{ index + 1 }}</span>
                    <UBadge :color="sakka.winner && sakka.winner == 'Us' ? 'success' : 'error'" class="text-xs sm:text-sm">{{ sakka.usSakkaScore }}</UBadge>
                  </div>
                </div>
                <div class="p-2 sm:p-3">
                  <div v-for="mos in sakka.moshtaras" class="py-0.5 sm:py-1">
                    <div v-if="mos.state != 'Running'" class="flex justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span>{{ mos.themAbnat }}</span>
                      <span>{{ mos.usAbnat }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UTabs>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { Match } from "~/features/tournament/models/group";
import type { IMathStat } from "~/features/tournament/models/MatchStat";
import { useMyTournamentStore } from "~/features/tournament/core/stores/tournament";
import qydhaLogo from "~/assets/images/qydha-logo.svg";

const props = defineProps<{ m: Match }>();
const gameStore = useMyTournamentStore();

const start = async () => {
  const selectedGame = gameStore.games.find((g) => g.id === props.m.qydhaGameId);
  if (!selectedGame) {
    await gameStore.fetchGame(props.m.qydhaGameId);
  }
};
await start();

const game = computed(() => gameStore.games.find((g) => g.id === props.m.qydhaGameId));
const statusUs = computed(() => game.value?.statistics.usStatistics);
const statusThem = computed(() => game.value?.statistics.themStatistics);

function teamPrimaryName(teamName: string) {
  const [primary] = teamName.split("|").map((part) => part.trim()).filter(Boolean);
  return primary || teamName;
}

const themTeamPrimary = computed(() => teamPrimaryName(props.m.themTeamName));
const usTeamPrimary = computed(() => teamPrimaryName(props.m.usTeamName));

type StatKey = keyof IMathStat["usStatistics"];

const statDefinitions: { key: StatKey; label: string }[] = [
  { key: "ekak", label: "عدد الاكك" },
  { key: "aklat", label: "الاكلات" },
  { key: "moshtaraSunCount", label: "مشترى صن" },
  { key: "moshtaraHokmCount", label: "مشترى حكم" },
  { key: "wonMoshtaraCount", label: "مشتريات ناجحة" },
  { key: "lostMoshtaraCount", label: "مشتريات خسرانة" },
  { key: "sra", label: "سرا" },
  { key: "baloot", label: "بلوت" },
  { key: "khamsen", label: "خمسين" },
  { key: "me2a", label: "مية" },
  { key: "rob3ome2a", label: "أربعمية" },
  { key: "sunKaboot", label: "عدد الكبوت صن" },
  { key: "hokmKaboot", label: "عدد الكبوت حكم" },
];

const statRows = computed(() =>
  statDefinitions.map(({ key, label }) => ({
    key,
    label,
    them: statusThem.value?.[key],
    us: statusUs.value?.[key],
  })),
);

const items = [
  { slot: "news", label: "النشرة" },
  { slot: "status", label: "الاحصائيات" },
];
</script>
