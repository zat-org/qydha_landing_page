<template>
  <UModal class="w-[500px] ">

    <div class="flex flex-col">

      <div class="flex justify-end p-1">
        <UButton color="red" icon="material-symbols:close" variant="soft" @click="modal.close()" />
      </div>
      <UTabs :items="items" class="w-full p-5">
        <template #status="{ item }">
          <table class="w-full rounded-xl text-center table-fixed table-pin-rows my-3 shadow-lg">
            <thead>
              <tr class="h-12 bg-gray-200 dark:bg-slate-700 text-xs">
                <th class="text-gray-900 dark:text-white text-sm">
                  {{ m.usTeamName }}
                </th>
                <th style="width: 20%">
                  <UIcon name="fxemoji:squaredvs" class="text-2xl" />
                </th>
                <th class="text-gray-900 dark:text-white text-sm">
                  {{ m.themTeamName }}
                </th>
              </tr>
            </thead>
            <tbody>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs.moshtaraSunCount }}
                </td>
                <td class="px-0">مشترى صن</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.moshtaraSunCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.moshtaraHokmCount }}
                </td>
                <td class="px-0">مشترى حكم</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.moshtaraHokmCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.wonMoshtaraCount }}
                </td>
                <td class="px-0">مشتريات ناجحة</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.wonMoshtaraCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.lostMoshtaraCount }}
                </td>
                <td class="px-0">مشتريات خسرانة</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.lostMoshtaraCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.sra }}
                </td>
                <td class="px-0">سرا</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.sra }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.baloot }}
                </td>
                <td class="px-0">بلوت</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.baloot }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.khamsen }}
                </td>
                <td class="px-0">خمسين</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.khamsen }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.me2a }}
                </td>
                <td class="px-0">مية</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.me2a }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.rob3ome2a }}
                </td>
                <td class="px-0">أربعمية</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.rob3ome2a }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.sunKaboot }}
                </td>
                <td class="px-0">عدد الكبابيت صن</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.sunKaboot }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.hokmKaboot }}
                </td>
                <td class="px-0">عدد الكبابيت حكم</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.hokmKaboot }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template #news="{ item }">
          <div class="flex flex-col items-center gap-2 w-full overflow-y-scroll h-[500px]">
            <div class="flex justify-between gap-2 items-center font-bold">
              <div class="flex flex-col gap-1 justify-center items-center">
                <p class="text-xs md:text-lg text-center">{{ m.usTeamName.split("|")[0] }}</p>
                <p class="text-xs md:text-lg text-center">{{ m.usTeamName.split("|")[1] }}</p>
                <p>{{ game?.game.usGameScore }}</p>
              </div>
              <div class="flex flex-col gap-1 justify-center items-center">
                <UIcon name="fxemoji:squaredvs" class="text-lg md:text-2xl" />
                <p>:</p>
              </div>
              <div class="flex flex-col gap-1 justify-center items-center">
                <p class="text-xs md:text-lg text-center">{{ m.themTeamName.split("|")[0] }}</p>
                <p class="text-xs md:text-lg text-center">{{ m.themTeamName.split("|")[1] }}</p>
                <p>
                  {{ game?.game.themGameScore }}
                </p>
              </div>
            </div>

            <UBadge size="lg" v-if="game?.game.winner">
              الفائز :{{
                game.game.winner != null &&
                  (game.game.winner as string).toLowerCase() == "us"
                  ? m.usTeamName
                  : m.themTeamName
              }}
            </UBadge>


            <div v-for="sakka in game?.game.sakkas" class="w-full">


              <div v-for="mos in sakka.moshtaras">
                <div v-if="mos.state != 'Running'" class="w-full flex justify-center gap-20 items-center">
                  <p>{{ mos.usAbnat }}</p>
                  <p>{{ mos.themAbnat }}</p>
                </div>
              </div>
              <UDivider />
              <div class="w-full flex justify-center gap-20 items-center mt-5">
                <UBadge>{{ sakka.usSakkaScore }}</UBadge>
                <UBadge>{{ sakka.themSakkaScore }}</UBadge>
              </div>
            </div>
          </div>
        </template>
      </UTabs>

    </div>
    <!-- <UTooltip :text="game.state">
      <UButton color="gray" label="" />
    </UTooltip> -->
  </UModal>
</template>

<script lang="ts" setup>
import type { Match } from "~/models/group";
import { useMyTournamentStore } from "~/store/tournament";

const props = defineProps<{ m: Match }>();
const modal = useModal();
const gameStore = useMyTournamentStore()
const game = ref();

const start = async () => {
  const selectedGame = gameStore.games.find(g => g.id === props.m.qydhaGameId);
  if (selectedGame) {
    game.value = selectedGame;
  } else {
    console.log("before fetch ")
    await gameStore.fetchGame(props.m.qydhaGameId);
    game.value = gameStore.games.find(g => g.id === props.m.qydhaGameId);

  }
}
await start()

watch(gameStore.games, async () => {
  console.log("start watch")
  const selectedGame = gameStore.games.find(g => g.id === props.m.qydhaGameId);
  if (selectedGame) {
    game.value = selectedGame;
  } else {
    console.log("before fetch ")

  }
});


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
