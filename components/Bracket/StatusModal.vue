<template>
  <UModal class="md:w-[1000px] sm:w-full " title="الاحصائيات" description="الاحصائيات للمباراة">



    <template #body>
      <UTabs :items="items" class="w-full p-2 sm:p-5">
        <template #status="{ item }">
          <table class="w-full rounded-xl text-center table-fixed table-pin-rows my-3 shadow-lg">
            <thead>
              <tr class="h-10 sm:h-12 bg-gray-200 dark:bg-slate-700">
                <th class="text-gray-900 dark:text-white text-[10px] sm:text-xs px-1">
                  {{ m.themTeamName }}
                </th>
                <th style="width: 20%">
                  <UIcon name="fxemoji:squaredvs" class="text-lg sm:text-2xl" />
                </th>
                <th class="text-gray-900 dark:text-white text-[10px] sm:text-xs px-1">
                  {{ m.usTeamName }}
                </th>
              </tr>
            </thead>
            <tbody>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.moshtaraSunCount }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">مشترى صن</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.moshtaraSunCount }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.moshtaraHokmCount }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">مشترى حكم</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.moshtaraHokmCount }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.wonMoshtaraCount }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">مشتريات ناجحة</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.wonMoshtaraCount }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.lostMoshtaraCount }}
                </td>
                <td class="px-0 text-[9px] sm:text-xs">مشتريات خسرانة</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.lostMoshtaraCount }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.sra }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">سرا</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                    {{ statusUs?.sra }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.baloot }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">بلوت</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.baloot }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.khamsen }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">خمسين</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.khamsen }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.me2a }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">مية</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.me2a }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.rob3ome2a }}
                </td>
                <td class="px-0 text-[10px] sm:text-sm">أربعمية</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.rob3ome2a }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.sunKaboot }}
                </td>
                <td class="px-0 text-[9px] sm:text-xs">عدد الكبابيت صن</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                    {{ statusUs?.sunKaboot }}
                </td>
              </tr>

              <tr class="h-7 sm:h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.hokmKaboot }}
                </td>
                <td class="px-0 text-[9px] sm:text-xs">عدد الكبابيت حكم</td>
                <td class="font-semibold text-xs sm:text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.hokmKaboot }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template #news="{ item }">
          <div class="flex flex-col items-center gap-2 sm:gap-4 w-full overflow-y-auto h-[500px] p-2 sm:p-4">
            <!-- Match Header -->
            <div class="flex gap-2 sm:gap-4 items-center w-full max-w-2xl">
              <!-- Team 1 -->
              <div class="flex-1 flex flex-col gap-1 sm:gap-2 items-center p-2 sm:p-4 rounded-xl border transition-colors duration-200" 
                :class="{
                  'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700': game?.game.winner == 'Them',
                  'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700': game?.game.winner == 'Us',
                  'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700': !game?.game.winner
                }">
                <div class="text-xs sm:text-sm font-medium dark:text-gray-200">
                  <p>{{ m.themTeamName.split("|")[0] }}</p>
                  <p>{{ m.themTeamName.split("|")[1] }}</p>
                </div>
                <span class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-gray-200/80 dark:bg-gray-700">
                  {{ game?.game.themGameScore }} صكة
                </span>
              </div>

              <!-- VS Icon -->
              <div class="flex items-center">
                <UIcon name="fxemoji:squaredvs" class="text-lg sm:text-2xl md:text-3xl text-gray-600 dark:text-gray-400" />
              </div>

              <!-- Team 2 -->
              <div class="flex-1 flex flex-col gap-1 sm:gap-2 items-center p-2 sm:p-4 rounded-xl border transition-colors duration-200"
                :class="{
                  'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700': game?.game.winner == 'Us',
                  'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700': game?.game.winner == 'Them',
                  'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700': !game?.game.winner
                }">
                <div class="text-xs sm:text-sm font-medium dark:text-gray-200">
                  <p>{{ m.usTeamName.split("|")[0] }}</p>
                  <p>{{ m.usTeamName.split("|")[1] }}</p>
                </div>
                <span class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full bg-gray-200/80 dark:bg-gray-700">
                  {{ game?.game.usGameScore }} صكة
                </span>
              </div>
            </div>

            <!-- Sakkas List -->
            <div class="w-full max-w-2xl space-y-2 sm:space-y-4">
              <div v-for="(sakka, index) in game?.game.sakkas" 
                class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Sakka Header -->
                <div class="bg-gray-50 dark:bg-gray-900 p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between items-center">
                    <UBadge 
                      :color="sakka.winner && sakka.winner == 'Them' ? 'success' : 'error'"
                      class="text-xs sm:text-sm"
                    >
                      {{ sakka.themSakkaScore }}
                    </UBadge>
                    <span class="font-medium text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      الصكة {{ index + 1 }}
                    </span>
                    <UBadge 
                      :color="sakka.winner && sakka.winner == 'Us' ? 'success' : 'error'"
                      class="text-xs sm:text-sm"
                    >
                      {{ sakka.usSakkaScore }}
                    </UBadge>
                  </div>
                </div>

                <!-- Moshtaras -->
                <div class="p-2 sm:p-3">
                  <div v-for="mos in sakka.moshtaras" class="py-0.5 sm:py-1">
                    <div v-if="mos.state != 'Running'" 
                      class="flex justify-between items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
import type { Match } from "~/models/group";
import type { IMatchData, IMathStat } from "~/models/MatchStat";
import { useMyTournamentStore } from "~/store/tournament";

const props = defineProps<{ m: Match }>();
const emit = defineEmits(['close'])
const gameStore = useMyTournamentStore()
// const game = ref<{id:string ,game:IMatchData, statistics:IMathStat}>();

const start = async () => {
  const selectedGame = gameStore.games.find(g => g.id === props.m.qydhaGameId);
  if (selectedGame) {
    //   game.value = selectedGame;
  } else {
    console.log("before fetch ")
    await gameStore.fetchGame(props.m.qydhaGameId);
    // game.value = gameStore.games.find(g => g.id === props.m.qydhaGameId);
  }
}
await start()
const game = computed(() => {
  const selectedGame = gameStore.games.find(g => g.id === props.m.qydhaGameId);
  return selectedGame
})

const statusUs = computed(() => {
  if (game.value)
    return game.value!.statistics.usStatistics;
});
const statusThem = computed(() => {
  if (game.value)
    return game.value!.statistics.themStatistics;
});





const items = [
  {
    slot: "status",
    label: "الاحصائيات",
  },
  {
    slot: "news",
    label: "النشرة",
  },
];
</script>

<style></style>
