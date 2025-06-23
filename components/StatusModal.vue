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
                <th class="text-gray-900 dark:text-white ">
                  {{ m.usTeamName }}
                </th>
                <th style="width: 20%">
                  <UIcon name="fxemoji:squaredvs" class="text-2xl" />
                </th>
                <th class="text-gray-900 dark:text-white ">
                  {{ m.themTeamName }}
                </th>
              </tr>
            </thead>
            <tbody>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.moshtaraSunCount }}
                </td>
                <td class="px-0 text-sm">مشترى صن</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.moshtaraSunCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.moshtaraHokmCount }}
                </td>
                <td class="px-0 text-sm">مشترى حكم</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.moshtaraHokmCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.wonMoshtaraCount }}
                </td>
                <td class="px-0 text-sm">مشتريات ناجحة</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.wonMoshtaraCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.lostMoshtaraCount }}
                </td>
                <td class="px-0 text-xs">مشتريات خسرانة</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.lostMoshtaraCount }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.sra }}
                </td>
                <td class="px-0 text-sm">سرا</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.sra }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.baloot }}
                </td>
                <td class="px-0 text-sm">بلوت</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.baloot }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.khamsen }}
                </td>
                <td class="px-0 text-sm">خمسين</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.khamsen }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.me2a }}
                </td>
                <td class="px-0 text-sm">مية</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.me2a }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.rob3ome2a }}
                </td>
                <td class="px-0 text-sm">أربعمية</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.rob3ome2a }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.sunKaboot }}
                </td>
                <td class="px-0 text-xs">عدد الكبابيت صن</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.sunKaboot }}
                </td>
              </tr>

              <tr class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusUs?.hokmKaboot }}
                </td>
                <td class="px-0 text-xs">عدد الكبابيت حكم</td>
                <td class="font-semibold text-md text-blue-950 dark:text-slate-50">
                  {{ statusThem?.hokmKaboot }}
                </td>
              </tr>
            </tbody>
          </table>
        </template>

        <template #news="{ item }">
          <div class="flex flex-col items-center gap-2 w-full overflow-y-scroll h-[500px] ">
            <div class="flex  gap-2 items-center    " >
              <div class="flex flex-col gap-1  items-center w-[200px] p-2  rounded-lg border " 
              :class="{'bg-green-400/20 text-green-500 border-green-300 ':game?.game.winner=='Us',
                'bg-red-400/20 text-red-500 border-red-300 ':game?.game.winner=='Them'
              }">
                <p class="text-xs  text-center">{{ m.usTeamName.split("|")[0] }}</p>
                <p class="text-xs  text-center">{{ m.usTeamName.split("|")[1] }}</p>
                <p class="text-xs  text-center bg-slate-300/60 w-1/2 px-2 py-1 rounded-lg"> {{ game?.game.usGameScore }}   صكة</p>
              </div>
              <div class="flex flex-col gap-1 justify-center items-center">
                <UIcon name="fxemoji:squaredvs" class="text-lg md:text-2xl" />
              
              </div>

              <div class="flex flex-col gap-1 justify-center items-center w-[200px] p-2  rounded-lg border "
              :class="{'bg-green-400/20 text-green-500 border-green-300 ':game?.game.winner=='Them',
                'bg-red-400/20 text-red-500 border-red-300 ':game?.game.winner=='Us'
              }"
              >
                <p class="text-xs  text-center">{{ m.themTeamName.split("|")[0] }}</p>
                <p class="text-xs  text-center">{{ m.themTeamName.split("|")[1] }}</p>
                <p class="text-xs  text-center bg-slate-300/60 w-1/2 px-2 py-1 rounded-lg"> 
                  {{ game?.game.themGameScore }} 
                </p>
              </div>
            </div>

         
             <div v-for="(sakka,index) in game?.game.sakkas"  class="flex flex-col gap-2 w-full bg-gradient-to-b from-slate-200 to-slate-300  py-1  px-2 rounded-lg ">

              <div class="w-full flex justify-center items-center  gap-[80px] ">
                
                <UBadge :color="sakka.winner && sakka.winner =='Us'?'green':'red'">{{ sakka.usSakkaScore }}</UBadge>
                  <p class="" > الصكة  {{index+1 }} </p>
                <UBadge :color="sakka.winner && sakka.winner =='Them'?'green':'red'">{{ sakka.themSakkaScore }}</UBadge>
              </div>
              <UDivider />
             <div class="flex flex-col">
               <div v-for="mos in sakka.moshtaras" >
                 <div v-if="mos.state != 'Running'" class="w-full flex justify-center gap-[230px] items-center">
                   <p>{{ mos.usAbnat }}</p>
                   <p>{{ mos.themAbnat }}</p>
                 </div>
               </div>
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
import type { IMatchData, IMathStat } from "~/models/MatchStat";
import { useMyTournamentStore } from "~/store/tournament";

const props = defineProps<{ m: Match }>();
const modal = useModal();
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
const game =computed(()=>{
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
